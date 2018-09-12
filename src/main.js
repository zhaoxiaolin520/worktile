import "babel-polyfill";
import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueResource);
const store = new Vuex.Store({
    state:{
        todos:[],
        type: []
    },
    mutations:{
        GETALL(state,payload) {
            state.todos = payload;
        },
        GETFENLEI(state,payload) {
            state.type = payload;
        },
        CHANGECUR(state,payload) {
            state.todos.forEach((item) => {
                if(item.id == payload.id) {
                    item.cur = payload.cur;
                }
            })
        },
        CHANGEOP(state,payload) {
            state.todos.forEach((item) => {
                if(item.id == payload.id) {
                    item.op = payload.op;
                }
            })
        },
        ADD(state,payload) {
            state.todos.push(payload);
        },
    },
    actions:{
        async GETALL(context,payload){
            var data = await fetch('/all/').then(res => res.json());
            context.commit('GETALL',data);
        },
        async GETFENLEI(context,payload){
            var data = await fetch('/type/').then(res => res.json());
            context.commit('GETFENLEI',data);
        },
        async CHANGECUR({commit},payload) {
            var data = await fetch('./type/'+payload.id,{
                "method":"PATCH",
                "headers":{
                    "Content-Type":"application/json"
                },
                "body":JSON.stringify({cur: payload.cur})
            }).then(res => res.json());
            commit('CHANGECUR',data);
        },
        async CHANGEOP({commit},payload) {
            var data = await fetch('./all/'+payload.id,{
                "method":"PATCH",
                "headers":{
                    "Content-Type":"application/json"
                },
                "body":JSON.stringify({op: payload.op})
            }).then(res => res.json());
            commit('CHANGEOP',data);
        },
        async ADD({commit},payload) {
            var data = await fetch('/all/',{
                "method":"POST",
                "headers":{
                    "Content-Type":"application/json"
                },
                "body":JSON.stringify(payload)
            }).then(res => res.json());
            commit("ADD",data);
        },
    },
    getters:{
        // 数据操作
        all:function (state) {
            return state.todos.filter(item => item.type == 'all');
        },
        my:function (state) {
            return state.todos.filter(item => item.type == 'my');
        },
        members:function (state) {
            return state.todos.filter(item => item.type == 'members');
        }
    }
});
const r = [
    {
        path: '/messages',
        // component: Index.default,
        name: '消息'
    },
    {
        path: '/mission',
        // component: News.default,
        name: '项目'
    },
    {
        path: '/calendar/',
        component: require('./calendar/calendar.vue').default,
        name: '日历',
        children:[
            {
                path: '/calendar/my',
                component: require('./calendar/all.vue').default,
                name: '我的日程'
            },
            {
                path: '/calendar/all',
                component: require('./calendar/all.vue').default,
                name: '团队日程'
            },
            {
                path: '/calendar/members',
                component: require('./calendar/all.vue').default,
                name: '成员日程'
            },
            {
                path: '*',
                redirect:'/calendar/all'
            }
        ]
    },
    {
        path: '/drive',
        // component: Video.default,
        name: '网盘',
    },
    {
        path: '*',
        redirect: '/calendar/all'
    }
]

const router = new VueRouter({
    routes: r
})

new Vue({
  el: '#app',
    store,
    router,
    components: {
        App
    }
})
