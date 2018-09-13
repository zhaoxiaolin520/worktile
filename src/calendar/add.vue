<template>
    <div class="window">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <a href="javascript:;" class="modal-close" @click="hide()"><i class="iconfont icon-x"></i></a>
                    <h3 class="modal-title">新建日程</h3>
                </div>
                <div class="modal-body">
                    <div class="form-group row-fill">
                        <input type="text" class="form-control" placeholder="日程安排，如下午2:00例会" v-focus v-model="text">
                    </div>
                    <div class="form-group" v-if="this.name == '团队日程'">
                        <label class="control-label">日历</label>
                        <div class="col-sm-10">
                            <div class="lc-select">
                                <select class="form-control" v-model="fz">
                                    <option v-for="v in this.json">{{v.title}}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="form-group">
                            <label class="control-label">开始日期</label>
                            <div class="col-sm-4">
                                <input type="date" class="form-control" @blur="getStart($event)">
                            </div>
                            <label class="control-label">结束日期</label>
                            <div class="col-sm-4">
                                <input type="date" class="form-control" @blur="getEnd($event)">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-10 offset-sm-2">
                                <button class="btn" @click="addDate()">确定</button>
                                <a href="javascript:;" class="btn" @click="hide()">取消</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mengban"></div>
    </div>
</template>

<script>
    export default {
        props: ['json','name','op1'],
        data() {
            return {
                isShow: false,
                text: "",
                start: "",
                end: "",
                fz: "",
                cur: "",
                type: "",
                op: ""
            }
        },
        computed: {
            getType() {
                return this.$store.state.type;
            }
        },
        methods: {
            getStart(e) {
                var self = this;
                var json = e.target.value.split('-').join('');
                if (json.substr(6,1) == '0') {
                    self.start = json.substr(0,6)+json.substr(7,1);
                }else {
                    self.start = json;
                }
            },
            getEnd(e) {
                var self = this;
                var json = e.target.value.split('-').join('');
                if (json.substr(6,1) == '0') {
                    self.end = json.substr(0,6)+json.substr(7,1);
                }else {
                    self.end = json;
                }
            },
            create() {
                console.log(this.op1);
                var id = '';
                var str = "741852qwertyuioplkjhgfdszxcvbnm0963";
                for(var i = 0; i < 8; i++) {
                    //~~ 相当于parseInt
                    id+= str[~~(Math.random() * str.length)]
                }
                // 发送add 新增命令
                if (this.op1) {
                    this.op1.forEach(item => {
                        if(item.title == this.fz) {
                            item.cur ? this.op = 1 : this.op = 0;
                            this.cur = item.color;
                        }
                    })
                }
                else {
                    this.json.forEach(item => {
                        if(item.title == this.fz) {
                            item.cur ? this.op = 1 : this.op = 0;
                            this.cur = item.color;
                        }
                    })
                }

                if (this.name == '团队日程') {
                    this.$store.dispatch("ADD",{
                        title: this.text,
                        id : id,
                        start: this.start,
                        end: this.end,
                        fz: this.fz,
                        op: this.op,
                        cur: this.cur,
                        type: "all"
                    });
                }
                else if (this.name == '我的日程') {
                    this.$store.dispatch("ADD",{
                        title: this.text,
                        id : id,
                        start: this.start,
                        end: this.end,
                        cur: "skyblue",
                        type: "my"
                    })
                }
                else if (this.name == '成员日程') {
                    this.$store.dispatch("ADD",{
                        title: this.text,
                        id : id,
                        start: this.start,
                        end: this.end,
                        cur: "yellowgreen",
                        type: "members"
                    })
                }
                // 点击后 清空 文本框
                this.text = '';
                this.fz = '';
                this.hide()
            },
            addDate() {
                if (this.name == '团队日程') {
                    if (this.fz == ''|| this.text == '' || this.start == '' || this.end == '') {
                        alert('请选择日历分组、填写日历内容和时间');
                    }
                    else {
                        this.create();
                    }
                }
                else {
                    if (this.text == '' || this.start == '' || this.end == '') {
                        alert('请填写日历内容和时间');
                    }
                    else {
                        this.create();
                    }
                }
            },
            hide() {
                this.$emit('myEvent',this.isShow);
            }
        },
        directives:{
            focus:{
                inserted(el){
                    el.focus()
                }
            }
        }
    }
</script>

<style lang="scss">
    .window {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        outline: 0;
        display: block;
        z-index: 999;
    }
    .window .mengban {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        outline: 0;
        display: block;
        opacity: .3;
        background: #000;
    }
    .modal-dialog{
        position: relative;
        width: auto;
        margin: .5rem;
        pointer-events: none;
        max-width: 660px;
        margin: 3.75rem auto;
        z-index: 1000;
    }
    .modal-content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        pointer-events: auto;
        background-color: #fff;
        background-clip: padding-box;
        border: 0 solid rgba(0,0,0,.2);
        border-radius: .3rem;
        box-shadow: 0 0 1.5rem rgba(0,0,0,.4);
        outline: 0;
    }
    .modal-header {
        padding: 0 1.875rem;
        align-items: center;
        height: 50px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        border-top-left-radius: .3rem;
        border-top-right-radius: .3rem;
    }
    .modal-header .modal-close {
        order: 1;
        color: #9cc2cb;
        line-height: 50px;
    }
    .modal-title {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0;
        line-height: 1.5;
    }
    .modal-body {
        position: relative;
        flex: 1 1 auto;
        padding: 1.25rem 1.875rem 1.875rem;
    }
    .modal-body .form-group {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1rem;
        margin-left: -15px;
        margin-right: -15px;
    }
    .modal-body .form-group.row-fill {
        margin-left: 0;
        margin-right: 0;
    }
    .form-control {
        display: block;
        width: 100%;
        line-height: 1.5;
        color: #333;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #eee;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        padding: .469rem .875rem;
        font-size: .875rem;
    }
    .form-control:focus, .form-control:hover {
        border-color: #22d7bb;
    }
    .form-group .control-label {
        color: #888;
        font-size: 14px;
        font-weight: 400;
        padding-right: 0;
        padding-left: 0;
        text-align: right;
        margin-bottom: 0;
        padding-top: 6px;
        flex: 0 0 16.66667%;
        max-width: 16.66667%;
    }
    .col-sm-4, .col-sm-10 {
        position: relative;
        width: 100%;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
    @media (min-width: 576px) {
        .col-sm-10 {
            flex: 0 0 83.33333%;
            max-width: 83.33333%;
        }
        .col-sm-4 {
            flex: 0 0 33.33333%;
            max-width: 33.33333%;
        }
        .offset-sm-2 {
            margin-left: 16.66667%;
        }
    }
    .lc-select {
        position: relative;
    }
    .lc-select select {
        padding-right: 30px;
    }
    .lc-select select option {
        color: #666;
    }
    select.form-control{
        height: calc(2.2505rem + 2px);
    }
    .form-control {
        display: block;
        width: 100%;
        line-height: 1.5;
        color: #333;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #eee;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    .form-group .btn {
        display: inline-block;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        border: 1px solid transparent;
        padding: .469rem 26px;
        font-size: .875rem;
        line-height: 1.5;
        min-width: 106px;
        border-radius: 1.25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        color: #fff;
        background-color: #22d7bb;
        border-color: #22d7bb;
    }
    .form-group a.btn {
        margin-left: 10px;
        color: #aaa;
        padding: .469rem 10px;
        min-width: 0;
        background-color: transparent;
        border-color: transparent;
    }
</style>