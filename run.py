#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author : Wancheng.b
# @File : run.py
# @Software: PyCharm


from apps.models.models import app
from apps.views.index import index_app
from apps.views.table import table_app


app.register_blueprint(index_app)
app.register_blueprint(table_app)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
