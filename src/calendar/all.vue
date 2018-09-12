<template>
    <div class="main-body-center module-wrapper">
        <Add v-show="isShow" :json="this.type" :name="$route.name" @myEvent="getChildData"></Add>
        <div class="module-header--flex-row module-header">
            <div class="title">
                <a href="javascript:;">
                    <i class="iconfont icon-rili"></i>
                    <span>{{$route.name}}</span>
                </a>
            </div>
            <div class="secondary-text">
                <div>
                    <a href="javascript:;" class="btn btn-link" @click="dec()">
                        <i class="glyphicon-chevron-left"></i>
                    </a>
                    <span class="calendar-today-text">{{year}}年{{mo}}月</span>
                    <a href="javascript:;" class="btn btn-link" @click="add()">
                        <i class="glyphicon-chevron-right"></i>
                    </a>
                </div>
            </div>
            <div class="flex-pane">
                <button class="btn btn-primary m-r-10 calendar-add" @click="show()">+&nbsp;&nbsp;新建日期</button>
                <div class="btn-group">
                    <button v-for="(v,i) in btnlist" class="btn" :class="{active: num == i}" @click="tab(i)">{{v}}</button>
                </div>
            </div>
        </div>
        <div class="module-body module-body--calendar-detail">
            <div class="module-body-content">
                <div class="fc-unthemed">
                    <table>
                        <thead>
                        <tr>
                            <th v-for="v in list" class="fc-day-header"><span>{{v}}</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(v,i) in calendar.length / 7">
                            <td v-for="n of 7">{{f(calendar[i*7+(n-1)].day.toString())}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="schedule">
                        <div class="box" v-for="v in schedule">
                            <table>
                                <tr v-for="c in v">
                                    <td v-for="i in c" :style="{width: 1000/7*i.colspan+'px',background: i.cur,opacity:i.op}" :colspan="i.colspan" :class="{add:i.title}">{{i.title}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Add from './add.vue';
    export default {
        props:['item','type'],
        data() {
            return {
                list: ['周日','周一','周二','周三','周四','周五','周六'],
                year: new Date().getFullYear(),
                month: new Date().getMonth()+1,
                btnlist: ['月','周','日'],
                num: 0,
                isShow: false,
            }
        },
        components: {
            Add
        },
        methods: {
            getChildData(data) {
                this.isShow = data;
            },
            show() {
                this.isShow = true;
            },
            tab(i) {
                this.num = i
            },
            add() {
                this.month++;
                console.log(this.month)
                if (this.month == 13) {
                    this.month = 1;
                    this.year++
                }
                else {
                    this.month;
                    this.year;
                }
            },
            dec() {
                this.month--;
                if (this.month == 0) {
                    this.month = 12;
                    this.year--
                }
                else {
                    this.month;
                    this.year;
                }
            },
            f(str){
                if (str.length>7){
                    return str.substr(6,2);
                }
                else {
                    return str.substr(str.length-1,str.length)
                }
            },
        },
        computed: {
            mo() {
                return this.month.toString().length > 1 ? this.month.toString() : '0' + this.month.toString()
            },
            calendar() {
                var list = [];
                var nowMonthLength = new Date(this.year,this.month,0).getDate();
                var nowMonthFirstWeek = new Date(this.year,this.month-1).getDay();
                var lastMonthLength = new Date(this.year,this.month-1,0).getDate();
                var pmonth = this.month == 1 ? 12 : this.month - 1;
                var pyear = this.month == 1 ? this.year - 1 : this.year;
                var nmonth = this.month == 12 ? 1 : this.month + 1;
                var nyear = this.month == 12 ? this.year + 1: this.year;
                function f(n) {
                    return n.toString().length > 1 ? n.toString() : '0' + n.toString()
                }
                while (nowMonthFirstWeek--) {
                    list.unshift({
                        day: pyear + f(pmonth) + lastMonthLength--,
                        cur: true
                    });
                }
                var a = 1;
                while (nowMonthLength--) {
                    list.push({
                        day: this.year + f(this.month) + a++,
                        cur: false
                    })
                }
                var nextLength = list.length > 35 ? 42 - list.length : 35 - list.length;
                var b = 1;
                while (nextLength--) {
                    list.push({
                        day: nyear + f(nmonth) + b++,
                        cur: true
                    })
                }
                return list;
            },
            schedule() {
                var arr = [];
                for (var i = 0; i < this.calendar.length / 7; i++) {
                    arr.push([]);
                    for (var j = 0; j < 3; j++) {
                        arr[i].push([]);
                        for (var k = 0; k < 7; k++) {
                            arr[i][j].push({colspan:1,day:this.calendar[i*7+k].day,week:k})
                        }
                    }
                }
                this.item.forEach(item => {
                    var start = new Date(item.start.toString().substr(0,4),item.start.toString().substr(4,2),item.start.toString().substr(6,2));
                    var end = new Date(item.end.toString().substr(0,4),item.end.toString().substr(4,2),item.end.toString().substr(6,2));
                    var d = (end - start)/86400000 + 1;
                    var flag = true;
                    arr.forEach((week,weekidx) => {
                        for (var i = 0; i < 3; i++) {
                            for (var j = 0; j < 7; j++) {
                                if (week[i][j]) {
                                    if (week[i][j].day == item.start && flag && !week[i][j].title){
                                        // 第一周持续的时间
                                        var nowWeekD = d + week[i][j].week <= 7 ? d : 7 - week[i][j].week;
                                        // 设置title
                                        week[i][j].title = item.title;
                                        week[i][j].cur = item.cur;
                                        week[i][j].colspan = nowWeekD;
                                        week[i][j].op = item.op;
                                        week[i].splice(j+1,nowWeekD-1);
                                        // 上锁
                                        flag = false;
                                        // 以下内容就是后边跨周持续时间的内容，跟第一周没有关系
                                        // 信号量，剩余的事务持续时间
                                        var rest = d - nowWeekD;
                                        var count = 0;
                                        while (rest > 0) {
                                            count++;
                                            var nextWeekD = rest >= 7 ? 7 : rest;
                                            for (var n = 0; n < 3; n++) {
                                                // 判断当前行有标题，就去下一行
                                                if (arr[weekidx + count][n][0].title) {
                                                    continue;
                                                }
                                                // weekidx是起始周，count跨了几周
                                                arr[weekidx + count][n][0].title = item.title;
                                                arr[weekidx + count][n][0].cur = item.cur;
                                                arr[weekidx + count][n][0].op = item.op;
                                                arr[weekidx + count][n][0].colspan = nextWeekD;
                                                arr[weekidx + count][n].splice(1,nextWeekD-1);
                                                break;
                                            }
                                            rest -= 7;
                                        }
                                    }
                                }
                            }
                        }
                    })
                });
                return arr;
            }
        }
    }
</script>

<style lang="scss">
    .main-body-center {
        -ms-flex: 1 1 0px;
        flex: 1 1 0;
        -webkit-flex: 1 1 0;
        display: flex;
        display: -ms-flexbox;
        display: -webkit-flex;
        -ms-flex-direction: column;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        overflow-wrap: break-word;
    }
    .main-layout .main-body .main-body-center, .module-wrapper {
        -webkit-box-flex: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        position: relative;
        -webkit-box-direction: normal;
    }
    .module-header {
        display: block;
        height: 50px;
        margin: 0;
        padding: 0 15px;
        position: relative;
        background: rgba(253,253,253,.95);
    }
    .module-header--flex-row {
        display: -webkit-box;
        display: flex;
        display: -ms-flexbox;
        display: -webkit-flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
    }
    .module-header:after, .module-header:before {
        content: " ";
        display: table;
    }
    .module-header--flex-row .secondary-text, .module-header--flex-row .title {
        float: none;
        -webkit-box-flex: 1;
        -ms-flex: 1 1 0px;
        flex: 1 1 0;
        -webkit-flex: 1 1 0;
    }
    .module-header .title {
        line-height: 50px;
        font-size: 16px;
        float: left;
        color: #333;
    }
    .module-header .title a {
        color: #333;
    }
    .module-header .title i {
        font-size: 20px;
        margin: 0 10px 4px 0;
        vertical-align: middle;
        color: #22d7bb;
    }
    .module-body {
        -webkit-box-flex: 1;
        -ms-flex: 1 1 0;
        flex: 1 1 0;
        -webkit-flex: 1 1 0;
        position: relative;
        overflow-y: auto;
        overflow-x: auto;
        padding: 15px 15px 0;
        height: 100%;
    }
    .module-body {
        display: -webkit-box;
        display: flex;
        display: -ms-flexbox;
        display: -webkit-flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
    }
    .module-body--calendar-detail {
        position: relative;
        width: 100%;
    }
    .module-body .module-body-content {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -webkit-flex: 1;
        margin-bottom: 15px;
        background: #fdfdfd;
    }
    .fc-unthemed {
        position: relative;
    }
    .fc-unthemed table {
        width: 100%;
        font-size: .9em;
    }
    .fc-unthemed thead, .fc-unthemed tbody {
        border-color: #f3f3f3;
    }
    .fc-unthemed thead th.fc-day-header {
        padding: 10px;
        color: #333;
        font-weight: 400;
    }
    .fc-unthemed tbody td {
        text-align: left;
        vertical-align: top;
        font-size: .9em;
        height: 96px;
        border: 1px solid #f3f3f3;
    }
    .fc-unthemed tbody tr td:first-child, .fc-unthemed tbody tr td:last-child {
        background: url('../../dist/calendar-rest-bg.png');
    }
    .schedule {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .schedule .box {
        width: 100%;
        height: 96px;
    }
    .schedule .box table {
        position: relative;
        top: 1em;
        width: 100%;
    }
    .schedule .box table tr {
        height: 21px;
        line-height: 21px;
        font-size: .8em;
    }
    .schedule .box table tr td.add:hover {
        color: #fff;
        background: #f00000!important;
    }
    .module-header .secondary-text {
        float: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        line-height: 50px;
        padding: 0 10px;
        color: #aaa;
        text-align: center;
    }
    .btn-link {
        color: #aaa;
    }
    .btn-link i {
        font-size: 20px;
    }
    .module-header--flex-row .secondary-text .calendar-today-text {
        font-size: 16px;
        color: #333;
        margin-left: 15px;
        margin-right: 15px;
    }
    .module-header--flex-row .flex-panel {
        float: none;
        min-width: 30%;
        text-align: right;
    }
    .module-header .flex-pane {
        line-height: 50px;
        float: right;
        right: 0;
    }
    .module-header--flex-row .calendar-add {
        min-width: 110px;
        border: 1px solid transparent;
        padding: .469rem 26px;
        font-size: .875rem;
        line-height: 1.5;
        min-width: 106px;
        border-radius: 1.25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        padding: 3px 20px;
        font-size: 14px;
        line-height: 1.42857143;
    }
    .m-r-10 {
        margin-right: 10px!important;
    }
    .btn-primary, .btn-primary:hover {
        color: #fff;
        background-color: #22d7bb;
        border-color: #22d7bb;
    }
    .btn-primary:hover {
        box-shadow: 0 2px 5px 1px rgba(34,215,187,.6);
    }
    .btn-group{
        position: relative;
        display: inline-flex;
        vertical-align: middle;
    }
    .btn-group > button {
        border-radius: .25rem;
        padding: .157rem 20px;
        font-size: .875rem;
        min-width: 70px;
        background-color: transparent;
        border: 1px solid transparent;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        color: #888;
        border-color: #ddd;
    }
    .btn-group>.btn:not(:last-child):not(.dropdown-toggle) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .btn-group>.btn:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .btn-group > button.active, .btn-group > button:hover {
        color: #22d7bb;
        border-color: #22d7bb;
    }
</style>