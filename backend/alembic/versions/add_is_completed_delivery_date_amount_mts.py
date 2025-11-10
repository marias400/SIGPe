"""add is_completed to orders, rename meeting_date to delivery_date, add amount_mts to materials

Revision ID: add_is_completed_delivery_amount
Revises: add_s3_fields_3d_models
Create Date: 2025-01-28 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_is_completed_delivery_amount'
down_revision: Union[str, None] = 'add_s3_fields_3d_models'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Verificar si las tablas existen antes de modificarlas
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    
    tables = inspector.get_table_names()
    
    # ===== MODIFICACIONES EN TABLA ORDERS =====
    if 'orders' in tables:
        columns = [col['name'] for col in inspector.get_columns('orders')]
        
        # 1. Renombrar meeting_date a delivery_date
        # En MySQL necesitamos especificar el tipo de dato existente
        if 'meeting_date' in columns and 'delivery_date' not in columns:
            op.alter_column('orders', 'meeting_date', 
                          new_column_name='delivery_date',
                          existing_type=sa.DateTime(),
                          existing_nullable=True)
        
        # 2. Agregar columna is_completed (bool, default False)
        if 'is_completed' not in columns:
            op.add_column('orders', sa.Column('is_completed', sa.Boolean(), nullable=False, server_default='0'))
    
    # ===== MODIFICACIONES EN TABLA MATERIALS =====
    if 'materials' in tables:
        columns = [col['name'] for col in inspector.get_columns('materials')]
        
        # 3. Agregar columna amount_mts (float, nullable)
        if 'amount_mts' not in columns:
            op.add_column('materials', sa.Column('amount_mts', sa.Float(), nullable=True))


def downgrade() -> None:
    # Verificar si las tablas existen antes de modificarlas
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    
    tables = inspector.get_table_names()
    
    # ===== REVERTIR MODIFICACIONES EN TABLA MATERIALS =====
    if 'materials' in tables:
        columns = [col['name'] for col in inspector.get_columns('materials')]
        
        # Eliminar columna amount_mts
        if 'amount_mts' in columns:
            op.drop_column('materials', 'amount_mts')
    
    # ===== REVERTIR MODIFICACIONES EN TABLA ORDERS =====
    if 'orders' in tables:
        columns = [col['name'] for col in inspector.get_columns('orders')]
        
        # Eliminar columna is_completed
        if 'is_completed' in columns:
            op.drop_column('orders', 'is_completed')
        
        # Renombrar delivery_date de vuelta a meeting_date
        if 'delivery_date' in columns and 'meeting_date' not in columns:
            op.alter_column('orders', 'delivery_date', 
                          new_column_name='meeting_date',
                          existing_type=sa.DateTime(),
                          existing_nullable=True)

