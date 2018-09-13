<template>
    <div class="main-layout">
        <div class="app-nav-area">
            <!--上方图标-->
            <div class="top-area">
                <a href="javascript:;" class="team-logo">
                    <img src="./assets/team_logo_default.png">
                </a>
            </div>
            <!--中间-->
            <div class="middle-area">
                <ul class="nav-apps">
                    <li v-for="v in list" :class="{active: $route.path.indexOf(v.url) != -1}" @click="change(v.url)">
                        <a href="javascript:;" class="app-item">
                            <span class="item-icon">
                                <i class="iconfont" :class="v.cls"></i>
                            </span>
                            <span class="name">{{v.text}}</span>
                        </a>
                    </li>
                </ul>
            </div>
            <!--下面-->
            <div class="bottom-area">
                <ul class="nav-apps">
                    <li>
                        <a href="javascript:;" class="app-item"></a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="module-body-wrapper">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                list: [
                    {
                        cls: 'icon-icon--',
                        text: '消息',
                        url: '/messages'
                    },
                    {
                        cls: 'icon-iconset0338',
                        text: '项目',
                        url: '/mission'
                    },
                    {
                        cls: 'icon-rili',
                        text: '日历',
                        url: '/calendar/'
                    },
                    {
                        cls: 'icon-iconset0196',
                        text: '网盘',
                        url: '/drive'
                    }
                ]
            }
        },
        methods: {
            change(url) {
                this.$router.push({path:url})
                console.log(this.$route)
            }
        }
    }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
  }
  body,html {
    height: 100%;
  }
  body {
      font-size: .875rem;
  }
  #app {
    height: 100%;
  }
  .main-layout {
    margin: 0;
    display: flex;
    display: -ms-flexbox;
    display: -webkit-flex;
    -ms-flex-direction: row;
    flex-direction: row;
    height: 100%;
  }
  .app-nav-area {
    flex-shrink: 0;
    position: relative;
    width: 70px;
    height: 100%;
    background: #22d7bb;
    overflow-y: hidden;
  }
  .app-nav-area .top-area .team-logo {
    margin: 18px 0;
    text-align: center;
    display: block;
  }
  .app-nav-area .top-area .team-logo img {
    width: 50px;
    height: 50px;
    border-radius: 12px;
  }
  .app-nav-area .middle-area {
    text-align: center;
  }
  .app-nav-area .nav-apps {
    margin: 0;
    padding: 0;
  }
  .app-nav-area .nav-apps li {
    cursor: pointer;
    position: relative;
  }
  .app-nav-area .nav-apps li.active a.app-item:before {
    content: "";
    position: absolute;
    right: 0;
    top: 30px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-right: 5px solid #fdfdfd;
    border-bottom: 6px solid transparent;
  }
  .app-nav-area .nav-apps li a.app-item {
    display: block;
    text-decoration: none;
    height: 70px;
    -webkit-transition: -webkit-box-shadow .3s;
    transition: -webkit-box-shadow .3s;
    transition: box-shadow .3s;
    transition: box-shadow .3s,-webkit-box-shadow .3s;
  }
  .app-nav-area .nav-apps li a.app-item .item-icon {
    margin-top: 15px;
    display: inline-block;
    color: #fff;
    font-size: 24px;
    opacity: .8;
    -webkit-transition: opacity .5s,-webkit-transform .5s;
    transition: opacity .5s,-webkit-transform .5s;
    transition: transform .5s,opacity .5s;
    transition: transform .5s,opacity .5s,-webkit-transform .5s;
  }
  .app-nav-area .nav-apps li a.app-item .item-icon i, .wt-select-icon-wrap li i {
    font-size: 24px;
  }
  .app-nav-area .nav-apps li a.app-item .item-icon .icon-hover {
    display: none;
  }
  a .wtf {
    display: inline-block;
  }
  .app-nav-area .nav-apps li a.app-item .name {
    display: block;
    height: 0;
    overflow: hidden;
    font-size: 12px;
    color: #fff;
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-transition: height .5s,-webkit-transform .5s;
    transition: height .5s,-webkit-transform .5s;
    transition: height .5s,transform .5s;
    transition: height .5s,transform .5s,-webkit-transform .5s;
  }
  .app-nav-area .nav-apps li:hover a.app-item {
    -webkit-box-shadow: 0 0 2px 2px #18bfa4;
    box-shadow: 0 0 2px 2px #18bfa4;
  }
  .app-nav-area .nav-apps li:hover a.app-item .item-icon {
    opacity: 1;
    -webkit-transform: translateY(-10px);
    transform: translateY(-10px);
  }
  .app-nav-area .nav-apps li:hover a.app-item .item-icon .icon-default {
    display: none;
  }
  .app-nav-area .nav-apps li:hover a.app-item .item-icon .icon-hover {
    display: inherit;
  }
  .app-nav-area .nav-apps li:hover a.app-item .name {
    height: auto;
    -webkit-transform: translateY(-10px);
    transform: translateY(-10px);
  }
  .app-nav-area .nav-apps li.active a.app-item:before {
    content: "";
    position: absolute;
    right: 0;
    top: 30px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-right: 5px solid #fdfdfd;
    border-bottom: 6px solid transparent;
  }
  .app-nav-area .nav-apps li.active a.app-item {
    background: #18bfa4;
  }
  .module-body-wrapper {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 0px;
    flex: 1 1 0;
    -webkit-flex: 1 1 0;
    display: -webkit-box;
    display: flex;
    display: -ms-flexbox;
    display: -webkit-flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    position: relative;
  }
  .app-nav-area .bottom-area {
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .app-nav-area .nav-apps li {
    cursor: pointer;
    position: relative;
  }
  .app-nav-area .nav-apps li a.app-item {
    display: block;
    text-decoration: none;
    height: 70px;
    -webkit-transition: -webkit-box-shadow .3s;
    transition: -webkit-box-shadow .3s;
    transition: box-shadow .3s;
    transition: box-shadow .3s,-webkit-box-shadow .3s;
  }
</style>
