<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          :src="url"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <!-- 作者头像 -->
            <img :src="icon" alt="" />
          </div>
          <!-- 作者名字 -->
          <span class="name">{{mvInfo.artistName}}</span>
        </div>
        <div class="mv-info">
          <!-- 作者标题 -->
          <h2 class="title">{{mvInfo.name}}</h2>
          <!-- mv发布时间 -->
          <span class="date">发布：{{mvInfo.publishTime}}</span>
          <!-- mv播放次数 -->
          <span class="number">播放：{{mvInfo.playCount}}次</span>
          <!-- mv简介 -->
          <p class="desc">{{mvInfo.desc}}</p>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">最新评论<span class="number">({{total}})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="(item,index) in comments" :key="index">
            <div class="icon-wrap">
                <!-- 评论者头像 -->
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <!-- 评论区 -->
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}：</span>
                <span class="comment">{{item.content}}</span>
              </div>
              <!-- 回复区(接收回来的数据的beReplied长度不为0显示) -->
              <div class="re-content"  v-if="item.beReplied[0]">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <!-- 评论时间 -->
              <div class="date">{{item.time | LocaleDateString}}</div>
            </div>
          </div>
        </div>
      </div>
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
    
    <!-- 相关mv推荐 -->
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <!-- 页面初始化函数(这里传入相关推荐mv的id) -->
          <div class="item"  
              v-for="(item,index) in simiMvs" 
              :key="index" 
              @click="init(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <!-- 播放次数 -->
                <div class="num">{{item.playCount}}次</div>
              </div>
              <!-- mv时长 -->
              <span class="time">{{item.duration}}</span>
            </div>
            <div class="info-wrap">
              <!-- mv名字 -->
              <div class="name">{{item.name}}</div>
              <!-- 歌手 -->
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 首先导入axios
  import axios from 'axios'

  export default {
    name: 'mv',
    data() {
      return {
        // mvid
        id:'',
        // 总条数
        total: 20,
        // 页码
        page: 1,
        // 页容量
        limit: 10,
        // mv地址
        url:'',
        // 推荐mv
        simiMvs:[],
        // mv信息
        mvInfo:{},
        // mv歌手头像
        icon:'',
        // 评论信息
        comments:[]
      };
    },
    methods: {
      // 分页器设置
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.page = val//获取当前页数
        // 重新获取数据(评论)
        axios({
          // 设置请求url
          url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/comment/mv',
          // 设置请求方法
          method:'get',
          // 设置请求params参数
          params:{
            // 每次点击分页器获取到的评论是通过携带url上的id值即路由url上的query参数m(主要是推荐mv的点击)
            // 默认这里的url是外页传送过来的id,所以想要实现评论区数据的动态绑定,就需要:当点击相关推荐mv的时候,通过axios
            // 将路由url上的query参数(id)转为对应的相关推荐mv的id
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
      // 获取MV播放地址
      getMvurl(id){
        axios({
          // 设置请求url
          url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/mv/url',
          // 设置请求方法
          method:'get',
          // 设置请求参数
          params:{
            // 获取页面传过来的mv的id
            id
          }
        }).then(res=>{
          // console.log(res);//输出获取结果
          // 将获取到的mv地址赋给url
          this.url = res.data.data.url
        })
      },
      // 获取相关推荐mv
      getSimiMvs(id){
        axios({
          // 设置请求url
          url:`https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/simi/mv?mvid=${id}`,
          // 设置请求方法
          method:'get',
        }).then(res=>{
            // console.log('111',res);//输出获取结果
            // 将获取到的相关mv赋给simiMvs
            this.simiMvs = res.data.mvs
            // 点击相关推荐获取到的mvid赋值给路由上的m,这样就方便后续评论的获取
            this.$route.query.m = id
            // 计算推荐mv时间和播放次数
            for (let i = 0; i < this.simiMvs.length; i++) {
                  let min = parseInt(this.simiMvs[i].duration/1000/60)//时
                  let sec = parseInt(this.simiMvs[i].duration/1000%60)//分
                  // 设置小于10添零
                  if (min<10) {
                    min = '0'+min
                  }
                  if (sec<10) {
                    sec = '0'+sec
                  }
                  // console.log(min+':'+sec);
                  // 替换计算好的歌曲时间
                  this.simiMvs[i].duration = min +':'+sec

                  // 处理播放次数(大于100000给万做后缀)
                  if (this.simiMvs[i].playCount>10000) {
                    this.simiMvs[i].playCount = parseInt(this.simiMvs[i].playCount/10000) + '万'
                  } 
                }
          }) 
      },
      // 获取mv的信息
      getMvInfo(id){
        axios({
          // 设置请求url
          url:`https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/mv/detail?mvid=${id}`,
          // 设置请求方法
          method:'get',
          // 设置请求参数
          // params:{
          //   // 获取页面传过来的mv的id(发送给后端推出相关mv)
          //   mvid: this.id
          // }
        }).then(res=>{
            // console.log('111',res);//输出获取结果
            // 将获取到的相关mv信息赋给mvInfo
            this.mvInfo = res.data.data
            // 获取歌手信息(页面一挂载)
            axios({
              // 设置请求url
              url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/artists',
              // 设置请求方法
              method:'get',
              // 设置请求参数
              params:{
                // 将对应的mv歌手id发送过去获取歌手数据
                id: this.mvInfo.artists[0].id
              }
            }).then(res=>{
              // 输出获取结果
              // console.log('111',res);
              // 歌手封面信息
              this.icon = res.data.artist.picUrl
            })
          })        
      },
      // 获取评论信息
      getComments(id){
        axios({
          // 设置请求url
          url:'https://netease-cloud-music-api-git-master-cheung-pui-lam.vercel.app/comment/mv',
          // 设置请求方法
          method:'get',
          // 设置请求参数
          params:{
            // 获取页面传过来的mv的id
            id,
            // 设置请求评论个数
            limit:10,
            offset:0
          }
        }) .then(res=>{
          // console.log('111',res);//输出评论数据
          // 保存请求过来的数据(评论)
          this.comments = res.data.comments
          // 保存评论的个数
          this.total = res.data.total
        })
      },
      // 重新解析渲染mv详情页(用户点击了相关推荐的mv)
      init(id){
        // 用户点击了相关推荐重新解析mv详情页的路由页面(一切数据重新获取)
        this.getMvurl(id)
        this.getSimiMvs(id)
        this.getMvInfo(id)
        this.getComments(id)
      }
    },
    // 页面一挂载开始向后台调取数据
    created() {
      // 首先将id指定为路由上传过来的query参数
      this.id = this.$route.query.m//页面一挂载首先获取的是url传过来的id
      // 调用页面初始化函数解析渲染页面
      this.init(this.id)
    },
    // 使用监听器来监听推荐mv的id,mvid一变评论区页数归一
    watch:{
      url(){
        // 播放mv的url一变评论区页数归1
        this.page = 1
      }
    }
  };
</script>

<style></style>
