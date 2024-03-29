"""update role

Revision ID: 56c0398fdac9
Revises: 652714304116
Create Date: 2023-02-23 12:36:24.810744

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56c0398fdac9'
down_revision = '652714304116'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('bam_role_name_key', 'bam_role', type_='unique')
    op.create_unique_constraint(None, 'bam_role', ['value'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'bam_role', type_='unique')
    op.create_unique_constraint('bam_role_name_key', 'bam_role', ['name'])
    # ### end Alembic commands ###
