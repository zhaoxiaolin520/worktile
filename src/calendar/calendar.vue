<template>
    <div class="main-body">
        <div class="main-body-side">
            <div class="header">
                <span class="title">日历</span>
            </div>
            <div class="body-list">
                <div class="calendar-list-wrap">
                    <!--上方日历-->
                    <div class="calendar-panel">
                        <div class="lc-date-picker">
                            <div>
                                <table>
                                    <thead>
                                    <!--按钮-->
                                    <tr>
                                        <th>
                                            <button class="btn pull-left uib-left btn-sm" @click="dec()">
                                                <i class="glyphicon-chevron-left"></i>
                                            </button>
                                        </th>
                                        <th colspan="5">
                                            <button class="btn uib-title btn-sm">
                                                <strong>{{year}}年{{month}}月</strong>
                                            </button>
                                        </th>
                                        <th>
                                            <button class="btn pull-left uib-right btn-sm" @click="add()">
                                                <i class="glyphicon-chevron-right"></i>
                                            </button>
                                        </th>
                                    </tr>
                                    <!--日期-->
                                    <tr>
                                        <th v-for="v in xingqi">
                                            <small>{{v}}</small>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(v,i) in calendar.length / 7">
                                        <td v-for="n of 7">
                                            <button class="btn btn-sm btn-default" :class="{active:calendar[i*7+(n-1)].cur}">
                                                <small @click="change(i*7+(n-1))">{{calendar[i*7+(n-1)].day}}</small>
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="toc-section" v-for="v in list" :class="{active: $route.path.indexOf(v.url) != -1}">
                        <div class="section-header" @click="changed(v.url,v.type)">
                            <a href="javascript:;" class="expand-icon">
                                <i class="iconfont" :class="v.cls"></i>
                            </a>
                            <a href="javascript:;" class="title">{{v.text}}</a>
                            <a href="javascript:;" v-if="v.text=='团队日程'">...</a>
                        </div>
                        <div v-if="v.text =='团队日程'" class="section-body">
                            <ul>
                                <li v-for="c in types" :data-col="c.color">
                                    <a href="javascript:;" class="section-item">
                                        <i class="calendar-mute-lcfont iconfont" :style="{background: c.color,color: '#fff'}" @click="dui($event,c.id,c.title)" :class="{'icon-duihao3': c.cur}"></i>
                                        <span class="section-title">{{c.title}}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <router-view todos :item="this.todos" :type="this.types"></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                xingqi: ['日','一','二','三','四','五','六'],
                year: new Date().getFullYear(),
                month: new Date().getMonth()+1,
                mon: '',
                day: new Date().getDate(),
                calendar: [],
                nowMonthLength: '',
                nowMonthFirstWeek: '',
                lastMonthLength: '',
                state: 'all',
                list: [
                    {
                        cls: 'icon-rili',
                        text: '我的日程',
                        url: '/calendar/my',
                        type: 'my'
                    },
                    {
                        text: '团队日程',
                        url: '/calendar/all',
                        type: 'all',
                        list: []
                    },
                    {
                        text: '成员日程',
                        url: '/calendar/members',
                        type: 'members'
                    }
                ]
            }
        },
        created() {
            // 发送默认 GETALL
            this.$store.dispatch("GETALL");
            this.$store.dispatch("GETFENLEI");
            this.state = this.$route.path.split('/')[this.$route.path.split('/').length-1];
        },
        mounted() {
            this.get();
        },
        computed: {
            todos() {
                if (this.state == 'all') {
                    return this.$store.getters.all;
                }else if(this.state == "my"){
                    return this.$store.getters.my
                }else if(this.state == "members"){
                    return this.$store.getters.members
                }
            },
            types() {
                return this.$store.state.type;
            }
        },
        methods: {
            dui(el,id,title) {
                if(el.target.className == 'calendar-mute-lcfont iconfont') {
                    el.target.className = 'calendar-mute-lcfont iconfont icon-duihao3';
                    this.$store.dispatch("CHANGECUR",{
                        id: id,
                        cur: true
                    })
                    this.todos.forEach(item => {
                        if (item.fz == title) {
                            this.$store.dispatch("CHANGEOP",{
                                id : item.id,
                                op: 1
                            });
                        }
                    })
                }else {
                    el.target.className = 'calendar-mute-lcfont iconfont';
                    this.$store.dispatch("CHANGECUR",{
                        id: id,
                        cur: false
                    })
                    this.todos.forEach(item => {
                        if (item.fz == title) {
                            this.$store.dispatch("CHANGEOP",{
                                id : item.id,
                                op: 0
                            });
                        }
                    })
                }
            },
            changed(url,type) {
                this.$router.push({path:url});
                this.state = type;
            },
            get(z) {
                var self = this;
                var list = [];
                self.nowMonthLength = new Date(this.year,this.month,0).getDate();
                self.nowMonthFirstWeek = new Date(this.year,this.month-1).getDay();
                self.lastMonthLength = new Date(this.year,this.month-1,0).getDate();
                var nML = new Date(this.year,this.month,0).getDate();
                var nMFK = new Date(this.year,this.month-1).getDay();
                var lML = new Date(this.year,this.month-1,0).getDate();
                function f(n) {
                    return n.toString().length > 1 ? n.toString() : '0' + n.toString()
                }
                while (nMFK--) {
                    list.unshift({
                        day: f(lML--),
                        cur: false
                    });
                }
                var a = 1;
                while (nML--) {
                    list.push({
                        day: f(a++),
                        cur: false
                    });
                }
                var nextLength =  42 - list.length;
                var b = 1;
                while (nextLength--) {
                    list.push({
                        day: f(b++),
                        cur: false
                    })
                }
                var items = []
                list.forEach(item => {
                    if (item.day == f(this.day)) {
                        item.cur = true;
                        items.push(item);
                    }
                })
                if (items.length > 1) {
                    z ? items[0].cur = false : items[1].cur = false
                }
                self.calendar = list;
                self.mon = f(this.month);
            },
            add(d) {
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
                d? this.day = d :this.day = '01';
                this.get();
            },
            dec(d,z) {
                this.month--;
                if (this.month == 0) {
                    this.month = 12;
                    this.year--
                }
                else {
                    this.month;
                    this.year;
                }
                d? this.day = d :this.day = '01';
                console.log(z)
                this.get(z);
            },
            change(num) {
                var self = this;
                this.calendar.forEach(item => {
                    item.cur = false;
                })
                this.calendar[num].cur = true;
                if (num < self.nowMonthFirstWeek) {
                    self.dec(self.calendar[num].day,1);
                    console.log(num);
                }
                else if (num >= self.nowMonthFirstWeek+self.nowMonthLength) {
                    self.add(self.calendar[num].day);
                }
            }
        }
    }
