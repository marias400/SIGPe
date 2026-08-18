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


## &#x1F465; Integrantes del equipo
- **Agustín Álvarez** — Product Owner / Scrum Manager
- **Mariano Arias Simone** — Scrum Master / Desarrollador Back-End
- **Mateo Sánchez** — Desarrollador Front-End
- **Lucas de la Fuente** — Desarrollador Front-End
- **Jorge Padula** — Desarrollador Back-End

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
