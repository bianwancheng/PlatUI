#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/12/20 11:23
# @Author : Wancheng.b
# @File : manage.py
# @Software: PyCharm

'''
flask-migrate动态迁移数据库：https://www.jianshu.com/p/e4fc86fa21e8（有一步命令写错了，生成迁移文件是python manage.py db migrate）
flask_migrate相关的命令：
python manage.py db init：初始化一个迁移脚本的环境，只需要执行一次。
python manage.py db migrate：将模型生成迁移文件，只要模型更改了，就需要执行一遍这个命令。
python manage.py db upgrade：将迁移文件真正的映射到数据库中。每次运行了migrate命令后，就记得要运行这个命令。
注意点：需要将你想要映射到数据库中的模型，都要导入到manage.py文件中，如果没有导入进去，就不会映射到数据库中。

生成migrations文件夹
遇到的问题：
1：Target database is not up to date.（时间类型想要换成字符串类型）
在数据库里面打开alembic_version这个表，然后里面填入最新的版本号（versions下面的最新的一个版本）

'''

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from apps.models.models import db
from run import app

manager = Manager(app)
# 1. 要使用flask_migrate，必须绑定app和db
migrate = Migrate(app, db)
# 2. 把MigrateCommand命令添加到manager中
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
