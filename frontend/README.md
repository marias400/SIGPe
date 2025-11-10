# Frontend - SIGPe

Sistema Integral de Gestión de Pedidos - Aplicación Web Frontend

## 📋 Descripción

Frontend desarrollado con **React 19** y **Vite** que proporciona la interfaz de usuario para el sistema SIGPe. Incluye gestión de órdenes, autenticación, dashboard administrativo, y visualización de modelos 3D.

## 🚀 Configuración del Entorno

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Backend ejecutándose (ver [README del Backend](../backend/README.md))

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno (Opcional)

Actualmente, la URL del backend está configurada directamente en el código como `http://localhost:8000/api`. Si deseas usar variables de entorno para diferentes ambientes, puedes crear un archivo `.env` en la raíz del directorio `frontend/`:

```env
# URL del backend API
VITE_API_URL=http://localhost:8000/api
```

**Nota:** En Vite, las variables de entorno deben comenzar con `VITE_` para ser accesibles en el código del cliente.

Luego, actualiza los archivos que usan `API_URL` para usar `import.meta.env.VITE_API_URL`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
```

**Archivos que actualmente usan API_URL:**
- `src/auth/AuthContext.jsx`
- `src/views/Cotizacion.jsx`
- `src/components/Navbar.jsx`
- `src/components/dashboard/UsersSection.jsx`
- Y otros componentes que hacen llamadas al API

### 3. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

El servidor de desarrollo estará disponible en: `http://localhost:5173` (puerto por defecto de Vite)

### 4. Compilar para Producción

```bash
npm run build
```

Los archivos compilados se generarán en el directorio `dist/`.

### 5. Previsualizar Build de Producción

```bash
npm run preview
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
│   └── assets/          # Imágenes y recursos
├── src/
│   ├── auth/            # Contexto y lógica de autenticación
│   │   └── AuthContext.jsx
│   ├── components/      # Componentes reutilizables
│   │   ├── dashboard/   # Componentes del dashboard
│   │   └── user-details/ # Componentes de detalles de usuario
│   ├── views/           # Vistas/páginas principales
│   │   ├── Cotizacion.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ...
│   ├── styles/          # Archivos CSS
│   │   ├── global.css
│   │   └── ...
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── index.html           # HTML principal
├── package.json         # Dependencias y scripts
├── vite.config.js       # Configuración de Vite
└── eslint.config.js     # Configuración de ESLint
```

## 📦 Dependencias Principales

### Producción

- **react** (^19.1.1): Biblioteca principal de React
- **react-dom** (^19.1.1): Renderizado de React en el DOM
- **react-router-dom** (^7.9.4): Enrutamiento de la aplicación
- **axios** (^1.13.1): Cliente HTTP para peticiones al API
- **@fortawesome/react-fontawesome**: Iconos FontAwesome

### Desarrollo

- **vite** (^7.1.7): Build tool y servidor de desarrollo
- **@vitejs/plugin-react**: Plugin de React para Vite
- **eslint**: Linter para JavaScript/React

## 🔐 Autenticación

El frontend usa **JWT (JSON Web Tokens)** para la autenticación. El token se almacena en `localStorage` y se incluye en todas las peticiones autenticadas.

### Flujo de Autenticación

1. **Login:** El usuario ingresa credenciales → se obtiene el token → se guarda en `localStorage`
2. **Verificación:** Al cargar la app, se verifica si existe un token válido
3. **Peticiones:** Todas las peticiones al API incluyen el token en el header `Authorization: Bearer <token>`
4. **Logout:** Se elimina el token de `localStorage`

### Contexto de Autenticación

El `AuthContext` proporciona:
- `user`: Usuario actual autenticado
- `login(username, password)`: Función para iniciar sesión
- `logout()`: Función para cerrar sesión
- `register(name, lastname, email, password)`: Función para registrar usuario
- `authFetch(url, options)`: Función helper para peticiones autenticadas

## 🎨 Estilos

El proyecto usa CSS modular por componente. Cada componente tiene su archivo CSS correspondiente en `src/styles/`.

### Estilos Globales

- `global.css`: Estilos globales y variables CSS

## 🛣️ Rutas de la Aplicación

Las rutas están definidas en `App.jsx` usando React Router:

- `/` - Página de inicio
- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/cotizacion` - Formulario de cotización/creación de orden
- `/dashboard` - Dashboard administrativo (requiere autenticación)
- `/user/:id` - Detalles de usuario (requiere autenticación)

## 🔌 Integración con el Backend

### Endpoints Principales Utilizados

- `POST /api/auth/token` - Login
- `GET /api/auth/me` - Obtener usuario actual
- `GET /api/users/me` - Obtener datos del usuario autenticado
- `POST /api/users` - Registrar nuevo usuario
- `GET /api/orders` - Obtener órdenes
- `POST /api/orders` - Crear nueva orden
- `GET /api/specialities` - Obtener especialidades
- `GET /api/prostheses` - Obtener prótesis
- `GET /api/materials` - Obtener materiales
- `GET /api/notifications` - Obtener notificaciones
- Y más...

### Configuración de CORS

Asegúrate de que el backend tenga configurado CORS para permitir peticiones desde el frontend. En el backend, configura `BACKEND_CORS_ORIGINS` en el archivo `.env`:

```env
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint
```

## 📱 Características Principales

### Dashboard Administrativo

- Gestión de usuarios
- Gestión de órdenes
- Gestión de prótesis
- Gestión de notificaciones
- Visualización de estadísticas

### Formulario de Cotización

- Selección de especialidad médica
- Selección de prótesis
- Selección de tamaño y material
- Carga de modelos 3D (integración con AWS S3)
- Información médica adicional (para doctores)
- Cálculo automático de precios

### Sistema de Notificaciones

- Notificaciones en tiempo real
- Contador de notificaciones no leídas
- Dropdown de notificaciones en el navbar

## 🐛 Solución de Problemas

### Error de conexión al backend

- Verifica que el backend esté ejecutándose en `http://localhost:8000`
- Revisa la configuración de CORS en el backend
- Verifica que la URL del API sea correcta en los componentes

### Error de módulos no encontrados

- Ejecuta `npm install` para reinstalar dependencias
- Verifica que Node.js esté actualizado

### Error de autenticación

- Verifica que el token esté guardado en `localStorage`
- Revisa la consola del navegador para errores de red
- Asegúrate de que el backend esté configurado correctamente

### Problemas con Vite

- Limpia la caché: `rm -rf node_modules/.vite`
- Reinstala dependencias: `rm -rf node_modules && npm install`

## 📝 Notas de Desarrollo

### Convenciones de Código

- Usar componentes funcionales con hooks
- Usar `AuthContext` para autenticación
- Usar `authFetch` para peticiones autenticadas
- Mantener estilos en archivos CSS separados

### Mejoras Futuras Sugeridas

- Centralizar la configuración de `API_URL` usando variables de entorno
- Implementar manejo de errores global
- Agregar tests unitarios y de integración
- Implementar lazy loading para rutas
- Agregar loading states globales
- Implementar sistema de notificaciones toast

## 📚 Recursos

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React Router](https://reactrouter.com/)
- [Documentación de FontAwesome](https://fontawesome.com/docs)

## 🔄 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🌐 Despliegue

Para desplegar en producción:

1. Configura las variables de entorno (si las usas)
2. Compila la aplicación: `npm run build`
3. Los archivos en `dist/` pueden ser servidos por cualquier servidor web estático (Nginx, Apache, etc.)
4. Configura el servidor para redirigir todas las rutas a `index.html` (para React Router)

### Ejemplo de configuración Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/a/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
