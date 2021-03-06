"""empty message

Revision ID: c154d072d54b
Revises: a239bcc59df4
Create Date: 2019-12-31 10:20:24.789879

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c154d072d54b'
down_revision = 'a239bcc59df4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('business', sa.Column('project', sa.String(length=50), nullable=False))
    op.drop_constraint('business_ibfk_1', 'business', type_='foreignkey')
    op.drop_column('business', 'project_code')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('business', sa.Column('project_code', mysql.INTEGER(display_width=11), autoincrement=False, nullable=True))
    op.create_foreign_key('business_ibfk_1', 'business', 'project', ['project_code'], ['id'])
    op.drop_column('business', 'project')
    # ### end Alembic commands ###
