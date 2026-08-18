***

![SIGPe](https://raw.githubusercontent.com/marias400/SIGPe/main/frontend/src/public/assets/LogoSIGPe.png)

***

**Idioma / Language:** Español | [English](./README.en.md)

***

## &#x1F5A5;&#xFE0F; Sobre el Proyecto

&nbsp;&nbsp;&nbsp;El **Sistema Integral de Gestión de Pedidos (SIGPe)** es una plataforma full-stack pensada para el Laboratorio de Diseño y Fabricación Digital de la UNLaR, que administra pedidos de piezas impresas en 3D (prótesis, férulas y órtesis) para un hospital universitario. El sistema cubre todo el proceso: registro y toma de pedidos, selección de especialidad médica / prótesis / material / tamaño, carga de modelos 3D, seguimiento del estado de fabricación y notificaciones para pacientes, doctores y técnicos.

## &#x1F3D7;&#xFE0F; Arquitectura y Stack Tecnológico

&nbsp;&nbsp;&nbsp;El proyecto está dividido en dos aplicaciones independientes que se comunican vía API REST. El **backend** está construido con **FastAPI (Python)** y **SQLAlchemy**, expone la lógica de negocio (autenticación **JWT**, gestión de órdenes, prótesis, materiales, notificaciones) y persiste todo en una base de datos **MySQL**, incluyendo triggers y stored procedures para el cálculo automático de precios. El almacenamiento de modelos 3D es opcional vía **AWS S3**.

&nbsp;&nbsp;&nbsp;El **frontend** es una SPA en **React 19 + Vite**, con ruteo mediante **React Router**, consumo de la API vía `fetch`/**axios**, y un `AuthContext` que maneja el token JWT en `localStorage`. Incluye un dashboard administrativo, un formulario de cotización/creación de órdenes y un sistema de notificaciones.

## &#x1F680; Despliegue

&nbsp;&nbsp;&nbsp;El proyecto está desplegado en **Railway**, en un único proyecto (`sigpe`) con tres servicios sobre la misma red privada:

| Servicio | Descripción | URL pública |
|---|---|---|
| **frontend** | SPA React/Vite (`npm run build` + `vite preview`) | [frontend-production-e6c55.up.railway.app](https://frontend-production-e6c55.up.railway.app) |
| **backend** | API FastAPI (`uvicorn`), `rootDirectory=backend` | [backend-production-89b01.up.railway.app](https://backend-production-89b01.up.railway.app) — docs interactivas en `/docs` |
| **MySQL-gOF5** | Base de datos MySQL 9.4 (imagen oficial) | sólo accesible por red privada de Railway |

### Cómo está armado cada servicio

- **backend**: build con Railpack (detecta Python/`requirements.txt`), `rootDirectory: backend`, `startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT`, y un `preDeployCommand: python scripts/load_schema.py` que carga el schema (`database/db_schema.sql`) en el MySQL de Railway **de forma idempotente** — si la base ya tiene datos, no vuelve a correr el dump. Las variables `MYSQL_SERVER`, `MYSQL_PORT`, `MYSQL_USERNAME` y `MYSQL_PASSWORD` están enlazadas por referencia al servicio `MySQL-gOF5` (`${{MySQL-gOF5.MYSQLHOST}}`, etc.), y `MYSQL_DATABASE=sigpe_test`.
- **frontend**: `rootDirectory: frontend`, `buildCommand: npm run build`, `startCommand: npm run preview -- --host 0.0.0.0 --port $PORT`. La URL del backend se inyecta en build time vía `VITE_API_URL`.
- **MySQL-gOF5**: imagen `mysql:9.4` con volumen persistente montado en `/var/lib/mysql`.

### Variables de entorno relevantes

**backend:** `DOMAIN`, `ENVIRONMENT`, `JWT_SECRET_KEY`, `BACKEND_CORS_ORIGINS`, `MYSQL_USERNAME`, `MYSQL_PASSWORD`, `MYSQL_SERVER`, `MYSQL_PORT`, `MYSQL_DATABASE` (+ opcionalmente `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME` para subir modelos 3D a S3).

**frontend:** `VITE_API_URL` (URL pública del backend + `/api`).

### Problemas encontrados y resueltos durante el despliegue

Al terminar de desplegar el servicio, encontramos y corregimos lo siguiente:

1. **Backend/BD no conectaban**: las variables `MYSQL_*` del backend no estaban enlazadas al servicio real de MySQL del proyecto (nombres distintos a las variables que expone el plugin). Se corrigió apuntándolas por referencia al servicio `MySQL-gOF5`.
2. **`preDeployCommand` roto**: el backend tenía configurado `python scripts/load_schema.py`, pero ese archivo no existía en el repo. Se escribió el script (parsea el dump de MySQL respetando los `DELIMITER` de triggers/procedures, y es idempotente).
3. **El schema no llegaba al contenedor**: al usar `rootDirectory: backend`, Railway sólo empaqueta esa carpeta — `database/db_schema.sql` (en la raíz del repo) quedaba fuera del build. Se agregó una copia en `backend/database/db_schema.sql`.
4. **Frontend sin desplegar**: no existía el servicio en Railway. Se creó apuntando al mismo repo con `rootDirectory: frontend`.
5. **URL del backend hardcodeada**: el frontend tenía `http://localhost:8000/api` escrito a fuego en 12 archivos. Se reemplazó por `import.meta.env.VITE_API_URL`, configurable por entorno.
6. **Vite bloqueaba el dominio de Railway**: Vite 5+ rechaza por defecto cualquier `Host` header que no reconoce (`Blocked request. This host is not allowed`), lo cual rompe `vite preview` detrás del proxy de Railway. Se habilitó `preview.allowedHosts: true` en `vite.config.js`.

## &#x1F465; Integrantes del equipo
- **Agustín Álvarez** — Product Owner / Scrum Manager
- **Mariano Arias Simone** — Scrum Master / Desarrollador Back-End
- **Mateo Sánchez** — Desarrollador Front-End
- **Lucas de la Fuente** — Desarrollador Front-End
- **Jorge Padula** — Desarrollador Back-End
- **Jeremías Álvarez** — QA/Testing
- **Nahuel Peralta** — UX/UI

## &#x1F310; Sitios de referencia
- **[Scrum Guide (guía oficial de Scrum)](https://scrumguides.org/)**
- **[Tecno Lanema](https://www.tecnolanema.pt/)** — Referencia para la página de inicio y uso de imágenes
- **[RGBESTUDIO](https://rgbestudio.com.ar/)** — Ideas para mostrar servicios, información del laboratorio y tipos de materiales con ventajas y desventajas
- **[ClickUp](https://clickup.com)** — Idea de cómo se pueden mostrar las especialidades médicas y las impresiones disponibles para cada una
- **[RAOMED](https://raomed.com.ar/)**

## &#x1F6E0;&#xFE0F; Desarrollo local

&nbsp;&nbsp;&nbsp;Para levantar el proyecto en tu máquina:

- **[Backend](backend/README.md)**
- **[Frontend](frontend/README.md)**
