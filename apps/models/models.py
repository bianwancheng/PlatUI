#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/12/20 10:09
# @Author : Wancheng.b
# @File : models.py
# @Software: PyCharm
import time
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import config

# 定义app对象,配置模板和静态文件的加载路径（在蓝图里面配置不起作用）
app = Flask(__name__, template_folder='../../templates', static_folder='../../static')
# 加载app的配置
app.config.from_object(config)
# 定义db并初始化（这里注意顺讯先加载app再初始化db）
db = SQLAlchemy(app)
db.init_app(app)



class Business(db.Model):
    timearr = time.time()
    time_now = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timearr))
    # 定义表名
    __tablename__ = 'business'

    # 定义列对象

    # 主键id
    id = db.Column(db.Integer, primary_key=True)
    # 创建人
    user = db.Column(db.String(20), nullable=False)
    # 创建时间
    updatetime = db.Column(db.String(50), default=time_now)
    # 业务名称
    business = db.Column(db.String(50), nullable=False)
    # 项目
    project = db.Column(db.String(50), nullable=False)
    # 业务步骤详情文件地址
    business_detail = db.Column(db.String(255), nullable=False)
    # 标识码
    code = db.Column(db.Integer, nullable=False)
    # 结果
    result = db.Column(db.String(20), default='unexecuted')
    # 报告地址
    report = db.Column(db.String(255))
    # 编辑状态的标志
    state = db.Column(db.Integer, default=0)
    # 删除状态的标志，并不是真的删除而是不显示，0显示；1不显示
    deleteState = db.Column(db.Integer, default=0)



    # repr()方法显示一个可读字符串
    def __repr__(self):
        return 'business:%s,' % self.business


class Project(db.Model):
    timearr = time.time()
    time_now = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timearr))

    __tablename__ = 'project'
    # id
    id = db.Column(db.Integer, primary_key=True)
    # 项目名称
    projectName = db.Column(db.String(50), nullable=False)
    # 创建时间
    updatetime = db.Column(db.String(50), default=time_now)
    # 创建人
    author = db.Column(db.String(50), nullable=False)



if __name__ == '__main__':
    timearr = time.time()
    time_now = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timearr))
    print(time_now)
