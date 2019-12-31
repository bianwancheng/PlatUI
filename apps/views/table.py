#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/12/20 10:10
# @Author : Wancheng.b
# @File : table.py
# @Software: PyCharm
import json
import os
import time
from flask import Blueprint, render_template, request
from apps.common.UnittestCase import UnittestCase
from apps.models.models import Business, db, Project

projectpath = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

# 蓝图
table_app = Blueprint("table", __name__, url_prefix='/table')


# 加载lyear_pages_data_table.html
@table_app.route('/lyear_pages_data_table')
def lyear_pages_data_table():
    global loginUser
    global project
    loginUser = request.args.get('loginUser')
    project = request.args.get('project')
    return render_template('lyear_pages_data_table.html')


# 分页跳转查询数据
@table_app.route('/lyear_pages_data_table_ajax', methods=['POST', 'GET'])
def lyear_pages_data_table_ajax():
    b = request.get_json()
    # 分页需要offset和limit联合使用
    pageno = ((b['page'] - 1) * b['limit'])
    list_all = Business.query.filter(Business.deleteState == 0).all()
    list = Business.query.filter(Business.deleteState == 0).order_by(-Business.id).offset(pageno).limit(10).all()
    rows = []
    for i in list:
        dict = {}
        dict['id'] = i.id
        dict['user'] = i.user
        dict['updatetime'] = i.updatetime
        dict['business'] = i.business
        dict['project'] = i.project
        dict['business_detail'] = i.business_detail
        dict['code'] = i.code
        dict['result'] = i.result
        dict['report'] = i.report
        rows.append(dict)
    data = {'rows': rows, 'total': len(list_all)}

    return data


# 添加业务
@table_app.route('/addData', methods=['POST'])
def add_data():
    data = request.get_json()

    # 项目分类
    if not os.path.exists(projectpath + '/testCase/' + project):
        os.mkdir(projectpath + '/testCase/' + project)

    path = projectpath + '/testCase/' + project + '/' + data[0]['business'] + '.json'
    # 加一个business去重的限制
    if os.path.exists(path):
        return {'bool': False, 'business': data[0]['business']}
    # 取出最后一条信息的id,可能是none，做下处理

    last_id = Business.query.order_by(-Business.id).first().id

    data.append(int(last_id) + 1)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)
    code = int(time.time())
    try:
        bus = Business(user=loginUser, business=data[0]['business'], project=project,
                       business_detail=path, code=code, report='')
        db.session.add(bus)
        # 所有的数据处理准备好之后，执行commit才会提交到数据库！
        db.session.commit()
    except Exception as e:
        # 加入数据库commit提交失败，必须回滚！！！
        db.session.rollback()
        raise e
    finally:
        new_data = Business.query.filter(Business.code == code).first()
        if new_data is not None:
            return {'bool': True}
        else:
            return {'bool': False}


# 编辑-显示
@table_app.route('/edit', methods=['POST'])
def edit():
    data = request.get_json()
    bus = Business.query.filter(Business.id == data['id']).first()
    state = bus.state
    if state == 0:
        bus.state = 1
        db.session.commit()
    else:
        return {'rows': 1}
    path = projectpath + '/testCase/' + data['project'] + '/' + data['business'] + '.json'
    with open(path, 'r', encoding='utf-8')as f:
        rows = json.load(f)
    data = {'rows': rows[:-1]}
    return data


# 编辑关闭,提交返回可编辑状态，state=0
@table_app.route('/deitState', methods=['POST'])
def deitState():
    data = request.get_json()
    bus = Business.query.filter(Business.id == data['id']).first()
    bus.state = 0
    db.session.commit()
    return {'state': 0}


# 编辑-更新
@table_app.route('/editData', methods=['POST'])
def editData():
    data = request.get_json()
    # 删除旧文件
    old_path = Business.query.filter(Business.id == data[-2]).first().business_detail
    os.remove(old_path)

    new_path = projectpath + '/testCase/' + data[-1] + '/' + data[0]['business'] + '.json'
    bus = Business.query.filter(Business.id == data[-2]).first()
    tester = loginUser
    timearr = time.time()
    time_now = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timearr))
    # 创建人以后会页面获取
    bus.user = tester
    bus.updatetime = time_now
    bus.business = data[0]['business']
    bus.project = data[-1]
    bus.business_detail = new_path
    # 可编辑状态
    bus.state = 0
    db.session.commit()

    with open(new_path, 'w', encoding='utf-8')as f:
        json.dump(data[:-1], f, ensure_ascii=False)
    # 最后对比下是不是前后一致。一致则修改失败
    with open(new_path, 'r', encoding='utf-8')as f:
        rows = json.load(f)
    if data[:-1] == rows:
        return {'result': True}
    else:
        return {'result': False}


# 删除业务
@table_app.route('/delete', methods=['POST'])
def delete():
    try:
        id = request.get_json()['id']
        bus = Business.query.filter(Business.id == id).first()
        bus.deleteState = 1
        db.session.commit()
        new_state = Business.query.filter(Business.id == id).first().deleteState
        if new_state == 1:
            return {'ret': True}
        else:
            return {'ret': False}
    except:
        return {'ret': False}


# 运行案例
@table_app.route('/runCase', methods=['POST'])
def runCase():
    id = request.get_json()['id']
    bus = Business.query.filter(Business.id == id).first()
    business_detail = bus.business_detail
    bussiness = bus.business
    result = bus.result
    # 点击运行之后，查询状态是否为loading，不是则改变为loading
    if result != 'loading':
        bus.result = 'loading'
        db.session.commit()
    else:
        # 数据库状态为loading，返回前台loading然后提示用例已经在运行中了
        return {'result': 'loading'}
    result = UnittestCase().main_run(business_detail, bussiness)  # 返回report地址和bool
    bus.report = result[0]
    bus.result = result[1]
    db.session.commit()
    return {'result': result[1]}


# 复制案例
@table_app.route('/copy', methods=['POST'])
def copy():
    id = request.get_json()['id']
    bus = Business.query.filter(Business.id == id).first()
    business_detail = bus.business_detail
    with open(business_detail, 'r', encoding='utf-8')as f:
        business = json.load(f)
    return {'ret': business[:-1]}


# 查看报告
@table_app.route('/reportQuery', methods=['POST'])
def reportQuery():
    id = request.get_json()['id']
    bus_report = Business.query.filter(Business.id == id).first().report
    return {'report': bus_report}


# 查看报告
@table_app.route('/report/<url>')
def report(url):
    return render_template('/report/' + url)
