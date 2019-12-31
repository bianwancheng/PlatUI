$(function () {
    var id = 0;
    tb_departments();
    btn_add();
    add_business();
    deleteSelects($('#add_business'));
    modal_add($('#add_business'));
    save($('#add_business'));
    close($('#add_business'));


    // 列表表格
    function tb_departments() {
        $('#tb_departments').bootstrapTable({
            classes: 'table table-bordered table-hover table-striped',
            url: '/table/lyear_pages_data_table_ajax',
            method: 'post',
            dataType: 'json',        // 因为本示例中是跨域的调用,所以涉及到ajax都采用jsonp,一般就是json
            uniqueId: 'id',             // 每行的唯一标识字段
            toolbar: '#toolbar',       // 工具按钮容器
            clickToSelect: false,     // 是否启用点击选中行
            showColumns: true,         // 是否显示所有的列
            showRefresh: true,         // 是否显示刷新按钮

            //showToggle: true,        // 是否显示详细视图和列表视图的切换按钮(clickToSelect同时设置为true时点击会报错)

            pagination: true,                    // 是否显示分页
            sortOrder: "asc",                    // 排序方式
            queryParams: function (params) {
                var temp = {
                    limit: params.limit,         // 每页数据量
                    offset: params.offset,       // sql语句起始索引
                    page: (params.offset / params.limit) + 1,
                    sort: params.sort,           // 排序的列名
                    sortOrder: 'desc'      // 排序方式'asc' 'desc'
                };
                return temp;
            },                                   // 传递参数
            sidePagination: "server",            // 分页方式：client客户端分页，server服务端分页
            pageNumber: 1,                       // 初始化加载第一页，默认第一页
            pageSize: 10,                        // 每页的记录行数
            pageList: [10],         // 可供选择的每页的行数
            search: true,                      // 是否显示表格搜索，此搜索是客户端搜索

            //showExport: true,        // 是否显示导出按钮, 导出功能需要导出插件支持(tableexport.min.js)
            //exportDataType: "basic", // 导出数据类型, 'basic':当前页, 'all':所有数据, 'selected':选中的数据

            columns: [{
                checkbox: true    // 是否显示复选框
            }, {
                field: 'id',
                title: 'ID',
                sortable: true,    // 是否排序
                onSort: function (name, order) {
                    $('#table').bootstrapTable('refreshOptions', {

                        sortName: name,
                        sortOrder: order
                    });
                }
            }, {
                field: 'business',
                title: '任务名称'
            }, {
                field: 'project',
                title: '所属项目',
            }, {
                field: 'user',
                title: '创建人'
            }, {
                field: 'updatetime',
                title: '创建时间'
            }, {
                field: 'result',
                title: '状态',
                //下面的没起作用
                noeditFormatter: function (value, row, index) {
                    var result;
                    if (value === 'success') {
                        result = {class: "label label-danger"};
                    } else if (value === 'fail') {
                        result = {class: "label label-success"};
                    }

                    return result; // 这里对bootstrap-table-editable.min.js做了一些修改，让其能接收class
                },
                // formatter: function (value, row, index) {
                //     return progress(index);
                // }//格式化进度条

            }, {
                field: 'operate',
                title: '操作',
                formatter: btnGroup,  // 自定义方法
                events: {
                    'click .edit-btn': function (event, value, row, index) {
                        editCase(row);
                    },
                    'click .del-btn': function (event, value, row, index) {
                        delCase(row.id);
                    },
                    'click .run-btn': function (event, value, row, index) {
                        // console.log('index', index);
                        runCase(row, index);
                    },
                    'click .read-btn': function (event, value, row, index) {
                        readReport(row);
                    },
                    'click .copy-btn': function (event, value, row, index) {
                        copyCase(row.id);
                    }
                }
            }],
            /*
            onEditableSave: function (field, row, oldValue, $el) {
                $.ajax({
                    type: "get",
                    url: "http://www.bixiaguangnian.com/index/test/testEditTwo",
                    data: row,
                    dataType: 'jsonp',
                    success: function (data, status) {
                        if (data.code == '200') {
                            // 这里的状态显示有自定义样式区分，做单行的更新
                            $('.example-table').bootstrapTable('updateRow', {index: row.id, row: row});
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function () {
                        alert('修改失败，请稍后再试');
                    }
                });
            }
            */
            onLoadSuccess: function (data) {
                $("[data-toggle='tooltip']").tooltip();
            }
        });

        //给table表格中添加进度条
        // function progress(index) {
        //     //这里还没有实现
        //     var a = 1;
        //     if (a === 1) {
        //         return 'unexecuted'
        //     }
        //     // var red = phaseInfo[index].red;
        //     // var green = phaseInfo[index].green;
        //     // var yellow = phaseInfo[index].yellow;
        //     // var begin = phaseInfo[index].begin;
        //     // var total = red + green + yellow;
        //     // b = (Math.round(begin / total * 10000) / 100.00 + "%");
        //     // r = (Math.round(red / total * 10000) / 100.00 + "%");
        //     // g = (Math.round(green / total * 10000) / 100.00 + "%");
        //     // y = (Math.round(yellow / total * 10000) / 100.00 + "%");
        //     return ["<div class='progress'>"
        //     + '<div class="progress-bar progress-bar-danger" style="width: ' + '10%' + '">'
        //     + '<span class="sr-only">Complete (danger)</span>'
        //     + '</div>'
        //     + '<div class="progress-bar progress-bar-success" style="width: ' + '10%' + '">'
        //     + '<span class="sr-only">Complete (success)</span>'
        //     + '</div>'
        //     + '<div class="progress-bar progress-bar-warning" style="width: ' + '10%' + '">'
        //     + '<span class="sr-only">Complete (warning)</span>'
        //     + '</div>'
        //     + '<div class="progress-bar progress-bar-danger" style="width: ' + '10%' + '">'
        //     + '<span class="sr-only">Complete (danger)</span>'
        //     + '</div>'
        //     + "</div>"];
        // }

        // 操作按钮
        function btnGroup() {
            // data-toggle="tooltip"  影响模态框未解决
            let html =
                '<a href="#" class="btn btn-xs btn-default m-r-5 edit-btn" title="编辑" data-target=".edit_business" data-toggle="modal"><i class="mdi mdi-pencil">编辑</i></a>' +
                '<a href="#" class="btn btn-xs btn-default del-btn" data-toggle="tooltip" title="删除"><i class="mdi mdi-window-close">删除</i></a>' +
                '<a href="#" class="btn btn-xs btn-default copy-btn" title="复制"><i class="mdi mdi-youtube-play">复制</i></a>' +
                '<a href="#" class="btn btn-xs btn-default run-btn" title="运行"><i class="mdi mdi-youtube-play">运行</i></a>' +
                '<a href="#" class="btn btn-xs btn-default read-btn" data-target=".report_business" data-toggle="modal" title="查看"><i class="mdi mdi-read">查看</i></a>'
            return html;
        }

        // 操作方法 - 编辑
        function editCase(row) {
            $('#myLargeModalLabelEdit').text(row.project + '-' + row.business + '业务信息');
            id = 0;
            var edit_data = {'id': row.id, 'business': row.business, 'project': row.project};
            $.ajax({
                type: "post",
                url: "/table/edit",
                data: JSON.stringify(edit_data),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                //超时时间
                timeout: 60000,
                success: function (msg, status) {
                    if (status === 'success') {
                        if (msg['rows'] === 1) {
                            alert('他人编辑中请稍后重试');
                            window.location.reload();
                            // $('.edit_business').css('display', 'none');
                        } else {
                            // 这里的状态显示有自定义样式区分，做单行的更新
                            $('#edit_business').bootstrapTable({
                                columns: [{
                                    checkbox: true,    // 是否显示复选框
                                }, {
                                    field: 'id',
                                    title: '序号',
                                }, {
                                    field: 'business',
                                    title: '业务名称',
                                    editable: {
                                        type: 'text',
                                        title: "业务名称",
                                    }
                                }, {
                                    field: 'url',
                                    title: '登录地址',
                                    editable: {
                                        type: 'text',
                                        title: "登录地址",
                                    }
                                }, {
                                    field: 'operate',
                                    title: '操作方式',
                                    editable: {
                                        type: 'select',
                                        title: '操作方式',
                                        pk: 1,
                                        source: [
                                            {value: 0, text: 'click'},
                                            {value: 1, text: 'send_keys'},
                                            {value: 2, text: 'switch_iframe'},
                                            {value: 3, text: 'switch_default'},
                                            {value: 4, text: 'switch_new_handles'},
                                            {value: 5, text: 'check_text'},
                                            {value: 6, text: 'check_notNone'},
                                        ],
                                    }
                                }, {
                                    field: 'find_type',
                                    title: '获取方式',
                                    editable: {
                                        type: 'select',
                                        title: '获取方式',
                                        pk: 1,
                                        source: [
                                            {value: 0, text: 'xpath'},
                                            {value: 1, text: 'id'}
                                        ],
                                    }
                                }, {
                                    field: 'element',
                                    title: '元素取值',
                                    editable: {
                                        type: 'text',
                                        title: "元素取值",
                                    }
                                }, {
                                    field: 'content',
                                    title: '输入内容',
                                    editable: {
                                        type: 'text',
                                        title: "输入内容",
                                    }

                                }, {
                                    field: 'wait_time',
                                    title: '等待时间',
                                    editable: {
                                        type: 'text',
                                        title: "等待时间",
                                    }

                                }, {
                                    field: 'operate_info',
                                    title: '操作说明',
                                    editable: {
                                        type: 'text',
                                        title: "操作说明",
                                    }

                                }],
                                data: msg['rows']
                            });
                            //编辑框的底部按钮-添加
                            modal_add_edit($('#edit_business'), msg['rows']);
                            // //删除
                            deleteSelects_edit($('#edit_business'));
                            // // 编辑保存
                            save_edit($('#edit_business'), row.id);
                            // //编辑关闭
                            close_edit($('#edit_business'), row.id);

                        }

                    } else {
                        alert(msg.msg);
                    }
                },
                error: function () {
                    alert('编辑失败，请稍后再试');
                }
            });
        }

        // 操作方法 - 删除
        function delCase(id) {
            // 新建一个备份表，删除原有数据，然后再插入到备份表中
            id = {'id': id};
            $.ajax({
                type: "post",
                url: "/table/delete",
                data: JSON.stringify(id),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                //超时时间
                timeout: 60000,
                success: function (msg, status) {
                    alert('删除成功');
                    $('#tb_departments').bootstrapTable('refresh');
                },
                error: function () {
                    alert('删除失败，请稍后再试');
                }
            });
        }

        // 查看报告
        function readReport(row) {
            id = {'id': row['id']};
            $.ajax({
                type: "post",
                url: "/table/reportQuery",
                data: JSON.stringify(id),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                //超时时间
                timeout: 60000,
                success: function (msg, status) {
                    if (msg['report'] === '') {
                        $('#report_body').html('<div class="alert alert-danger" style="text-align: center;" role="alert">该用例还未执行过，请执行再试</div>');
                    } else {
                        console.log('<iframe src="report/\'+msg[\'report\']+\'" width="100%" height="500px" frameborder="0" name="report"> </iframe>')
                        $('#report_body').html('<iframe src="report/' + msg['report'] + '" width="100%" height="500px" frameborder="0" name="report"> </iframe>');
                    }

                },
            });

        }

        // 复制案例
        function copyCase(id) {
            var newid = {'id': id};
            $.ajax({
                type: "post",
                url: "/table/copy",
                data: JSON.stringify(newid),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                //超时时间
                timeout: 60000,
                success: function (msg, status) {
                    // 添加模态框的粘贴
                    $('#model_paste').off('click').on('click', function () {
                        $('#add_business').bootstrapTable('destroy');
                        $('#add_business').bootstrapTable({
                            columns: [{
                                checkbox: true,    // 是否显示复选框
                            }, {
                                field: 'id',
                                title: '序号',
                            }, {
                                field: 'business',
                                title: '业务名称',
                                editable: {
                                    type: 'text',
                                    title: "业务名称",
                                }
                            }, {
                                field: 'url',
                                title: '登录地址',
                                editable: {
                                    type: 'text',
                                    title: "登录地址",
                                }
                            }, {
                                field: 'operate',
                                title: '操作方式',
                                editable: {
                                    type: 'select',
                                    title: '操作方式',
                                    pk: 1,
                                    source: [
                                        {value: 0, text: 'click'},
                                        {value: 1, text: 'send_keys'},
                                        {value: 2, text: 'switch_iframe'},
                                        {value: 3, text: 'switch_default'},
                                        {value: 4, text: 'switch_new_handles'},
                                        {value: 5, text: 'check_text'},
                                        {value: 6, text: 'check_notNone'},
                                    ],
                                }
                            }, {
                                field: 'find_type',
                                title: '获取方式',
                                editable: {
                                    type: 'select',
                                    title: '获取方式',
                                    pk: 1,
                                    source: [
                                        {value: 0, text: 'xpath'},
                                        {value: 1, text: 'id'}
                                    ],
                                }
                            }, {
                                field: 'element',
                                title: '元素取值',
                                editable: {
                                    type: 'text',
                                    title: "元素取值",
                                }
                            }, {
                                field: 'content',
                                title: '输入内容',
                                editable: {
                                    type: 'text',
                                    title: "输入内容",
                                }

                            }, {
                                field: 'wait_time',
                                title: '等待时间',
                                editable: {
                                    type: 'text',
                                    title: "等待时间",
                                }

                            }, {
                                field: 'operate_info',
                                title: '操作说明',
                                editable: {
                                    type: 'text',
                                    title: "操作说明",
                                }

                            }],
                            data: msg['ret']
                        });
                        //复制之后添加的底部按钮-添加
                        modal_add($('#add_business'), msg);
                        // //编辑关闭
                        close($('#add_business'));
                    });

                    // 编辑模态框的粘贴
                    $('#edit_paste').off('click').on('click', function () {
                        // 获取当前table所有的数据
                        var data = $('#edit_business').bootstrapTable('getData', false);
                        //需要先把js对象转换成数组，顺便把id对应起来
                        var arr = [];
                        var maxid = 0;
                        //获取table的id的最大值，append的时候改变id的值
                        for (var n = 0; n < data.length; n++) {
                            if (maxid < data[n]['id']) {
                                maxid = data[n]['id'];
                            }
                        }

                        // 在data基础上粘贴的时候id逐个+1
                        for (var m = 0; m < msg['ret'].length; m++) {
                            console.log(msg['ret'][m]['id']);
                            msg['ret'][m]['id'] = maxid + m + 1;
                            arr.push(msg['ret'][m])
                        }
                        $('#edit_business').bootstrapTable('append', arr);

                    });
                    var new_data = $('#edit_business').bootstrapTable('getData', false);
                    //复制之后添加的底部按钮-添加
                    modal_add_edit($('#edit_business'), new_data);
                    // //编辑关闭
                    close($('#edit_business'));

                }
            });
        }

        // 运行case
        function runCase(row, index) {
            id = {'id': row['id']};
            $.ajax({
                type: "post",
                url: "/table/runCase",
                data: JSON.stringify(id),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                //超时时间
                timeout: 60000,
                success: function (msg, status) {
                    if (msg['result'] === 'loading') {
                        $('#tb_departments').bootstrapTable('updateRow', {
                            index: index,
                            replace: false,
                            row: {
                                result: 'loading',
                            }
                        });
                        alert('该用例正在执行稍后刷新重试');

                        // $('#tb_departments').bootstrapTable('refresh');
                    } else {
                        $('#tb_departments').bootstrapTable('updateRow', {
                            index: index,
                            replace: false,
                            row: {
                                result: msg['result'],
                            }
                        });

                    }

                },
                // error: function () {
                //     alert('运行失败，请稍后再试');
                // }
            });
        }
    }

    // 添加的模态框
    function add_business() {

        //模态框的table配置
        $('#add_business').bootstrapTable({
            classes: 'table table-bordered table-hover table-striped',
            // 怎么显示多个toolbar还是个问题
            // toolbar: "#modal_delete, #modal_insert, #modal_add, #modal_save",
            uniqueId: 'id',             // 每行的唯一标识字段
            clickToSelect: false,     // 是否启用点击选中行
            columns: [{
                checkbox: true,    // 是否显示复选框
            }, {
                field: 'id',
                title: '序号',
            }, {
                field: 'business',
                title: '业务名称',
                editable: {
                    type: 'text',
                    title: "业务名称",
                }
            }, {
                field: 'url',
                title: '登录地址',
                editable: {
                    type: 'text',
                    title: "登录地址",
                }
            }, {
                field: 'operate',
                title: '操作方式',
                editable: {
                    type: 'select',
                    title: '操作方式',
                    pk: 1,
                    source: [
                        {value: 0, text: 'click'},
                        {value: 1, text: 'send_keys'},
                        {value: 2, text: 'switch_iframe'},
                        {value: 3, text: 'switch_default'},
                        {value: 4, text: 'switch_new_handles'},
                        {value: 5, text: 'check_text'},
                        {value: 6, text: 'check_notNone'},
                    ],
                }
            }, {
                field: 'find_type',
                title: '获取方式',
                editable: {
                    type: 'select',
                    title: '获取方式',
                    pk: 1,
                    source: [
                        {value: 0, text: 'xpath'},
                        {value: 1, text: 'id'}
                    ],
                }
            }, {
                field: 'element',
                title: '元素取值',
                editable: {
                    type: 'text',
                    title: "元素取值",
                }
            }, {
                field: 'content',
                title: '输入内容',
                editable: {
                    type: 'text',
                    title: "输入内容",
                }

            }, {
                field: 'wait_time',
                title: '等待时间',
                editable: {
                    type: 'text',
                    title: "等待时间",
                }

            }, {
                field: 'operate_info',
                title: '操作说明',
                editable: {
                    type: 'text',
                    title: "操作说明",
                }

            }],
            /*
            onEditableSave: function (field, row, oldValue, $el) {
                $.ajax({
                    type: "get",
                    url: "http://www.bixiaguangnian.com/index/test/testEditTwo",
                    data: row,
                    dataType: 'jsonp',
                    success: function (data, status) {
                        if (data.code == '200') {
                            // 这里的状态显示有自定义样式区分，做单行的更新
                            $('.example-table').bootstrapTable('updateRow', {index: row.id, row: row});
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function () {
                        alert('修改失败，请稍后再试');
                    }
                });
            }
            */
            onLoadSuccess: function (data) {
                $("[data-toggle='tooltip']").tooltip();
            }
        });

    }

    //点击新增按钮初始化id操作
    function btn_add() {
        $('#btn_add').off('click').on('click', function () {
            id = 0;
        })

    }

    //尾部添加tr和插入tr
    function modal_add(table_obj) {

        $('#modal_add').off('click').on('click', function () {
            // 判断table是否存在内容，存在就给id赋值为最大的id，否则就是0
            var data = table_obj.bootstrapTable('getData', false);
            if (data != null) {
                //获取data[i]['id']最大的id，添加的时候+1
                var max = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['id'] > max) {
                        max = data[i]['id']
                    } else {
                        continue
                    }
                }
                id = max;
            }
            id += 1;
            // var obj = $('#add_business');
            var add_tr = table_obj.find('tr').length;
            table_obj.bootstrapTable('insertRow', {
                index: add_tr,
                row: {
                    id: id,
                    business: '',
                    url: 'url',
                    operate: '0',
                    find_type: '0',
                    element: 'element',
                    content: 'content',
                    wait_time: 'time',
                    operate_info: 'operate_info'
                }
            });
        });

        //选中的tr后面插入新的tr
        $('#modal_insert').off('click').on('click', function () {
            arr = []; // 获取被选中的tr的索引，放在数组里
            var tr = table_obj.find('tbody').find('tr');
            for (var i = 0; i < tr.length; i++) {
                if (tr.eq(i).hasClass('selected')) {
                    arr.push(i);
                }
            }
            for (var j = 0; j < arr.length; j++) {
                id += 1;
                var index = 0;
                if (arr.length === 1) {
                    index = arr[j] + 1;
                } else {
                    index = arr[j] + 1 + j;
                }

                // console.log(index)
                // var obj = $('#add_business');
                table_obj.bootstrapTable('insertRow', {
                    index: index,
                    row: {
                        id: id,
                        business: 'business',
                        url: 'url',
                        find_type: 'find_type',
                        element: 'element',
                        content: 'content',
                        wait_time: 'time',
                        operate_info: 'operate_info'
                    }
                });
            }


        })

    }

    //删除选中tr
    function deleteSelects(table_obj) {
        $('#modal_delete').off('click').on('click', function () {
            // var obj = $('#add_business');
            var ids = $.map(table_obj.bootstrapTable('getSelections'), function (row) {
                return row.id
            });

            table_obj.bootstrapTable('remove', {field: 'id', values: ids});
        })

    }

    // 添加业务-保存
    function save(table_obj) {


        $('#modal_save').off('click').on('click', function () {
            id = 0;
            // var obj = $('#add_business')
            var data = table_obj.bootstrapTable('getData', false);

            // console.log(JSON.stringify(data));
            $.ajax({
                data: JSON.stringify(data),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                type: "post",
                //url不用说了吧，否则不知道向服务器哪个接口发送并请求
                url: '/table/addData',
                async: true,
                //超时时间
                timeout: 60000,
                success: function (msg) {
                    if (msg['bool']) {
                        //定义的函数实现对表格赋值，自定义想传的参数，但别忘了msg，不然搞个屁
                        alert('添加成功');
                        table_obj.bootstrapTable('removeAll');
                        //重新加载数据
                        $('#tb_departments').bootstrapTable('refresh');
                    } else {
                        if (msg['business']) {
                            alert(msg['business'] + '业务已经存在了,请修改业务名重新添加')
                        } else {
                            alert('添加失败');
                        }
                    }
                }
            });

        });
    }

    // 添加业务-关闭按钮
    function close(table_obj) {
        // var obj = $('#add_business')
        $('#modal_close').off('click').on('click', function () {
            table_obj.bootstrapTable('removeAll');

        });
    }


