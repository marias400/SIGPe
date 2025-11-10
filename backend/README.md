# Backend - SIGPe

Sistema Integral de Gestión de Pedidos - API Backend

## 📋 Descripción

Backend desarrollado con **FastAPI** (Python) que gestiona la lógica de negocio del sistema SIGPe. Incluye autenticación JWT, gestión de órdenes, modelos 3D, notificaciones y almacenamiento en AWS S3.

## 🚀 Configuración del Entorno

### Prerrequisitos

- Python 3.11 o superior
- MySQL/MariaDB 8.0 o superior
- Cuenta de AWS con acceso a S3 (opcional, para almacenamiento de modelos 3D)

### 1. Crear Entorno Virtual

```bash
cd backend
python -m venv venv
```

### 2. Activar Entorno Virtual

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del directorio `backend/` con el siguiente contenido:

```env
# Configuración del servidor
DOMAIN=localhost
ENVIRONMENT=local

# JWT - Generar una clave secreta segura (puedes usar: openssl rand -hex 32)
JWT_SECRET_KEY=tu_clave_secreta_jwt_aqui

# CORS - Orígenes permitidos (separados por comas)
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Configuración de MySQL/MariaDB
MYSQL_USERNAME=root
MYSQL_PASSWORD=tu_contraseña_mysql
MYSQL_SERVER=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=sigpe_test

# Configuración de AWS S3 (opcional, para almacenamiento de modelos 3D)
AWS_ACCESS_KEY_ID=tu_access_key_id
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=nombre_del_bucket
AWS_S3_PRESIGNED_URL_EXPIRATION=3600
```

**Nota:** Asegúrate de reemplazar los valores con tus credenciales reales. El archivo `.env` está en `.gitignore` y no se subirá al repositorio.

### 5. Configurar Base de Datos

#### Opción A: Cargar desde el archivo SQL (Recomendado)

1. Asegúrate de que MySQL/MariaDB esté ejecutándose
2. Ejecuta el siguiente comando para crear y cargar la base de datos:

```bash
mysql -u root -p < ../database/db_schema.sql
```

O desde MySQL Workbench o cualquier cliente MySQL, ejecuta el contenido del archivo `database/db_schema.sql`.

#### Opción B: Usar Alembic (Migraciones)

Si prefieres usar migraciones de Alembic:

```bash
# Crear la base de datos manualmente
mysql -u root -p
CREATE DATABASE sigpe_test;

# Ejecutar migraciones
alembic upgrade head
```

**Nota:** El archivo `db_schema.sql` incluye la estructura completa de la base de datos, datos de ejemplo, triggers y stored procedures.

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### `users`
Almacena información de todos los usuarios del sistema.
- **Campos principales:** `id`, `email`, `name`, `lastname`, `password`, `user_type`, `is_active`, `is_deleted`
- **Tipos de usuario:** `admin`, `doctor`, `technician`, `patient`, `cliente_particular`

#### `doctors`
Información específica de los doctores.
- **Campos:** `user_id` (FK a users), `license_number`, `institution_name`, `speciality`, `is_verified`
- **Relación:** 1:1 con `users`

#### `patients`
Información de pacientes asociados a doctores.
- **Campos:** `id`, `doctor_id` (FK a doctors), `name`, `lastname`
- **Relación:** Muchos pacientes por doctor

#### `specialities`
Especialidades médicas disponibles.
- **Campos:** `id`, `name`
- **Ejemplos:** Traumatología, Ortopedia, Rehabilitación, Odontología, Terapia Ocupacional

#### `prostheses`
Catálogo de prótesis disponibles.
- **Campos:** `id`, `speciality_id` (FK), `name`, `description`, `base_price`, `img_url`
- **Relación:** Muchas prótesis por especialidad

#### `materials`
Materiales disponibles para impresión 3D.
- **Campos:** `id`, `name`, `price_modifier`, `amount_mts`
- **Ejemplos:** PLA Blanco, ABS Negro, PETG Transparente, TPU Flexible, Resina Dental, Nylon Reforzado

