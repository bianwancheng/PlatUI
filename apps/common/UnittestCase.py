#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/12/6 15:17
# @Author : Wancheng.b
# @File : UnittestCase.py
# @Software: PyCharm
import json
import os
import unittest
from HTMLTestRunner import HTMLTestRunner
from datetime import datetime

from apps.common.BaseOperate import BaseOperate
from apps.common.Common import Utils

projectpath = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))


class UnittestCase(unittest.TestCase):
    driver = None
    path = None

    @classmethod
    def setUpClass(cls):
        cls.driver = Utils().getDriver()

    def test_case(self):
        with open(UnittestCase.path, 'r', encoding='utf8')as f:
            data_list = json.load(f)
        BaseOperate().operate(data_list[:-1], self.driver)

    def main_run(self, path, title):
        report_path = ''
        UnittestCase.path = path
        try:
            suite = unittest.TestSuite()
            suite.addTest(UnittestCase('test_case'))
            title_time = title + str(datetime.utcnow().strftime('%Y%m%d%H%M%S%f')[:-3])
            fp = open(projectpath + '\\templates\\report\\' + title_time + '.html', "wb")
            runner = HTMLTestRunner(stream=fp, title=title_time, description=title, verbosity=2,
                                    save_last_try=True)
            ret = runner.run(suite)
            fp.close()
            report_path = title_time + '.html'
            # BaseOperate().operate(data_list)报异常的时候捕获不到异常不知道为什么暂时用ret.error_count, ret.failure_count作为返回依据
            if ret.error_count == 0 and ret.failure_count == 0:
                return report_path, 'success'
            else:
                return report_path, 'fail'
        except:
            return report_path, 'fail'
        finally:
            self.driver.quit()


if __name__ == '__main__':
    print(projectpath)
    # unittest.main()
    ret = UnittestCase().main_run('D:\pycharmwork\PlatUI\\testCase\中台\就赶紧回家吧昂ok.json', '就赶紧回家吧昂ok.json')
    print(ret)
