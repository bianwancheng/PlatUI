#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2019/11/19 11:38
# @Author : Wancheng.b
# @File : Common.py
# @Software: PyCharm

'''
公共方法类，包括不限于获取driver和点击等

'''
import time

from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait

import config


def get_now_time():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))

class Utils:

    '''获取driver并最大化'''

    def getDriver(self):
        chromepath = config.chromepath
        options = webdriver.ChromeOptions()
        options.binary_location = config.chrome_exe
        driver = webdriver.Chrome(executable_path=chromepath, options=options)
        driver.maximize_window()
        driver.implicitly_wait(60)
        return driver

    '''
    显示等待（加载到dom树）
    locator参数是定位方式，如("id", "kw"),传入元组但是*号是把两个参数分开传值
    find_element() 里面的参数是分开传值  find_element(by=By.ID, value=None):
    lambda x: 表达式
    '''

    def find_element_byloc(self, driver, locator):
        element = WebDriverWait(driver, 10, 0.5).until(lambda x: x.find_element(*locator))
        time.sleep(config.wait_time)
        LoggingUtils.debug(locator)
        return element

    def element_click(self, driver, locator):
        self.find_element_byloc(driver, locator).click()

    def element_send_keys(self, driver, locator, content):
        # 清空
        self.find_element_byloc(driver, locator).clear()
        self.find_element_byloc(driver, locator).send_keys(content)

    def element_get_text(self, driver, locator):
        return self.find_element_byloc(driver, locator).text

    def switch_new_handles(self, driver):
        # 获取所有的窗口，句柄
        all_handles = driver.window_handles
        # 切换到新打开的窗口
        driver.switch_to.window(all_handles[-1])

    '''
    切换iframe
    '''
    def switch_iframe(self, driver, locator):
        driver.switch_to_frame(self.find_element_byloc(driver, locator))

    '''
    跳出所有iframe,返回主界面
    '''
    def switch_to_default_iframe(self, driver):
        driver.switch_to_default_content()

class Colour:
    @staticmethod
    def c(msg, Colour):
        try:
            from termcolor import colored, cprint
            p = lambda x: cprint(x, '%s' % Colour)
            return p(msg)
        except:
            print(msg)

    @staticmethod
    def show_verbose(msg):
        Colour.c(msg, 'white')

    @staticmethod
    def show_debug(msg):
        Colour.c(msg, 'blue')

    @staticmethod
    def show_info(msg):
        Colour.c(msg, 'green')

    @staticmethod
    def show_warn(msg):
        Colour.c(msg, 'yellow')

    @staticmethod
    def show_error(msg):
        Colour.c(msg, 'red')

    @staticmethod
    def show_success(msg):
        Colour.c(msg, 'green')



class LoggingUtils:
    def get_now_time(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))

    flag = True

    @staticmethod
    def error(msg):
        if LoggingUtils.flag:
            Colour.show_error(get_now_time() + " [Error]:" + "".join(str(msg)))

    @staticmethod
    def warn(msg):
        if LoggingUtils.flag:
            Colour.show_warn(get_now_time() + " [Warn]:" + "".join(str(msg)))

    @staticmethod
    def info(msg):
        if LoggingUtils.flag:
            Colour.show_info(get_now_time() + " [Info]:" + "".join(str(msg)))

    @staticmethod
    def debug(msg):
        if LoggingUtils.flag:
            Colour.show_debug(get_now_time() + " [Debug]:" + "".join(str(msg)))

    @staticmethod
    def success(msg):
        if LoggingUtils.flag:
            Colour.show_verbose(get_now_time() + " [Success]:" + "".join(str(msg)))
