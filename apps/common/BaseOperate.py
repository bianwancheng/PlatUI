#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/11/19 11:36
# @Author : Wancheng.b
# @File : BaseOperate.py
# @Software: PyCharm

'''
读取excel文件内容，执行操作

'''
import time

from apps.common.Common import LoggingUtils, Utils
from apps.common.FileOperate import FileOperate


class BaseOperate:

    '''
    根据excel进行点击，填值等操作
    excel_list:[{'a': 'asd'}, {'s': 1}]
    '''

    def operate(self, excel_list, driver):
        # global driver
        # try:

        # 开启日志
        LoggingUtils.debug(excel_list)
        # driver = Utils().getDriver()
        LoggingUtils.info('执行' + excel_list[0]['business'])
        # driver.get(excel_list[0]['url'])

        for dict in excel_list:

            url = dict['url']
            operate = dict['operate']
            find_type = dict['find_type']
            element = dict['element']
            content = dict['content']
            wait_time = dict['wait_time']
            operate_info = dict['operate_info']
            if url is not '' and url is not None:
                driver.get(url)

            if operate == 'click':
                LoggingUtils.info(operate_info)
                Utils().element_click(driver, (find_type, element))

            elif operate == 'send_keys':
                LoggingUtils.info(operate_info)
                Utils().element_send_keys(driver, (find_type, element), content)

            elif operate == 'switch_iframe':
                LoggingUtils.info(operate_info)
                Utils().switch_iframe(driver, (find_type, element))

            elif operate == 'switch_default':
                LoggingUtils.info(operate_info)
                Utils().switch_to_default_iframe(driver)

            elif operate == 'switch_new_handles':
                LoggingUtils.info(operate_info)
                Utils().switch_new_handles(driver)

            elif operate == 'check_text':
                LoggingUtils.info(operate_info)
                actual_ret = Utils().element_get_text(driver, (find_type, element))
                if actual_ret == content:
                    LoggingUtils.debug(operate_info + 'success')
                else:
                    LoggingUtils.debug(operate_info + 'fail')
                    # break

            elif operate == 'check_element_notNone':
                # 用于检查是否进入某个页面
                LoggingUtils.info(operate_info)
                actual_ret = Utils().find_element_byloc(driver, (find_type, element))
                if actual_ret != content:
                    LoggingUtils.debug(operate_info + 'success')
                else:
                    LoggingUtils.debug(operate_info + 'fail')
                    # break

            elif operate == None or operate == '':
                LoggingUtils.warn('此行operate为空流程结束')
                # 页面填表单会传入None
                # break
            else:
                LoggingUtils.warn('没有此操作请添加，或检查excel的"operate"值是否书写错误')

            if wait_time is not '' and wait_time is not None:
                LoggingUtils.info('等待' + str(wait_time) + 's')
                driver.implicitly_wait(30)
                time.sleep(int(wait_time))
        # driver.quit()
        LoggingUtils.info('流程结束，success')
        # finally:
        #     driver.quit()
        #     return True
        # except Exception as e:
        #     print(repr(e))
        #     driver.quit()
        #     # raise e
        #     return False


if __name__ == '__main__':
    BaseOperate().operate(FileOperate().read_excel(), Utils().getDriver())
