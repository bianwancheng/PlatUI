// Build the chart
$(function () {
    // 饼图
    Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '案例执行情况汇总'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Chrome',
                y: 61.41,
                sliced: true,
                selected: true
            }, {
                name: 'Internet Explorer',
                y: 11.9
            }, {
                name: 'Firefox',
                y: 11.00
            }, {
                name: 'Edge',
                y: 4.67
            }, {
                name: 'Safari',
                y: 4.18
            }, {
                name: 'Other',
                y: 7.05
            }]
        }]
    });

// 面积图
    var chart = Highcharts.chart('container_area', {
        chart: {
            type: 'area',
            inverted: true // x y轴对调
        },
        title: {
            text: '每周执行用例汇总'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: [
                '周一', '周二', '周三', '周四', '周五', '周六', '周日'
            ]
        },
        yAxis: {
            title: {
                text: '单位数量'
            },
            min: 0
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: 'success',
            data: [33, 4, 35, 5, 46, 10, 12]
        }, {
            name: 'fail',
            data: [1, 30, 42, 3, 33, 53, 46]
        }, {
            name: '待执行',
            data: [5, 35, 45, 36, 33, 57, 36]
        }]
    });

//折线图
    zhxiantu();

    function zhxiantu() {
        var chart = null;
        // 获取 CSV 数据并初始化图表
        $.getJSON('/get', function (csv) {
            var Success_sum = 0;
            var Fail_sum = 0;
            var Pending_sum = 0;
            for (var j = 0; j < csv.length; j++) {
                Success_sum = Success_sum + csv[j]['Success'];
                Fail_sum = Fail_sum + csv[j]['Fail'];
                Pending_sum = Pending_sum + csv[j]['Pending'];
            }
            total_sum = Success_sum + Fail_sum + Pending_sum;
            Success_percent = Math.round(Success_sum / total_sum * 10000) / 100.00 + "%";
            Fail_percent = Math.round(Fail_sum / total_sum * 10000) / 100.00 + "%";
            $('.widget-detail-1 h2').text(total_sum);
            $('#widget-detail-2').find('span').text(Success_percent);
            $('#widget-detail-2').find('h2').text(Success_sum);
            $('#widget-box-2 .am-progress-bar').css('width', Success_percent);
            $('#widget-box-3 span').text(Math.round(Fail_sum / total_sum * 10000) / 100.00 + "%");
            $('#widget-box-3 h2').text(Fail_sum);
            $('#widget-box-3 .am-progress-bar').css('width', Fail_percent);
            $('.widget-detail-4 h2').text(Pending_sum);

            // csv格式：Day,Success（个）,Fail（个）,Loading(个)
            console.log(csv);
            var data = 'Day,' + 'Fail,' + 'Success,' + 'Pending(未执行)' + '\n';
            for (var i = 0; i < csv.length; i++) {
                // updatetime = csv[i]['updatetime'].split('-');
                // console.log(updatetime)
                // newdate = updatetime[2]+'/'+updatetime[1]+'/'+updatetime[0].substr(2, 3);

                // console.log(csv[i]['updatetime']);
                data += csv[i]['updatetime'] + ',' + csv[i]['Fail'] + ',' + csv[i]['Success'] + ',' + csv[i]['Pending'] + '\n'
            }
            console.log(data);
            chart = Highcharts.chart('container', {
                // '3/9/13,5691,4346\n3/10/13,5403,4112\n3/11/13,15574,11356\n3/12/13,16211,11876'
                data: {
                    csv: data
                },
                title: {
                    text: '执行情况'
                },
                subtitle: {
                    text: 'UI自动化测试平台'
                },
                xAxis: {
                    tickInterval: 7 * 24 * 3600 * 1000, // 坐标轴刻度间隔为一星期
                    tickWidth: 0,
                    gridLineWidth: 1,
                    labels: {
                        align: 'left',
                        x: 3,
                        y: -3
                    },
                    // 时间格式化字符
                    // 默认会根据当前的刻度间隔取对应的值，即当刻度间隔为一周时，取 week 值
                    dateTimeLabelFormats: {
                        week: '%Y-%m-%d'
                    }
                },
                yAxis: [{ // 第一个 Y 轴，放置在左边（默认在坐标）
                    title: {
                        text: null
                    },
                    labels: {
                        align: 'left',
                        x: 3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }, {    // 第二个坐标轴，放置在右边
                    linkedTo: 0,
                    gridLineWidth: 0,
                    opposite: true,  // 通过此参数设置坐标轴显示在对立面
                    title: {
                        text: null
                    },
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }],
                legend: {
                    align: 'left',
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    borderWidth: 0
                },
                tooltip: {
                    shared: true,
                    crosshairs: true,
                    // 时间格式化字符
                    // 默认会根据当前的数据点间隔取对应的值
                    // 当前图表中数据点间隔为 1天，所以配置 day 值即可
                    dateTimeLabelFormats: {
                        day: '%Y-%m-%d'
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                // 数据点点击事件
                                // 其中 e 变量为事件对象，this 为当前数据点对象
                                click: function (e) {
                                    $('.message').html(Highcharts.dateFormat('%Y-%m-%d', this.x) + ':<br/>  访问量：' + this.y);
                                }
                            }
                        },
                        marker: {
                            lineWidth: 1
                        }
                    }
                }
            });
        });
    }
})


