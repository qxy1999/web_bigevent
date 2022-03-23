$(function() {
    window.success = function() {
        getUserInfo();
    };

    window.clicklist = function() {
        $('#art_list').click();
    };
    // 调用getUserInfo
    getUserInfo();
    // 获取用户的基本信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            //headers 就是请求头配置对象
            //已封装到baseAPI中
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败');
                }
                //调用renderAvatar 渲染用户的头像
                renderAvatar(res.data)
            },
            //已封装到baseAPI中
            // complete: function(res) {
            //     不论成功或者失败 都会调用该函数
            //     console.log('执行了complete');
            //     console.log(res);
            //     在complete回调函数中 可以使用res.responseJSON拿到服务器响应的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1.清空本地数据
            //         localStorage.removeItem("token");
            //         // 2.跳转回登录界面
            //         location.href = 'login.html'
            //     }
            // }
        })
    }
    //封装渲染用户头像的函数
    function renderAvatar(user) {
        // 1.获取用户名称
        var name = user.nickname || user.username;
        // console.log(name);
        // 2.设置欢迎的文本
        $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
        // 3.按需渲染用户头像
        if (user.user_pic !== null) {
            $(".layui-nav-img").prop("src", user.user_pic).show();
            $(".text-avater").hide();
        } else {
            $(".layui-nav-img").hide();
            var first = name[0].toUpperCase();
            $(".text-avater").html(first);
        }
    }
    var layer = layui.layer;
    // 绑定退出按钮点击事件
    $("#btnLogout").on("click", function() {
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href = 'login.html';
            //关闭询问框
            layer.close(index);
        });
    })
})