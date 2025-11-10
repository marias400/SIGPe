"""add s3_key and s3_url to 3d_models table

Revision ID: add_s3_fields_3d_models
Revises: ebc0d6244061
Create Date: 2025-01-27 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_s3_fields_3d_models'
down_revision: Union[str, None] = 'ebc0d6244061'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Verificar si los campos ya existen antes de agregarlos
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    
    # Verificar si la tabla existe
    tables = inspector.get_table_names()
    if '3d_models' not in tables:
        # Si la tabla no existe, no podemos agregar columnas
        return
    
    # Verificar qué columnas ya existen
    columns = [col['name'] for col in inspector.get_columns('3d_models')]
    
    # Agregar campos s3_key y s3_url solo si no existen
    if 's3_key' not in columns:
        op.add_column('3d_models', sa.Column('s3_key', sa.String(length=255), nullable=True))
    if 's3_url' not in columns:
        op.add_column('3d_models', sa.Column('s3_url', sa.String(length=512), nullable=True))


def downgrade() -> None:
    # Verificar si los campos existen antes de eliminarlos
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    
    # Verificar si la tabla existe
    tables = inspector.get_table_names()
    if '3d_models' not in tables:
        return
    
    # Verificar qué columnas existen
    columns = [col['name'] for col in inspector.get_columns('3d_models')]
    
    # Eliminar campos s3_key y s3_url solo si existen
    if 's3_url' in columns:
        op.drop_column('3d_models', 's3_url')
    if 's3_key' in columns:
        op.drop_column('3d_models', 's3_key')

