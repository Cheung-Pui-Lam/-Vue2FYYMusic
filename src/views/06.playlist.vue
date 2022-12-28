<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 歌单封面 -->
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <!-- 歌单名字 -->
        <p class="title">{{playlist.name}}</p>
        <!-- 解决方法:使用v-if判断是否存在playlist.creator -->
        <div class="author-wrap" v-if="playlist.creator">
          <!-- 作者头像(存在问题,控制台报错但是能够渲染画面) -->
          <img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
          <span class="name">{{playlist.creator.nickname}}</span>
          <span class="time">{{playlist.createTime | LocaleDateString}} 创建</span>
        </div>
        <div class="play-wrap">
          <!-- 播放全部按钮(绑定播放每一个tracks的第一首歌的id) -->
          <span class="iconfont icon-circle-play"  
                @click="playMusic(tracks[0].id)"
                ></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <!-- 分类标签 -->
          <ul>
            <li v-for="(item,index) in playlist.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <!-- 简介 -->
          <span class="desc"
            >{{playlist.description}}</span
          >
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <!-- 绑定track每一个歌单的歌曲列表 -->
            <tr class="el-table__row"
                v-for="(item,index) in tracks"
                :key="index"
                @dblclick="playMusic(item.id)"
            >
              <td>{{index+1}}</td>
              <td>
                <div class="img-wrap">
                  <!-- 歌曲封面 -->
                  <img :src="item.al.picUrl" alt="" />
                  <!-- 点击播放(将歌曲id发过去) -->
                  <span class="iconfont icon-play" @click="playMusic(item.id,true)"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 歌曲名字 -->
                    <span>{{item.name}}</span>
                    <!-- 添加到歌单按钮 -->
                    <el-tooltip class="item" content="添加到播放列表" :enterable="false" placement="bottom">
                      <span @click="playMusic(item.id,false)" class="el-icon-circle-plus-outline"></span>
                    </el-tooltip>
                  </div>
                  <!-- 歌曲副标题 -->
                  <span>{{item.alia[0]}}</span>
                </div>
              </td>
              <!-- 歌手 -->
              <td>{{item.ar[0].name}}</td>
              <!-- 专辑的名字 -->
              <td>{{item.al.name}}</td>
              <!-- 歌曲时长 -->
              <td>{{item.dt}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="'评论('+ (total) +')'" name="2">
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">({{total}})</span></p>
          <div class="comments-wrap">
            <!-- 使用v-for获取评论信息 -->
            <div class="item" v-for="(item,index) in comments" :key="index">
              <div class="icon-wrap">
                <!-- 评论者头像 -->
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <!-- 评论者昵称  -->
                  <span class="name">{{item.user.nickname}}：</span>
                  <!-- 评论内容 -->
                  <span class="comment">{{item.content}}</span>
                </div>
                <!-- 回复区域(接收回来的数据的beReplied长度不为0显示) -->
                <div class="re-content" v-if="item.beReplied[0]">
                  <!-- 回复者名字 -->
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <!-- 回复者的内容 -->
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">{{item.time | LocaleDateString}}</div>
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
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  // 首先导入axios
  import axios from 'axios'
  export default {
    name: 'playlist',
    data() {
      return {
        activeIndex: '1',
        // 总条数
        total: 0,
        // 页码
        page: 1,
        // 歌单的详情数据
        playlist:{},
        // 歌曲列表
        tracks:[],
        // 评论(评论包括回复)
        comments:[],
        
      };
    },
    methods: {
      // 分页
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        // 保存页码
        this.page = val
        // 重新获取数据(评论)
        axios({
          // 设置请求url
          url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/comment/playlist',
          // 设置请求方法
          method:'get',
          // 设置请求params参数
          params:{
            // 歌单id
            id:this.$route.query.m,
            // 限制获取的评论条数
            limit:10,
            // 根据页码计算
            offset:(this.page-1)*10,
          }
        }).then(res=>{
            // console.log('111',res);
            // 保存请求过来的数据(评论)
            this.comments = res.data.comments
            // 保存评论的个数
            this.total = res.data.total
          })
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
    },
    created() {
      // 获取歌单详情
      axios({
        // 设置请求url
        url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/playlist/detail',
        // 设置请求方法
        method:'get',
        // params参数
        params: {
          // 接受发送过来的id
          id:this.$route.query.m
        },
      }).then(res=>{
        // console.log(res);
        // 获取通过id发送过来的歌单
        this.playlist = res.data.playlist
        // 绑定歌单的歌曲列表（后台每次都是返回10条歌曲）
        this.tracks = res.data.playlist.tracks
        // 修改歌曲时长
        for (let i = 0; i < this.tracks.length; i++) {
          let min = parseInt(this.tracks[i].dt/1000/60)//时
            let sec = parseInt(this.tracks[i].dt/1000%60)//分
            // 设置小于10添零
            if (min<10) {
              min = '0'+min
            }
            if (sec<10) {
              sec = '0'+sec
            }
            // console.log(min+':'+sec);
            // 替换计算好的歌曲时间
            this.tracks[i].dt = min +':'+sec
          
        }
      })

      // 获取评论
      axios({
        // 设置请求url
        url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/comment/playlist',
        // 设置请求方法
        method:'get',
        // 设置请求params参数
        params:{
          // 歌单id
          id:this.$route.query.m,
          // 限制获取的评论条数
          limit:10,
          offset:0,
        }
      }).then(res=>{
        // console.log('111',res);
        // 保存请求过来的数据(评论)
        this.comments = res.data.comments
        // 保存评论的个数
        this.total = res.data.total
      })
    },
  };
</script>

<style >

</style>
