<template>
  <div class="playlists-container">
    <!-- 精品歌单 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topList.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{topList.name}}
        </div>
        <div class="info">
          {{topList.description}}
        </div>
      </div>
      <img :src="topList.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <!-- 设置逻辑点击高亮(点击事件:点谁就将谁赋给selectTag) -->
        <span class="item" :class="{active:selectTag=='全部'}" @click="selectTag='全部'">全部</span>
        <span class="item" :class="{active:selectTag=='欧美'}" @click="selectTag='欧美'">欧美</span>
        <span class="item" :class="{active:selectTag=='华语'}" @click="selectTag='华语'">华语</span>
        <span class="item" :class="{active:selectTag=='流行'}" @click="selectTag='流行'">流行</span>
        <span class="item" :class="{active:selectTag=='说唱'}" @click="selectTag='说唱'">说唱</span>
        <span class="item" :class="{active:selectTag=='摇滚'}" @click="selectTag='摇滚'">摇滚</span>
        <span class="item" :class="{active:selectTag=='民谣'}" @click="selectTag='民谣'">民谣</span>
        <span class="item" :class="{active:selectTag=='电子'}" @click="selectTag='电子'">电子</span>
        <span class="item" :class="{active:selectTag=='轻音乐'}" @click="selectTag='轻音乐'">轻音乐</span>
        <span class="item" :class="{active:selectTag=='影视原声'}" @click="selectTag='影视原声'">影视原声</span>
        <span class="item" :class="{active:selectTag=='ACG'}" @click="selectTag='ACG'">ACG</span>
        <span class="item" :class="{active:selectTag=='怀旧'}" @click="selectTag='怀旧'">怀旧</span>
        <span class="item" :class="{active:selectTag=='治愈'}" @click="selectTag='治愈'">治愈</span>
        <span class="item" :class="{active:selectTag=='旅行'}" @click="selectTag='旅行'">旅行</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item,index) in list" 
               :key="index" 
               @click="toPlayList(item.id)"
               >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <!-- 跳转歌单按钮(点击跳转歌单路由组件) -->
              <span class="iconfont icon-play" ></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 
        total:总条数
        current-page:当前页
        page-size:每页多少条数据
        current-change:页码改变事件
    -->
    <el-pagination
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  name: 'recommend',
  data() {
    return {
      // 总条数
      total:0,
      // 页码数,页数跳转公式:(页数-1)*数据条数
      page:1,
      // 顶部的精品歌单
      topList:{},
      // 歌单列表
      list:[],
      // 定义一个字段用于保存当前选择的数据(active)
      selectTag:'全部',
    };
  },
  methods: {
    // 精品歌单(设置成方法减少代码量)
    topData(){
      // 将数据接口的cat值设为selectTag
      // 顶部的 精品歌单
      axios({
          // 设置请求url
          url: 'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/top/playlist/highquality' ,
          // 设置请求方式
          method: 'get',
          // params参数
          params: {
            // 顶部只有一个精品歌单所有这里我们选择一条即可
            limit:1,
            // 将数据接口的cat值设为selectTag
            cat:this.selectTag,
          },
      }).then(res=>{
        // console.log(res);
        // 将后端返回过来的精品歌单数据(对象)赋值给topList
        this.topList = res.data.playlists[0]
      })
    },

    // 歌单列表
    playListData(){
      axios({
          // 设置请求url
          url: 'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/top/playlist/' ,
          // 设置请求方式
          method: 'get',
          // params参数
          params: {
            // 歌单列表选择10条
            limit:10,
            // 分页(页数跳转公式:(页数-1)*数据条数)
            offset: (this.page-1)*10,
            // 将数据接口的cat值设为selectTag
            cat:this.selectTag,
          },
      }).then(res=>{
        // console.log(res);
        this.total = res.data.total//歌单总数
        // 将后端返回过来的歌单列表数据(对象)赋值给list
        this.list = res.data.playlists
        for (let i = 0; i < this.list.length; i++) {
            // 处理播放次数(大于100000给万做后缀)
            if (this.list[i].playCount>10000) {
              this.list[i].playCount = parseInt(this.list[i].playCount/10000) + '万'
            } 
          }
      })
    },

    // 页码改变事件(用于监测页码的变化)
    handleCurrentChange(val) {
      // es6模板字符串
      // console.log(`当前页: ${val}`);
      // 保存页码数
      this.page = val
      // 页码发生跳转重新获取数据
      this.playListData()
    },

    // 去歌单详情页
    toPlayList(id){
      // 跳转并携带数据即可
      this.$router.push('/playlist?m='+id)
    }
  },

  // 使用监听器watch来监测点击标题(selectTag),当标题发生改变时接受对应的接口数据(点击显示)
  watch:{
    selectTag(){
      // 顶部精品歌单
      this.topData()
      // 播放列表
      this.playListData()  
      // 当我们切换分类时,将页码改回为1
      this.page = 1
    }
  },

  // 我们一进入网页就开始向后端api接口请求数据(初次显示)
  created() {
      // 顶部精品歌单
      this.topData()
      // 播放列表
      this.playListData()  
  },
};
</script>

<style >

</style>
