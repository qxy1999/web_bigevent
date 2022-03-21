$(function() {
    // 点击去注册的链接
    $("#link_reg").on("click", function() {
            $(".login-box").hide();
            $(".reg-box").show();
        })
        // 点击去登录的链接
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // 从layui中获取form对象
    var form = layui.form
        // 通过form.verify() 函数自定义校验规则
    form.verify({
            //自定义了叫pass校验规则
            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repwd: function(value) {
                //校验两次密码是否一致的规则
                var pwd = $(".reg-box [name=password]").val();
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        // 从layui中获取弹出框对象layer
    var layer = layui.layer;
    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
            // 阻止表单提交的默认行为
            e.preventDefault();
            // 发起ajax的POST请求
            var data = { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() };
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $("#link_login").click();
            })
        })
        // 监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 将登录成功后得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token);
                // console.log(res.token);
                location.href = 'index.html';
            }
        })
    })
})