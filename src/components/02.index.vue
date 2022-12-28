<template>
  <div class="index-container">
    <!-- 导航区域 -->
    <div class="nav" >
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 主体区域 -->
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 播放栏 -->
    <div class="player">
      <!-- <audio :src='musicUrl' controls></audio> -->
      <aplayer 
        :audio="audio" 
        :lrcType="1" 
        fixed
        ref="aplayer"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        // 初始播放列表为audioInfoFirst
        audio:this.$store.state.audioInfoFirst
      };
    },
    mounted() {
      this.init()
      this.$Bus.$on('switch', this.switch)
    },
    methods: {
      // 初始化
      init() {
        // 创建清空按钮
        this.createClearBtn()
      },
      // 切换到指定索引歌曲
      switch() {
        console.log('切换')
        // 点击音乐播放按钮过后替换掉原来的播放列表
        this.audio = this.$store.state.audioInfo
        setTimeout(() => {
          let ap = this.$refs.aplayer
          // 播放列表的第一首歌
          ap.switch(0)
        }, 1)
      },
      // 创建清空按钮
      createClearBtn() {
        let deleteList = document.createElement('div')
        deleteList.title = '清空播放列表'
        deleteList.className = 'clearMusic el-icon-delete'
        let control = document.querySelector('.aplayer-time')
        control.appendChild(deleteList)
        deleteList.addEventListener('click', this.clear)
      },
      // 清空播放列表
      clear() {
        this.$store.commit('clear')
        this.$message.success('清空播放列表成功！')
        this.audio = this.$store.state.audioInfoFirst
      },
    },
  };
</script>

<style>

</style>
