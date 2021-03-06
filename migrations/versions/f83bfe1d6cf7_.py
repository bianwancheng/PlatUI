"""empty message

Revision ID: f83bfe1d6cf7
Revises: 
Create Date: 2019-12-30 18:15:10.300572

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f83bfe1d6cf7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('project',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('projectName', sa.String(length=50), nullable=False),
    sa.Column('updatetime', sa.String(length=50), nullable=True),
    sa.Column('author', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('business',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user', sa.String(length=20), nullable=False),
    sa.Column('updatetime', sa.String(length=50), nullable=True),
    sa.Column('business', sa.String(length=50), nullable=False),
    sa.Column('project', sa.Integer(), nullable=True),
    sa.Column('business_detail', sa.String(length=255), nullable=False),
    sa.Column('code', sa.Integer(), nullable=False),
    sa.Column('result', sa.String(length=20), nullable=True),
    sa.Column('report', sa.String(length=255), nullable=True),
    sa.Column('state', sa.Integer(), nullable=True),
    sa.Column('deleteState', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['project'], ['project.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('business')
    op.drop_table('project')
    # ### end Alembic commands ###
