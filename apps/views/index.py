#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/12/20 13:59
# @Author : Wancheng.b
# @File : index.py
# @Software: PyCharm

from flask import Blueprint, redirect, render_template
from apps.models.models import Business, db

index_app = Blueprint("index", __name__)  # 首页


@index_app.route('/')
def index():
    return render_template('index.html')


# 加载lyear_pages_data_table.html
@index_app.route('/lyear_main')
def lyear_main():
    return render_template('lyear_main.html')


@index_app.route('/jsData')
def jsData():
    return {'data': 1}

# id`, `user`, `updatetime`, `business`, `project`, `business_detail`, `code`, `result`, `report`, `state`, `deleteState`
