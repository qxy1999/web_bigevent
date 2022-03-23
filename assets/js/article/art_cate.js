$(function() {
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;
    // 为添加类别按钮绑定事件
    var index = null;
    $('#btnAdd').on('click', function() {
            index = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog_add').html()
            })
        })
        // 通过代理的形式 为form_add表单绑定submit事件
    $('body').on('submit', '#form_add', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $('#form_add').serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败')
                    }
                    initArtCateList();
                    layer.msg('新增分类成功');
                    // 根据索引关闭对应弹出层
                    layer.close(index);
                }

            })

        })
        // 通过代理的形式为btn_edit添加绑定事件
    var indexEdit = null;
    $('tbody').on('click', '.btn_edit', function() {
            // console.log('ok');
            // 弹出一个修改文章分类信息的层
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog_edit').html()
            })
            var id = $(this).attr('data-id');
            // console.log(id);
            // 发起请求获取对应数据
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    // console.log(res);
                    form.val('form_edit', res.data)
                }
            })

        })
        // 通过代理的形式为修改文章分类表单提交绑定事件
    $('body').on('submit', '#form_edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('修改失败！')
                    }
                    layer.msg('修改成功！');
                    layer.close(indexEdit);
                    initArtCateList();
                }
            })

        })
        // 通过代理的形式为删除按钮绑定点击事件
    $('body').on('click', '.btn_delete', function() {
        var id = $(this).attr('data-id');
        // console.log(id);
        // 询问是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })

        });


    })


})