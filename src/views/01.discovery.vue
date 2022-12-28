<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <!-- 循环获取banners数据 -->
      <el-carousel-item v-for="(item,index) in banners" :key="index" >
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">
        <div class="item" v-for="(item,index) in recommendList" :key="index" @click="toPlayList(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <div class="items">
        <div class="item" v-for="(item,index) in newSongs" :key="index">
          <div class="img-wrap">
            <!-- 封面 -->
            <img :src="item.picUrl" alt="" />
            <!-- 播放按钮(将音乐的id发送过去) -->
            <span @click="playMusic(item.id,true)" class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <!-- 歌名 -->
            <div class="song-name">{{item.name}}</div>
            <!-- 歌手名 -->
            <div class="singer">{{item.song.artists[0].name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" 
             v-for="(item,index) in mv" 
             :key="index"
             @click="toMv(item.id)"
             >
          <div class="img-wrap">
            <!-- mv图片 -->
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <!-- mv播放次数 -->
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <!-- mv名字 -->
            <div class="name">{{item.name}}</div>
            <!-- 歌手名字 -->
            <div class="singer">{{item.artistName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 导入辅助函数
  import { mapActions } from 'vuex'

  export default {
    name: 'discovery',
    data() {
      return {
        // 轮播图数据
        banners:[],
        // 推荐歌单
        recommendList:[],
        // 最新音乐
        newSongs:[],
        // 推荐mv
        mv:[]
      }
    },
    methods: {
      // 通过辅助函数把mutations里的函数引用到这里
      ...mapActions(['getAudioInfo']),
      // 点击按钮，播放音乐
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
      // 去歌单详情页
      toPlayList(id){
        // 跳转并携带数据即可
        this.$router.push('/playlist?m='+id)
      },
      // 跳转到mv详情页
      toMv(id){
        // 跳转并携带数据即可
        // console.log(id)
        this.$router.push('/mv?m='+id)
      },
    },

    // 我们一进入网页就开始向后端api接口请求数据
    created() {
      // 轮播图接口设置
      this.$axios.get('/banner' ,{
        }).then(res=>{
            // console.log(res);
            // 将接收到的轮播图数据赋给banners数组
            this.banners = res.data.banners
          })

          // 推荐歌单接口设置
          this.$axios.get('/personalized' ,{
            // 设置接收限制
            params:{
              // 取出15条推荐歌单
              limit:15
            }
          }).then(res=>{
              // console.log(res);
              // 将接收过来的最新数据存放到recommendList
              this.recommendList = res.data.result
            })

        // 最新音乐接口设置
        this.$axios.get('/personalized/newsong').then(res=>{
            // console.log(res);
            // 将接收过来的推荐歌单数据存放到newSongs
            this.newSongs = res.data.result
          })

          // 推荐MV接口设置
          this.$axios.get('/personalized/mv').then(res=>{
            // console.log('首页推荐mv',res);
            this.mv = res.data.result
            // console.log(this.mv[0]);
          })
    },
  };
</script>

<style >

</style>
