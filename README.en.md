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

### How each service is set up

- **backend**: built with Railpack (auto-detects Python/`requirements.txt`), `rootDirectory: backend`, `startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT`, and a `preDeployCommand: python scripts/load_schema.py` that loads the schema (`database/db_schema.sql`) into Railway's MySQL **idempotently** — if the database already has data, it skips re-running the dump. `MYSQL_SERVER`, `MYSQL_PORT`, `MYSQL_USERNAME`, and `MYSQL_PASSWORD` are wired by reference to the `MySQL-gOF5` service (`${{MySQL-gOF5.MYSQLHOST}}`, etc.), and `MYSQL_DATABASE=sigpe_test`.
- **frontend**: `rootDirectory: frontend`, `buildCommand: npm run build`, `startCommand: npm run preview -- --host 0.0.0.0 --port $PORT`. The backend URL is injected at build time via `VITE_API_URL`.
- **MySQL-gOF5**: `mysql:9.4` image with a persistent volume mounted at `/var/lib/mysql`.

### Relevant environment variables

**backend:** `DOMAIN`, `ENVIRONMENT`, `JWT_SECRET_KEY`, `BACKEND_CORS_ORIGINS`, `MYSQL_USERNAME`, `MYSQL_PASSWORD`, `MYSQL_SERVER`, `MYSQL_PORT`, `MYSQL_DATABASE` (+ optionally `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME` for uploading 3D models to S3).

**frontend:** `VITE_API_URL` (the backend's public URL + `/api`).

### Issues found and fixed during deployment

While finishing the deployment, we found and fixed the following:

1. **Backend/DB weren't connecting**: the backend's `MYSQL_*` variables weren't wired to the project's actual MySQL service (different names than the ones the plugin exposes). Fixed by pointing them by reference at the `MySQL-gOF5` service.
2. **Broken `preDeployCommand`**: the backend had `python scripts/load_schema.py` configured, but that file didn't exist in the repo. We wrote the script (parses the MySQL dump respecting the `DELIMITER` changes used by triggers/procedures, and is idempotent).
3. **The schema never reached the container**: with `rootDirectory: backend`, Railway only packages that folder — `database/db_schema.sql` (at the repo root) was outside the build context. Added a copy at `backend/database/db_schema.sql`.
4. **Frontend was never deployed**: no service existed for it on Railway. Created one pointing at the same repo with `rootDirectory: frontend`.
5. **Hardcoded backend URL**: the frontend had `http://localhost:8000/api` hardcoded in 12 files. Replaced with `import.meta.env.VITE_API_URL`, configurable per environment.
6. **Vite blocked Railway's domain**: Vite 5+ rejects any unrecognized `Host` header by default (`Blocked request. This host is not allowed`), which breaks `vite preview` behind Railway's proxy. Enabled `preview.allowedHosts: true` in `vite.config.js`.

## &#x1F465; Team Members
- **Agustín Álvarez** — Product Owner / Scrum Manager
- **Mariano Arias Simone** — Scrum Master / Back-End Developer
- **Mateo Sánchez** — Front-End Developer
- **Lucas de la Fuente** — Front-End Developer
- **Jorge Padula** — Back-End Developer
- **Jeremías Álvarez** — QA/Testing
- **Nahuel Peralta** — UX/UI

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
