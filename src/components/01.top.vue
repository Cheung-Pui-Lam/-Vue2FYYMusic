<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <h1 class="Toptitle Titlebox el-icon-headset"> 仿抑云音乐</h1>
      </div>
      <div class="history-wrapper">
        <el-button icon="el-icon-arrow-left" @click="go(-1)" circle></el-button>
        <el-button icon="el-icon-s-home" @click="goHome" circle></el-button>
        <el-button icon="el-icon-arrow-right" @click="go(-1)" circle></el-button>
      </div>
      <el-tooltip class="item" :enterable="false" effect="dark" content="回到博客主页 ! !" placement="left">
        <a href="https://cheung-pui-lam.github.io/" target="blank" class="blog el-icon-toilet-paper"> 肥林の仓库</a>
      </el-tooltip>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <!-- 搜索框 -->
        <input
          type="text"
          autocomplete="off"
          placeholder="搜索"
          class="el-input__inner"
          v-model="inputValue"
          @keyup.enter="toResult"
        />
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'top',
    data() {
      return {
        // 搜索框输入的内容
        inputValue: '',

      }
    },
    methods: {
      // 转到搜索页面
      toResult(){
        if(this.inputValue===''){
          // 提示用户
          this.$message.warning('请输入内容')
        }
        else{
          // 去搜索页并携带输入框的数据
          this.$router.push('/result?m='+this.inputValue)
        }
      },
      // 前进 or 后退
      go(index) {
        window.history.go(index)
      },
      // 回主页
      goHome() {
        if (this.$route.path != '/discovery') {
          this.$router.push('/discovery')
        }
      },
    },
  }
</script>

<style scoped></style>
