#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/12/20 11:22
# @Author : Wancheng.b
# @File : config.py
# @Software: PyCharm
from sqlalchemy import create_engine

DEBUG = True

DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'root'
PASSWORD = 'root'
HOST = '127.0.0.1'
PORT = '3306'
DATABASE = 'platform_db'


SQLALCHEMY_DATABASE_URI = "{}+{}://{}:{}@{}:{}/{}?charset=utf8mb4".format(DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT,
                                                                   DATABASE)
# 配置,数据库内容在更新时自动提交
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_ECHO = True


# Chrome驱动和driver路径
chromepath = 'D:\environment\python\chromedriver.exe'
chrome_exe = r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
wait_time = 1

