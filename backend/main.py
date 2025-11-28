from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from core.config_loader import settings

# Importar todos los modelos para asegurar que estén registrados en SQLAlchemy
# Esto permite que SQLAlchemy resuelva las relaciones por nombre correctamente
from user.models.user import User
from doctor.models.doctor import Doctor
from order.models.order import Order
from model3d.models.model3d import Model3D
from patient.models.patient import Patient
from notification.models.notification import Notification
from observation.models.observation import Observation
from speciality.models.speciality import Speciality
from prosthesis.models.prosthesis import Prosthesis
from material.models.material import Material
from size.models.size import Size

from auth.routes.auth_router import auth_router
from user.routes.user_router import user_router
from doctor.routes.doctor_router import doctor_router
from order.routes.order_router import order_router
from model3d.routes.model3d_router import model3d_router
from patient.routes.patient_router import patient_router
from notification.routes.notification_router import notification_router
from observation.routes.observation_router import observation_router
from speciality.routes.speciality_router import speciality_router
from prosthesis.routes.prosthesis_router import prosthesis_router
from material.routes.material_router import material_router
from size.routes.size_router import size_router

openapi_tags = [
    {
        "name": "Users",
        "description": "User operations",
    },
    {
        "name": "Doctors",
        "description": "Doctor operations",
    },
    {
        "name": "Orders",
        "description": "Order operations",
    },
    {
        "name": "3D Models",
        "description": "3D Model operations",
    },
    {
        "name": "Patients",
        "description": "Patient operations",
    },
    {
        "name": "Notifications",
        "description": "Notification operations",
    },
    {
        "name": "Observations",
        "description": "Observation operations",
    },
    {
        "name": "Specialities",
        "description": "Speciality operations",
    },
    {
        "name": "Prostheses",
        "description": "Prosthesis operations",
    },
    {
        "name": "Materials",
        "description": "Material operations",
    },
    {
        "name": "Sizes",
        "description": "Size operations",
    },
    {
        "name": "Health Checks",
        "description": "Application health checks",
    },
]

app = FastAPI(openapi_tags=openapi_tags)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api", tags=["Users"])
app.include_router(doctor_router, prefix="/api", tags=["Doctors"])
app.include_router(order_router, prefix="/api", tags=["Orders"])
app.include_router(model3d_router, prefix="/api", tags=["3D Models"])
app.include_router(patient_router, prefix="/api", tags=["Patients"])
app.include_router(notification_router, prefix="/api", tags=["Notifications"])
app.include_router(observation_router, prefix="/api", tags=["Observations"])
app.include_router(speciality_router, prefix="/api", tags=["Specialities"])
app.include_router(prosthesis_router, prefix="/api", tags=["Prostheses"])
app.include_router(material_router, prefix="/api", tags=["Materials"])
app.include_router(size_router, prefix="/api", tags=["Sizes"])


@app.get("/health", tags=["Health Checks"])
def read_root():
    return {"health": "true"}
