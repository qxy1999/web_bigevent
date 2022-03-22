$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
            nickname: function(value) {
                if (value.length > 6)
                    return '昵称长度必须在1~6个字符之间！'
            }
        })
        // 封装初始化用户的基本信息函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                // console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    initUserInfo();
    // 重置表单数据
    $('#btnRest').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('上传用户信息失败！')
                }
                layer.msg('修改用户信息成功！');
                // 调用父页面的方法 重新渲染用户信息
                // window.parent.getUserInfo(); //有问题
                window.parent.success();
            }
        })

    })

})