#### `sizes`
Tamaños disponibles para prótesis.
- **Campos:** `id`, `name`, `price_modifier`
- **Valores:** Pequeño (0%), Mediano (10%), Grande (20%)

#### `orders`
Órdenes de pedidos del sistema.
- **Campos principales:**
  - `id`, `user_id` (FK), `technician_id`, `prosthesis_id` (FK), `material_id` (FK)
  - `is_medical`, `has_design`, `processing_level`, `current_stage`
  - `delivery_date`, `specification`, `full_price`
  - `is_completed`, `created_at`, `updated_at`

#### `medical_orders`
Información médica adicional para órdenes médicas.
- **Campos:** `order_id` (FK), `patient_id` (FK), `urgency_level`, `pathology`, `medical_observations`, `priority_level`
- **Niveles de urgencia:** Estándar, Prioritario, Urgente

#### `3d_models`
Modelos 3D asociados a órdenes.
- **Campos:** `id`, `order_id` (FK), `file_name`, `file_format`, `file_size`, `file_path`
- **S3:** `s3_key`, `s3_url` (para almacenamiento en AWS S3)

#### `notifications`
Notificaciones del sistema.
- **Campos:** `id`, `user_id` (FK), `order_id` (FK), `message`, `type`, `current_stage`, `is_read`, `created_at`

#### `observations`
Observaciones y comentarios sobre órdenes.
- **Campos:** `id`, `user_id` (FK), `order_id` (FK), `type`, `comment`, `created_at`

### Tablas de Relación

- **`prosthesis_size`:** Relación muchos a muchos entre prótesis y tamaños
- **`prosthesis_material`:** Relación muchos a muchos entre prótesis y materiales

## 🔧 Triggers de la Base de Datos

### 1. `trg_before_order_insert`
**Tabla:** `orders`  
**Momento:** BEFORE INSERT  
**Función:** Calcula automáticamente el precio total (`full_price`) de una orden antes de insertarla.

**Lógica:**
- Obtiene el precio base de la prótesis seleccionada
- Aplica modificadores de material (`price_modifier` de `materials`)
- Aplica modificadores de tamaño (`price_modifier` de `sizes` a través de `prosthesis_size`)
- Calcula: `precio_total = precio_base + (precio_base * modificador_tamaño) + (precio_base * modificador_material)`

**Ejemplo:**
```sql
-- Si una prótesis cuesta $10,000, material tiene 5% de modificador y tamaño tiene 10%:
-- precio_total = 10000 + (10000 * 0.10) + (10000 * 0.05) = 11,500
```

### 2. `trg_after_order_insert`
**Tabla:** `orders`  
**Momento:** AFTER INSERT  
**Función:** Crea automáticamente una notificación cuando se inserta una nueva orden.

**Acción:**
- Inserta un registro en `notifications` con:
  - `user_id`: El usuario que creó la orden
  - `order_id`: El ID de la orden recién creada
  - `message`: "Orden realizada"
  - `type`: "aviso"
  - `current_stage`: "en revision"
  - `is_read`: 0 (no leída)

### 3. `trigger_after_prosthesis_price_update`
**Tabla:** `prostheses`  
**Momento:** AFTER UPDATE  
**Función:** Recalcula automáticamente los precios de todas las órdenes cuando se actualiza el precio base de una prótesis.

**Lógica:**
- Solo se ejecuta si `base_price` cambió
- Recorre todas las órdenes que usan esa prótesis
- Llama al stored procedure `sp_calculate_full_price_silent` para cada orden
- Actualiza el `full_price` de todas las órdenes afectadas

## 📦 Stored Procedures

### 1. `sp_calculate_full_price`
**Parámetros:**
- `p_order_id` (IN): ID de la orden a calcular

**Función:** Calcula y actualiza el precio total de una orden específica, retornando el precio calculado.