//----------------------编辑框按钮------------------------------------
    //编辑框尾部添加和插入;table对象，之前table的数据对象
    function modal_add_edit(table_obj, obj) {

        $('#edit_add').off('click').on('click', function () {
            //获取msg['rows'][i]['id']最大的id，添加的时候+1
            var max = 0;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i]['id'] > max) {
                    max = obj[i]['id']
                } else {
                    continue
                }
            }
            max += 1;
            // var obj = $('#add_business');
            var add_tr = table_obj.find('tr').length;
            table_obj.bootstrapTable('insertRow', {
                index: add_tr,
                row: {
                    id: max,
                    business: '',
                    url: 'url',
                    find_type: 'find_type',
                    element: 'element',
                    content: 'content',
                    wait_time: 'time',
                    operate_info: 'operate_info'
                }
            });

        });

        //选中的tr后面插入新的tr
        $('#edit_insert').off('click').on('click', function () {
            //获取msg['rows'][i]['id']最大的id，添加的时候+1
            var max = 0;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i]['id'] > max) {
                    max = obj[i]['id']
                } else {
                    continue
                }
            }
            arr = []; // 获取被选中的tr的索引，放在数组里
            var tr = table_obj.find('tbody').find('tr');
            for (var i = 0; i < tr.length; i++) {
                if (tr.eq(i).hasClass('selected')) {
                    arr.push(i);
                }
            }
            for (var j = 0; j < arr.length; j++) {
                max += 1;
                var index = 0;
                if (arr.length === 1) {
                    index = arr[j] + 1;
                } else {
                    index = arr[j] + 1 + j;
                }

                // console.log(index)
                // var obj = $('#add_business');
                table_obj.bootstrapTable('insertRow', {
                    index: index,
                    row: {
                        id: max,
                        business: 'business',
                        url: 'url',
                        find_type: 'find_type',
                        element: 'element',
                        content: 'content',
                        wait_time: 'time',
                        operate_info: 'operate_info'
                    }
                });
            }


        })

    }

    //编辑框删除选中tr
    function deleteSelects_edit(table_obj) {
        $('#edit_delete').off('click').on('click', function () {
            // var obj = $('#add_business');
            var ids = $.map(table_obj.bootstrapTable('getSelections'), function (row) {
                return row.id
            });

            table_obj.bootstrapTable('remove', {field: 'id', values: ids});
        })

    }

    // 编辑框添加业务-保存
    function save_edit(table_obj, id) {
        projectName = $('#myLargeModalLabelEdit').text().split('-')[0];
        $('#edit_save').off('click').on('click', function () {
            var data = table_obj.bootstrapTable('getData', false);
            data.push(id);
            data.push(projectName);

            $.ajax({
                data: JSON.stringify(data),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                type: "post",
                //url不用说了吧，否则不知道向服务器哪个接口发送并请求
                url: '/table/editData',
                async: true,
                //超时时间
                timeout: 60000,
                success: function (msg) {
                    if (msg['result']) {
                        //定义的函数实现对表格赋值，自定义想传的参数，但别忘了msg，不然搞个屁
                        //重新加载数据
                        $('#tb_departments').bootstrapTable('refresh');
                    } else {
                        alert('更新失败');
                    }
                }
            });

        });
    }

    // 编辑业务-关闭按钮
    function close_edit(table_obj, id) {

        // var obj = $('#add_business')
        $('#edit_close').off('click').on('click', function () {
            id = {'id': id};
            $.ajax({
                type: "post",
                url: "/table/deitState",
                data: JSON.stringify(id),
                contentType: 'application/json;charset=UTF-8',//编码格式
                dataType: 'json',
                //超时时间
                timeout: 60000,
                success: function (msg, status) {
                    console.log(msg['state'])
                },
            });
            table_obj.bootstrapTable('destroy');

        });
    }


});