</script>

<style lang="scss">
    strong {
        font-weight: 700;
    }
    .main-layout .main-body {
        position: relative;
        width: calc(100% - 70px);
        overflow: hidden;
        display: flex;
        display: -ms-flexbox;
        display: -webkit-flex;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-flex: 1;
        -ms-flex: 1 1 0px;
        flex: 1 1 0;
        -webkit-flex: 1 1 0;
        background: rgb(238, 238, 238);
    }
    .main-layout .main-body .main-body-side {
        display: -webkit-box;
        display: flex;
        display: -ms-flexbox;
        display: -webkit-flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        position: relative;
        width: 240px;
        background: rgba(253,253,253,.95);
        border-right: 1px solid #ddd;
        -webkit-transition: width .2s ease-in-out;
        transition: width .2s ease-in-out;
    }
    .main-layout .main-body .main-body-side .header {
        height: 50px;
    }
    .main-layout .main-body .main-body-side .header .title {
        float: left;
        margin: 0 20px;
        color: #333;
        line-height: 50px;
        font-size: 16px;
    }
    .main-layout .main-body .main-body-side .body-list {
        -webkit-box-flex: 1;
        -ms-flex: 1 1 0px;
        flex: 1 1 0;
        -webkit-flex: 1 1 0;
        overflow: hidden;
        margin-bottom: 3px;
    }
    .main-layout .main-body .main-body-side .calendar-panel, .main-layout .main-body .main-body-side .chat-list, .main-layout .main-body .main-body-side .toc-section {
        width: 240px;
    }
    .toc-section {
        margin-bottom: 2px;
    }
    .lc-date-picker {
        padding: 10px;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
        margin-left: auto;
        margin-right: auto;
    }
    .lc-date-picker table thead th {
        padding: 3px 8.5px 3px 8.5px;
    }
    .btn {
        display: inline-block;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
    }
    .btn:not(:disabled):not(.disabled) {
        cursor: pointer;
    }
    .lc-date-picker table thead th .uib-left, .lc-date-picker table thead th .uib-right {
        border: none;
        padding: 3px 5px;
        background: 0 0;
        min-width: 20px;
    }
    .pull-left {
        float: left!important;
    }
    .glyphicon-chevron-left {
        font: normal normal normal 14px/1 FontAwesome;
        padding-left: 0;
        padding-right: 5px;
    }
    .glyphicon-chevron-right {
        font: normal normal normal 14px/1 FontAwesome;
        padding-left: 5px;
        padding-right: 0;
    }
    .glyphicon-chevron-left:before {
        content: "\f104";
    }
    .glyphicon-chevron-right:before {
        content: "\f105";
    }
    .lc-date-picker table thead th .uib-title {
        border: 0;
        padding: 3px 10px;
        background: 0 0;
    }
    .uib-title {
        width: 100%;
    }
    .btn-sm{
        font-size: .875rem;
        line-height: 1.5;
    }
    small {
        font-size: 80%;
        font-weight: 400;
    }
    .lc-date-picker table tbody td {
        padding: 3px;
        text-align: center;
    }
    .lc-date-picker table tbody .btn-default {
        background: 0 0;
        color: #666;
        border: none;
        line-height: 20px;
        padding: 5px 7px;
    }
    .lc-date-picker table tbody .btn-default.active {
        -webkit-box-shadow: none;
        box-shadow: none;
        border-radius: 50%;
        background: #22d7bb;
    }
    .lc-date-picker table tbody .btn-default {
        padding: 2px 5px;
        line-height: 21px;
    }
    .toc-section .section-header {
        margin-bottom: 2px;
        padding: 8px 20px;
        position: relative;
        cursor: pointer;
    }
    .toc-section.active .section-header {
        background: #e7f9f6;
        border-right: 4px solid #22d7bb;
    }
    .section-header .expand-icon {
        margin-right: 6px;
        color: #aaa;
        display: inline-block;
        width: 14px;
        vertical-align: top;
    }
    .section-header .expand-icon i {
        font-size: 14px;
    }
    .wtf {
        display: inline-block;
    }
    .section-header .title, .section-header:hover .title {
        color: #333;
        font-size: .875rem;
    }
    .section-body .section-item {
        color: #666;
        display: block;
        padding: 9px 20px 9px 39px;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -webkit-transition: -webkit-box-shadow .2s;
        transition: -webkit-box-shadow .2s;
        transition: box-shadow .2s;
        transition: box-shadow .2s,-webkit-box-shadow .2s;
        border-right: 4px solid transparent;
    }
    .section-body .section-item .calendar-mute-lcfont {
        width: 20px;
        height: 20px;
        display: inline-block;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
        margin-left: -2px;
    }
    .section-body .section-item .section-title {
        display: inline-block;
        max-width: 140px;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>