"""add content

Revision ID: 92d0481d90e3
Revises: 56c0398fdac9
Create Date: 2023-02-24 16:36:54.591071

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '92d0481d90e3'
down_revision = '56c0398fdac9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('content_portal',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True, comment='创建者'),
    sa.Column('updated_by', sa.Integer(), nullable=True, comment='更新者'),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment='创建日期'),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment='更新日期'),
    sa.Column('title', sa.String(length=20), nullable=False, comment='主标题'),
    sa.Column('sub_title', sa.String(length=80), nullable=False, comment='副标题'),
    sa.Column('img', sa.String(length=200), nullable=False, comment='图片链接/地址'),
    sa.Column('video', sa.String(length=200), nullable=False, comment='视频链接/地址'),
    sa.Column('bg_color', sa.String(length=30), nullable=False, comment='背景颜色'),
    sa.Column('category', sa.Integer(), nullable=False, comment='banner/平台特点/亮点说明'),
    sa.Column('state', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('content_model',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True, comment='创建者'),
    sa.Column('updated_by', sa.Integer(), nullable=True, comment='更新者'),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment='创建日期'),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment='更新日期'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('content_tag',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True, comment='创建者'),
    sa.Column('updated_by', sa.Integer(), nullable=True, comment='更新者'),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment='创建日期'),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True, comment='更新日期'),
    sa.Column('tag', sa.String(length=100), nullable=False, comment='标签'),
    sa.Column('color', sa.String(length=100), nullable=False, comment='颜色'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('models_tagmanagers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('tagmanager', sa.Integer(), nullable=True),
    sa.Column('model', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['model'], ['content_model.id'], name='fk_models_tagmanagers_content_model_model_id', onupdate='CASCADE', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['tagmanager'], ['content_tag.id'], name='fk_models_tagmanagers_content_tag_tagmanager_id', onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('models_tagmanagers')
    op.drop_table('content_tag')
    op.drop_table('content_model')
    op.drop_table('content_portal')
    # ### end Alembic commands ###
