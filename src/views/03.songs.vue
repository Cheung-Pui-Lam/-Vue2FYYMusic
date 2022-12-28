<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" @click="tagId=0" :class="{active:tagId==0}">全部</span>
      <span class="item" @click="tagId=7" :class="{active:tagId==7}">华语</span>
      <span class="item" @click="tagId=96" :class="{active:tagId==96}">欧美</span>
      <span class="item" @click="tagId=8" :class="{active:tagId==8}">日本</span>
      <span class="item" @click="tagId=16" :class="{active:tagId==16}">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <!-- 获取一次后台数据(100条),展示的确实当前的页面数据(10条) -->
        <tr class="el-table__row" v-for="(item,index) in currentList" :key="index" @dblclick="playMusic(item.id)" >
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <!-- 歌曲封面 -->
              <img :src="item.album.picUrl" alt="" />
              <!-- 播放按钮 -->
              <span @click="playMusic(item.id,true)" class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <!-- 歌名 -->
                <span>{{item.name}}</span>
                <!-- mv播放按钮 -->
                <span class="iconfont icon-mv" @click="toMv(item.mvid)" v-if="item.mvid!=0" ></span>
                <!-- 添加到歌单按钮 -->
                <el-tooltip class="item" content="添加到播放列表" :enterable="false" placement="bottom">
                  <span @click="playMusic(item.id,false)" class="el-icon-circle-plus-outline"></span>
                </el-tooltip>
              </div>
            </div>
          </td>
          <!-- 歌手名 -->
          <td>{{item.album.artists[0].name}}</td>
          <!-- 专辑名 -->
          <td>{{item.album.name}}</td>
          <!-- 歌曲时长(默认为ms) -->
        <td>{{item.duration}}</td>
        </tr>
      </tbody>
    </table>

    <!-- 分页器 
    total:总条数
    current-page:当前页
    page-size:每页多少条数据
    current-change:页码改变事件
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="currentPageChange"
      :current-page="queryInfo.offset"
      :page-size="queryInfo.limit"
      :total="100"
      >
      </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'songs',
  data() {
    return {
      // 总歌曲列表
      list:[],
      // 分类id 全部:0华语:7欧美:96日本:8韩国:16
      tagId:'0',
      // 当前页面歌曲列表
      currentList: [],
      // 参数传递信息
      queryInfo: {
        limit: 10,
        offset: 1,
      },
    }
  },
  methods: {
    // 向后台调取最新音乐数据
    getSongList(){
    // 获取最新音乐数据
      this.$axios.get('/top/song' ,{
        // params参数
        params: {
          // 地区类型(0为全部)
          type:this.tagId,
          // 限制获取歌曲的数目
          limit: 20,
          // 分页(页数跳转公式:(页数-1)*数据条数)
          offset: 1,
        },
      }).then(res=>{
        // console.log(res);
          // 将后端返回过来的最新音乐数据(数组)赋值给list
          this.list = [...res.data.data]
          this.currentList = this.list.slice(0, this.queryInfo.limit)
          // 获取歌曲的总数
          // 获取歌曲时长,将ms转化为s
          for(let i=0;i<=this.list.length;i++){
            // 获取每首歌曲的总ms数
            let duration = this.list[i].duration
            // 计算公式:分=ms/1000/60,秒=ms/1000%60
            let min = parseInt(duration/1000/60)//强制转化为整数
            if (min<10) {
              // 小于十补零更加美观
              min = '0'+min
            }
            let sec = parseInt(duration/1000%60)//强制转化为整数 
            if (sec<10) {
              sec = '0'+sec
            }
            // console.log(min,sec);
            // 将整理好后的歌曲时长赋值回去
            this.list[i].duration = `${min}:${sec}`
            // return res;
          }
      })
    } ,
    // 播放音乐
    playMusic(id,insert = true) {
      // console.log(1)
      this.$store.dispatch('getAudioInfo', {
        id,
        isInsert: insert,
      })
      this.audio = this.$store.state.audioInfo
      // 向后台请求校验数据
      this.$axios.get('/song/url',{
        params:{
          // 对象的简写形式
          id
        }            
      }).then(res=>{
        // console.log('111',res);
        let url = res.data.data[0].url
        const songid = res.data.data[0].id
        // 判断获取到的歌曲url是否为null
        if(url !== null){ 
          // 提示播放成功
          this.$axios.get('/song/detail',{
            params:{
              // 对象的简写形式
              ids:songid
            }
            }).then(res=>{
              // console.log('通过歌曲id获取到的歌曲信息',res);
              this.$Bus.$emit('switch')
              if (insert) {
                // 提示播放成功
                this.$notify.success({
                  title:'正在播放.......',
                  message:res.data.songs[0].name
                  }) 
              }else{
                this.$notify.success({
                  title: res.data.songs[0].name,
                  message: `成功添加到播放列表啦~`,
                })
              }
            }) 
        }else{
          // 提示暂时无音源!
          this.$notify.error({
            title: '播放失败!',
            message: '不好意思!当前歌曲暂无音源!'
          });
        }          
      })
      console.log('111',this.$store.state.audioInfo);
    },
    // 页码改变事件(用于监测页码的变化)
    currentPageChange(newPage) {
      // 页码发生改变时不再项后台发送请求,请求只发送一次,后面就是对请求回来的数据进行切割展示
      this.queryInfo.offset = newPage
      let start = (this.queryInfo.offset - 1) * this.queryInfo.limit
      let end = (this.queryInfo.offset - 1) * this.queryInfo.limit + this.queryInfo.limit
      this.currentList = this.list.slice(start, end)
    },
    // 去mv详情页
    toMv(id){
        // 跳转并携带数据即可
        this.$router.push('/mv?m='+id)
      },
  },
  // 网页一创建就开始向后台请求数据
  created() {
    this.getSongList()
  },
  // 设置监听器监听分类的点击
  watch:{
    tagId(){
      this.queryInfo.offset = 1
      // 一旦分类点击重新向后端调取数据
      this.getSongList()
    }
  }
};
</script>

<style scoped>
.el-icon-circle-plus-outline{
  color: skyblue;
  margin-left: 10px;
}
</style>
