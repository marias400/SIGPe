***

![SIGPe](https://raw.githubusercontent.com/marias400/SIGPe/main/frontend/src/public/assets/LogoSIGPe.png)

***

**Language / Idioma:** [Español](./README.md) | English

***

## &#x1F5A5;&#xFE0F; About the Project

&nbsp;&nbsp;&nbsp;The **Comprehensive Order Management System (SIGPe)** is a full-stack platform built for UNLaR's Digital Design and Manufacturing Lab, which manages orders for 3D-printed parts (prostheses, splints, and orthoses) for a university hospital. The system covers the whole process: registering and taking orders, selecting a medical specialty / prosthesis / material / size, uploading 3D models, tracking manufacturing status, and notifications for patients, doctors, and technicians.

## &#x1F3D7;&#xFE0F; Architecture & Tech Stack

&nbsp;&nbsp;&nbsp;The project is split into two independent applications that communicate over a REST API. The **backend** is built with **FastAPI (Python)** and **SQLAlchemy**, exposes the business logic (**JWT** authentication, order/prosthesis/material/notification management), and persists everything in a **MySQL** database, including triggers and stored procedures for automatic price calculation. 3D model storage is optionally handled via **AWS S3**.

&nbsp;&nbsp;&nbsp;The **frontend** is a **React 19 + Vite** SPA, routed with **React Router**, consuming the API via `fetch`/**axios**, with an `AuthContext` that manages the JWT token in `localStorage`. It includes an admin dashboard, a quote/order-creation form, and a notification system.

## &#x1F680; Deployment

&nbsp;&nbsp;&nbsp;The project is deployed on **Railway**, in a single project (`sigpe`) with three services on the same private network:

| Service | Description | Public URL |
|---|---|---|
| **frontend** | React/Vite SPA (`npm run build` + `vite preview`) | [frontend-production-e6c55.up.railway.app](https://frontend-production-e6c55.up.railway.app) |
| **backend** | FastAPI API (`uvicorn`), `rootDirectory=backend` | [backend-production-89b01.up.railway.app](https://backend-production-89b01.up.railway.app) — interactive docs at `/docs` |
| **MySQL-gOF5** | MySQL 9.4 database (official image) | only reachable over Railway's private network |

## &#x1F465; Team Members
- **Agustín Álvarez** — Product Owner / Scrum Manager
- **Mariano Arias Simone** — Scrum Master / Back-End Developer
- **Mateo Sánchez** — Front-End Developer
- **Lucas de la Fuente** — Front-End Developer
- **Jorge Padula** — Back-End Developer

## &#x1F310; Reference Sites
- **[Scrum Guide (official Scrum guide)](https://scrumguides.org/)**
- **[Tecno Lanema](https://www.tecnolanema.pt/)** — Reference for the homepage layout and image usage
- **[RGBESTUDIO](https://rgbestudio.com.ar/)** — Ideas for showcasing services, lab information, and material types with pros and cons
- **[ClickUp](https://clickup.com)** — Idea for how to display medical specialties and the available prints for each one
- **[RAOMED](https://raomed.com.ar/)**

## &#x1F6E0;&#xFE0F; Local Development

&nbsp;&nbsp;&nbsp;To run the project on your machine:

- **[Backend](backend/README.md)**
- **[Frontend](frontend/README.md)**
