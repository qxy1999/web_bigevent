// 注意 每次调用$.get $.post $.ajax的时候 会先调用这个函数ajaxPrefilter
// 在这个函数中可以拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    // 在发起ajax请求前 统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    //统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局挂载complete 回调函数
    options.complete = function(res) {
        // 在complete回调函数中 可以使用res.responseJSON拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清空本地数据
            localStorage.removeItem("token");
            // 2.跳转回登录界面
            location.href = 'login.html'
        }
    }
})