**Lógica:**
1. Obtiene `prosthesis_id` y `material_id` de la orden
2. Valida que exista una prótesis asignada (lanza error si no)
3. Obtiene el precio base de la prótesis
4. Obtiene modificadores de material y tamaño
5. Calcula el precio total
6. Actualiza `full_price` en la orden
7. Retorna el precio calculado

**Uso:**
```sql
CALL sp_calculate_full_price(1);
-- Retorna: calculated_price
```

**Errores:**
- Si la orden no tiene prótesis asignada, lanza error SQLSTATE '45000'

### 2. `sp_calculate_full_price_silent`
**Parámetros:**
- `p_order_id` (IN): ID de la orden a calcular

**Función:** Versión silenciosa que calcula el precio sin retornar valores ni lanzar errores. Usada por triggers.

**Lógica:**
- Similar a `sp_calculate_full_price` pero:
  - No retorna valores
  - Si no hay prótesis asignada, simplemente sale sin error
  - Diseñada para ser llamada desde triggers

**Uso:**
```sql
CALL sp_calculate_full_price_silent(1);
-- No retorna nada, solo actualiza el precio
```

## 🏃 Ejecutar el Servidor

### Modo Desarrollo

```bash
fastapi dev main.py
```

El servidor estará disponible en: `http://localhost:8000`

### Modo Producción

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Documentación Interactiva

Una vez ejecutando el servidor, puedes acceder a:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 📁 Estructura del Proyecto

```
backend/
├── alembic/              # Migraciones de base de datos
├── auth/                 # Módulo de autenticación
│   ├── models/          # Modelos de tokens
│   ├── routes/          # Rutas de autenticación
│   ├── services/        # Lógica de autenticación
│   └── utils/           # Utilidades de autenticación
├── core/                # Configuración central
│   ├── config.py        # Configuración y variables de entorno
│   ├── config_loader.py # Cargador de configuración
│   └── database.py      # Configuración de SQLAlchemy
├── doctor/              # Módulo de doctores
├── material/            # Módulo de materiales
├── model3d/             # Módulo de modelos 3D (con S3)
├── notification/        # Módulo de notificaciones
├── observation/         # Módulo de observaciones
├── order/               # Módulo de órdenes
├── patient/             # Módulo de pacientes
├── prosthesis/          # Módulo de prótesis
├── size/                # Módulo de tamaños
├── speciality/          # Módulo de especialidades
├── user/                # Módulo de usuarios
├── scripts/             # Scripts auxiliares
│   └── configure_s3_cors.py
├── main.py              # Punto de entrada de la aplicación
├── requirements.txt     # Dependencias de Python
└── alembic.ini         # Configuración de Alembic
```

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación.

- **Endpoint de login:** `POST /api/auth/login`
- **Formato:** OAuth2 Password Flow
- **Token:** Bearer token en el header `Authorization`

## 🌐 Integración con AWS S3

El sistema puede almacenar modelos 3D en AWS S3. Para configurarlo:

1. Crea un bucket en AWS S3
2. Configura las credenciales en `.env`
3. Ejecuta el script de configuración CORS (opcional):
```bash
python scripts/configure_s3_cors.py
```

## 🧪 Testing

```bash
# Ejecutar tests (si están configurados)
pytest
```

## 📝 Notas Adicionales

- El sistema usa **Alembic** para migraciones de base de datos
- Las contraseñas se almacenan con hash usando **bcrypt**
- El sistema soporta múltiples tipos de usuarios con diferentes permisos
- Las notificaciones se crean automáticamente mediante triggers
- Los precios se calculan automáticamente mediante triggers y stored procedures

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MySQL esté ejecutándose
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Error de importación de módulos
- Asegúrate de estar en el entorno virtual
- Verifica que todas las dependencias estén instaladas

### Error de JWT
- Verifica que `JWT_SECRET_KEY` esté configurado en `.env`
- Asegúrate de usar una clave segura

## 📚 Recursos

- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación de SQLAlchemy](https://docs.sqlalchemy.org/)
- [Documentación de Alembic](https://alembic.sqlalchemy.org/)
