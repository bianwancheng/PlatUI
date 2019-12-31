$(function () {
    add_project();
    changgeName();

    // 添加项目
    function add_project() {

        $('#projectSub').click(function () {
            project = $('#project_input').val();
            if (project === '') {
                $(this).removeAttr("data-dismiss", "modal");
                alert('项目名称不能为空');
            } else {
                $.ajax({

                });

                $(this).attr("data-dismiss", "modal");
                $('#project_input').val('');
            }
        });

        $('#projectClo').click(function () {
            $('#project_input').val('');
        })
    }

    // 改变项目名称的显示内容

    function changgeName() {
        var lis = $('#lis').find('li').slice(0, -1);
        lis.each(function () {
            $(this).off('click').on('click', function () {
                $('#dropdown-toggle').find('span').eq(0).text($(this).text());
                $('#dropdown-toggle').find('p').eq(0).text($(this).find('p').eq(0).text());
            })
        })
    }

});
