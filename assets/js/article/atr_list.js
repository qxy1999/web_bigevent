$(function() {
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义补零函数
    function padZero(n) {
        if (n < 10) {
            return '0' + n;
        } else {
            return n;
        }
    }
    // 定义格式化时间的过滤器
    template.defaults.imports.dateFormat = function(data) {
            var dt = new Date(data);
            var y = dt.getFullYear();
            var m = dt.getMonth() + 1;
            var d = dt.getDate();
            var h = padZero(dt.getHours())
            var min = padZero(dt.getMinutes());
            var sec = padZero(dt.getSeconds());
            return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + sec;
        }
        // 定义一个查询的参数对象 将来请求数据的时候
        // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //默认请求第一页数据
        pagesize: 2, //默认每页两条数据
        cate_id: '', //文章分类的id
        state: '' //发布的状态
    }
    initTable();
    var layer = layui.layer;
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用渲染文章分页的方法
                renderPage(res.total);
            }
        })
    }
    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                // console.log(res);
                // console.log(1);
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 使用layui自带的重新渲染函数 渲染ui结构
                form.render();
            }
        })
    }
    //为筛选表单绑定提交事件
    $('.btn_search').on('click', function(e) {
            e.preventDefault();
            // console.log(1);
            // 获取表单选中项的值
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            // 为查询参数对象q中的对应属性赋值
            q.cate_id = cate_id;
            q.state = state;
            //      根据筛选条件 渲染表格数据
            initTable();
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render()渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 容器的id 注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            // 触发jump的方式有两种 
            //1.点击页码 
            //2.调用laypage.render() 这里导致了函数死循环
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值赋值到q的查询参数对象中
                q.pagenum = obj.curr;
                console.log(obj.limit); //得到每页显示的条数
                // 把最新的条目数给q的查询参数对象中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表 并渲染表格
                console.log(first); // 第一次由laypage.render()触发 返回值true
                // 点击页面触发 first则返回undefined
                if (!first) {
                    initTable();
                }
            }
        });
    }
    // 通过代理的形式为删除按钮绑定事件点击处理事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取文章的id
        var id = $(this).attr('data-id');
        // 获取当前页面删除按钮的数量
        var len = $('.btn-delete').length;
        //询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！');
                    //当数据删除完成 需要判断当前页是否还有剩余数据 如果没有剩余数据则让页码值-1
                    if (len === 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                    layer.close(index);
                }
            })


        });
    })
})