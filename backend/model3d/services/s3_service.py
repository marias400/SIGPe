import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
from core.config_loader import settings
from datetime import datetime
import uuid
import os


def get_s3_client():
    """Crea y retorna un cliente de S3 configurado"""
    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
        raise HTTPException(
            status_code=500,
            detail="AWS credentials not configured"
        )
    
    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )


def generate_presigned_upload_url(file_name: str, file_type: str, expiration: int = None) -> dict:
    """
    Genera una URL prefirmada para subir un archivo a S3
    
    Args:
        file_name: Nombre del archivo original
        file_type: Tipo MIME del archivo (ej: 'application/octet-stream', 'model/stl')
        expiration: Tiempo de expiración en segundos (default: AWS_S3_PRESIGNED_URL_EXPIRATION)
    
    Returns:
        dict con 'upload_url' y 's3_key'
    """
    if not settings.AWS_S3_BUCKET_NAME:
        raise HTTPException(
            status_code=500,
            detail="S3 bucket name not configured"
        )
    
    # Generar un nombre único para el archivo en S3
    file_extension = os.path.splitext(file_name)[1]
    unique_id = uuid.uuid4().hex
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    s3_key = f"models3d/{timestamp}/{unique_id}{file_extension}"
    
    # Determinar el tipo de contenido
    content_type_map = {
        '.stl': 'application/octet-stream',
        '.obj': 'application/octet-stream',
        '.gltf': 'model/gltf+json',
        '.glb': 'model/gltf-binary',
    }
    content_type = content_type_map.get(file_extension.lower(), file_type or 'application/octet-stream')
    
    # Configurar condiciones para la subida
    conditions = [
        {'Content-Type': content_type},
        ['content-length-range', 1, 100 * 1024 * 1024]  # Máximo 100MB
    ]
    
    expiration_time = expiration or settings.AWS_S3_PRESIGNED_URL_EXPIRATION
    
    try:
        s3_client = get_s3_client()
        
        presigned_url = s3_client.generate_presigned_post(
            Bucket=settings.AWS_S3_BUCKET_NAME,
            Key=s3_key,
            Fields={'Content-Type': content_type},
            Conditions=conditions,
            ExpiresIn=expiration_time
        )
        
        return {
            'upload_url': presigned_url['url'],
            'fields': presigned_url['fields'],
            's3_key': s3_key,
            's3_url': f"https://{settings.AWS_S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
        }
    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating presigned URL: {str(e)}"
        )


def generate_presigned_download_url(s3_key: str, expiration: int = 3600) -> str:
    """
    Genera una URL prefirmada para descargar un archivo de S3
    
    Args:
        s3_key: Clave del archivo en S3
        expiration: Tiempo de expiración en segundos (default: 1 hora)
    
    Returns:
        URL prefirmada para descargar el archivo
    """
    if not settings.AWS_S3_BUCKET_NAME:
        raise HTTPException(
            status_code=500,
            detail="S3 bucket name not configured"
        )
    
    try:
        s3_client = get_s3_client()
        
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': settings.AWS_S3_BUCKET_NAME, 'Key': s3_key},
            ExpiresIn=expiration
        )
        
        return presigned_url
    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating download URL: {str(e)}"
        )


def delete_file_from_s3(s3_key: str) -> bool:
    """
    Elimina un archivo de S3
    
    Args:
        s3_key: Clave del archivo en S3
    
    Returns:
        True si se eliminó exitosamente, False en caso contrario
    """
    if not settings.AWS_S3_BUCKET_NAME:
        return False
    
    try:
        s3_client = get_s3_client()
        s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=s3_key)
        return True
    except ClientError as e:
        print(f"Error deleting file from S3: {str(e)}")
        return False


def configure_s3_cors(allowed_origins: list[str] = None) -> bool:
    """
    Configura CORS en el bucket de S3 para permitir subidas desde el frontend
    
    Args:
        allowed_origins: Lista de orígenes permitidos (ej: ['http://localhost:3000', 'https://tudominio.com'])
                        Si es None, usa el origen del frontend desde settings
    
    Returns:
        True si se configuró exitosamente, False en caso contrario
    """
    if not settings.AWS_S3_BUCKET_NAME:
        return False
    
    # Si no se proporcionan orígenes, usar los de CORS del backend
    if allowed_origins is None:
        if isinstance(settings.BACKEND_CORS_ORIGINS, list):
            allowed_origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
        elif isinstance(settings.BACKEND_CORS_ORIGINS, str):
            allowed_origins = [settings.BACKEND_CORS_ORIGINS]
        else:
            # Por defecto, permitir localhost para desarrollo
            allowed_origins = ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000']
    
    cors_configuration = {
        'CORSRules': [
            {
                'AllowedHeaders': ['*'],
                'AllowedMethods': ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                'AllowedOrigins': allowed_origins,
                'ExposeHeaders': ['ETag', 'x-amz-server-side-encryption', 'x-amz-request-id', 'x-amz-id-2'],
                'MaxAgeSeconds': 3000
            }
        ]
    }
    
    try:
        s3_client = get_s3_client()
        s3_client.put_bucket_cors(
            Bucket=settings.AWS_S3_BUCKET_NAME,
            CORSConfiguration=cors_configuration
        )
        return True
    except ClientError as e:
        print(f"Error configuring CORS on S3 bucket: {str(e)}")
        return False

