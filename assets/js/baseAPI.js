// 注意 每次调用$.get $.post $.ajax的时候 会先调用这个函数ajaxPrefilter
// 在这个函数中可以拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    // 在发起ajax请求前 统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
})