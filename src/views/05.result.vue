<template>
  <div class="result-container">
    <div class="title-wrap">
      <!-- 顶部的标题 -->
      <h2 class="title">{{$route.query.m}}</h2>
      <!-- 搜索到的歌曲总数 -->
      <span class="sub-title">找到{{total}}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr 
              v-for="(item,index) in searchSongs" 
              :key="index" 
              class="el-table__row"
              @dblclick="playMusic(item.id)"
              >
              <td>{{index+1}}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 歌名 -->
                    <span>{{item.name}}</span>
                    <!-- mv图标 -->
                    <span v-if="item.mvid!=0" class="iconfont icon-mv" @click="toMv(item.mvid)"></span>
                    <!-- 添加到歌单按钮 -->
                    <el-tooltip class="item" content="添加到播放列表" :enterable="false" placement="bottom">
                      <span @click="playMusic(item.id,false)" class="el-icon-circle-plus-outline"></span>
                    </el-tooltip>
                  </div>
                  <!-- 二级标题 -->
                  <span>{{item.alias[0]}}</span>
                </div>
              </td>
              <!-- 歌手名 -->
              <td>{{item.artists[0].name}}</td>
              <!-- 专辑名 -->
              <td>{{item.album.name}}</td>
              <!-- 歌曲时长 -->
              <td>{{item.duration}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div v-for="(item,index) in searchList" 
              :key="index" 
              class="item"
              @click="toPlayList(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div v-for="(item,index) in mv" 
              :key="index" class="item" 
              @click="toMv(item.id)"
              >
            <div class="img-wrap">
              <!-- mv背景 -->
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <!-- mv播放次数 -->
                <div class="num">{{item.playCount}}</div>
              </div>
              <!-- mv播放时长 -->
              <span class="time">{{item.duration}}</span>
            </div>
            <div class="info-wrap">
              <!-- mv名字 -->
              <div class="name">{{item.name}}</div>
              <!-- mv歌手 -->
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
    >
    </el-pagination>
  </div>
</template>

<script>
//首先导入axios 
import axios from 'axios'
  export default {
    name: 'result',
    data() {
      return {
        // 总数(歌曲,歌单和mv)
        total:0,
        // 页码
        page:1,
        // tab切换时,会改变的数据(歌曲:songs,歌单:lists,MV:mv)
        activeIndex: 'songs',
        // 搜索到的歌曲
        searchSongs:[],
        // 搜索到的歌单
        searchList:[],
        // 搜索到的mv
        mv:[],
        // 设置页码器请求标志位(点击对应的选项(歌曲,歌单,mv))发生变化方便传参给
        flag:1,//默认为1(歌曲)
      };
    },
    methods: {
      // 分页器
      handleCurrentChange(val){
        // 保存页码
        this.page = val
        // console.log(this.page);//输出当前页码
      },
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
      // 去mv详情页
      toMv(id){
        // 跳转并携带数据即可
        this.$router.push('/mv?m='+id)
      }
    },
    // 侦听器(监听activeIndex的变化切换数据类型(歌曲,歌单,mv),监听page的变化切换数据信息(第n页))
    watch:{
      activeIndex(){// songs歌曲,lists歌单,mv mv
        // 设置默认的limit为10(歌曲请求)
        let limit = 10
        // 设置请求数据类型(歌曲,歌单还是mv)
        let type = 1;
        switch (this.activeIndex) {
          // 歌曲:1
          case 'songs':
            type = 1;
            limit = 10//歌曲请求10条
            this.page = 1//切换数据类型页面归1
            this.flag = 1//分页标志位设为1(歌曲)
            break;

          // 歌单:1000
          case 'lists':
            type = 1000;
            limit = 10//歌单请求10条
            this.page = 1//切换数据类型页面归1
            this.flag = 1000//分页标志位设为1000(歌单)
            break;
          // mv:1004
          case 'mv':
            type = 1004;
            limit = 8//mv请求12条
            this.page = 1//切换数据类型页面归1
            this.flag = 1004//分页标志位设为1004(mv)
            break;
        
          default:
            break;
        }
        axios({
          // 设置请求url
          url: 'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/search' ,
          // 设置请求方式
          method: 'get',
          // 携带数据
          params:{
            // 关键字(输入框)
            keywords:this.$route.query.m,
            // 请求数据类型
            // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
            type,//type:type简化赋值
            // 获取的数据量
            limit,
          }
        }).then(res=>{
            // console.log(res);
            // 获取歌曲
            if(type===1){
              // 请求歌曲
              // 搜索请求回来的歌曲数据存储
              this.searchSongs = res.data.result.songs
              // 计算歌曲时间
              for (let i = 0; i < this.searchSongs.length; i++) {
                let min = parseInt(this.searchSongs[i].duration/1000/60)//时
                let sec = parseInt(this.searchSongs[i].duration/1000%60)//分
                // 设置小于10添零
                if (min<10) {
                  min = '0'+min
                }
                if (sec<10) {
                  sec = '0'+sec
                }
                // console.log(min+':'+sec);
                // 替换计算好的歌曲时间
                this.searchSongs[i].duration = min +':'+sec

                // 保存搜索到的歌曲总数
                this.total = res.data.result.songCount
              }
            }
            // 获取歌单
            else if(type===1000){
              // 请求歌单
              this.searchList=res.data.result.playlists
              // 总数
              this.total=res.data.result.playlistCount
              // 处理播放次数
              for (let i = 0; i < this.searchList.length; i++) {
                if (this.searchList[i].playCount>100000) {
                  this.searchList[i].playCount = parseInt(this.searchList[i].playCount/1000)+'万'
                }
                
              }

            }
            // 获取mv
            else if(type===1004){
              // 请求mv
              // 保存mv数据
              this.mv = res.data.result.mvs
              // 保存总数
              this.total = res.data.result.mvCount
              // 处理数据(播放次数和mv时长)
              for (let i = 0; i < this.mv.length; i++) {
                // 处理时间
                let min = parseInt(this.mv[i].duration/1000/60)//分
                let sec = parseInt(this.mv[i].duration/1000%60)//秒
                if(min<10){
                  min = '0'+ min
                }
                if(sec<10){
                  sec = '0'+ sec
                }
                this.mv[i].duration = min+':'+sec

                // 播放次数
                if(this.mv[i].playCount>100000){
                  this.mv[i].playCount=parseInt(this.mv[i].playCount/10000)+'万'
                }
              }
            }
          })

      },
      page(){//当请求页面发生改变的时候再次向后台请求数据
        // 重新获取数据(搜索得到歌曲数)
        axios({
          // 设置请求url
          url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/search',
          // 设置请求方法
          method:'get',
          // 设置请求params参数
          params:{
            // 关键字(输入框)
            keywords:this.$route.query.m,
            // 请求数据类型
            // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
            type:this.flag,
            // 限制获取的搜索得到歌曲数条数
            limit:10,
            // 根据页码计算
            offset:(this.page-1)*10,
          }
        }).then(res=>{
            // console.log('111',res);
            // 获取歌曲
            if(this.flag===1){
              // 请求歌曲
              // 搜索请求回来的歌曲数据存储
              this.searchSongs = res.data.result.songs
              // 计算歌曲时间
              for (let i = 0; i < this.searchSongs.length; i++) {
                let min = parseInt(this.searchSongs[i].duration/1000/60)//时
                let sec = parseInt(this.searchSongs[i].duration/1000%60)//分
                // 设置小于10添零
                if (min<10) {
                  min = '0'+min
                }
                if (sec<10) {
                  sec = '0'+sec
                }
                // console.log(min+':'+sec);
                // 替换计算好的歌曲时间
                this.searchSongs[i].duration = min +':'+sec

                // 保存搜索到的歌曲总数
                this.total = res.data.result.songCount
              }
            }
            // 获取歌单
            else if(this.flag===1000){
              // 请求歌单
              this.searchList=res.data.result.playlists
              // 总数
              this.total=res.data.result.playlistCount
              // 处理播放次数
              for (let i = 0; i < this.searchList.length; i++) {
                if (this.searchList[i].playCount>100000) {
                  this.searchList[i].playCount = parseInt(this.searchList[i].playCount/1000)+'万'
                }
                
              }

            }
            // 获取mv
            else if(this.flag===1004){
              // console.log('111',res);
              // 请求mv
              // 保存mv数据
              this.mv = res.data.result.mvs
              // 保存总数
              this.total = res.data.result.mvCount
              // 处理数据(播放次数和mv时长)
              for (let i = 0; i < this.mv.length; i++) {
                // 处理时间
                let min = parseInt(this.mv[i].duration/1000/60)//分
                let sec = parseInt(this.mv[i].duration/1000%60)//秒
                if(min<10){
                  min = '0'+ min
                }
                if(sec<10){
                  sec = '0'+ sec
                }
                this.mv[i].duration = min+':'+sec

                // 播放次数
                if(this.mv[i].playCount>100000){
                  this.mv[i].playCount=parseInt(this.mv[i].playCount/10000)+'万'
                }
              }
            }
          })
      }
    },
    created() {
      // 获取数据
      axios({
        // 设置请求url
        url: 'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/search' ,
        // 设置请求方式
        method: 'get',
        // 携带数据
        params:{
          // 关键字(输入框)
          keywords:this.$route.query.m,
          // 请求数据类型
          // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
          type:1,
          // 获取的数据量(设置为10条)
          limit:10
        }
      }).then(res=>{
          // console.log(this.flag);
          // 搜索请求回来的歌曲数据存储
          this.searchSongs = res.data.result.songs
          // 计算歌曲时间
          for (let i = 0; i < this.searchSongs.length; i++) {
            let min = parseInt(this.searchSongs[i].duration/1000/60)//时
            let sec = parseInt(this.searchSongs[i].duration/1000%60)//分
            // 设置小于10添零
            if (min<10) {
              min = '0'+min
            }
            if (sec<10) {
              sec = '0'+sec
            }
            // console.log(min+':'+sec);
            // 替换计算好的歌曲时间
            this.searchSongs[i].duration = min +':'+sec

            // 保存搜索到的歌曲总数
            this.total = res.data.result.songCount
          }
        })
    },
  };
</script>

<style >
.el-icon-circle-plus-outline{
  color: skyblue;
  margin-left: 10px;
}
</style>
