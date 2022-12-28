<template>
  <div class="mvs-container">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <!-- 分类切换 地区 -->
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:area=='全部'}" @click="area='全部'">全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='内地'}" @click="area='内地'">内地</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='港台'}" @click="area='港台'">港台</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='欧美'}" @click="area='欧美'">欧美</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='日本'}" @click="area='日本'">日本</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='韩国'}" @click="area='韩国'">韩国</span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:type=='全部'}" @click="type='全部'">全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='官方版'}" @click="type='官方版'">官方版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='原声'}" @click="type='原声'">原声</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='现场版'}" @click="type='现场版'">现场版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='网易出品'}" @click="type='网易出品'">网易出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:order=='上升最快'}" @click="order='上升最快'">上升最快</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order=='最热'}" @click="order='最热'">最热</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order=='最新'}" @click="order='最新'">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div class="item" 
             v-for="(item,index) in mvList" 
             :key="index" 
             @click="toMv(item.id)">
          <div class="img-wrap">
            <!-- mv背景 -->
            <img :src="item.cover" alt="" />
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <!-- mv播放次数 -->
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <!-- mv名字 -->
            <div class="name">{{item.name}}</div>
            <!-- mv歌手名字 -->
            <div class="singer">{{item.artistName}}</div>
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
        :page-size="5"
        :limit="limit"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mvs',
    data() {
      return {
        // 总条数
        total: 20,
        // 页码
        page: 1,
        // 页容量
        limit: 8,
        // 地区
        area:'全部',
        // 类型
        type:'全部',
        // 排序
        order:'上升最快',
        // 获取到的mv数量
        mvList:[],
      };
    },
    methods: {
      getMvList(){
        // 获取数据
        this.$axios.get('/mv/all',{
          // params参数(直接带参数过去等下就不用再在侦听器里面设置了)
          params: {
            area:this.area,
            type:this.type,
            order:this.order,
            // mv获取数量限制
            limit:this.limit,
            // 分页(页数跳转公式:(页数-1)*数据条数)
            offset: (this.page-1)*this.limit,
          },
        }).then(res=>{
          // console.log('111',res);
          this.mvList = res.data.data
          // 处理播放次数
          for (let i = 0; i < this.mvList.length; i++) {
            if (this.mvList[i].playCount>10000) {
              this.mvList[i].playCount = parseInt(this.mvList[i].playCount/10000) + '万'
            } 
          }

          // 保存总条数
          // 接口有问题 第一次请求有count 但是第二次就没有了
          // 设定一个判断,接受第一次的count
          if(res.data.count){
            this.total= res.data.count
          }
        })
      },
      // 去mv详情页
      toMv(id){
        // 跳转并携带数据即可
        this.$router.push('/mv?m='+id)
      },
      // 分页设置(页码改变的回调函数)
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        // 保存页码从新获取数据
        this.page = val
        // 重新获取数据
        this.getMvList()
      }
    },

    // 设置侦听器监听分类选项(分类变动即重新调取数据)
    watch:{
      // 三个分类都要侦听
      area(){
        // 重新获取数据
        this.getMvList()
        // 用户数据改变,返回第一页
        this.page = 1
      },
      type(){
        // 重新获取数据
        this.getMvList()
        // 用户数据改变,返回第一页
        this.page = 1
      },
      order(){
        // 重新获取数据
        this.getMvList()
        // 用户数据改变,返回第一页
        this.page = 1
      },
    }, 
    // 页面一加载就开始向后台请求数据
    created() {
      // 页面加载调用一次获取数据
      this.getMvList()
    },
  };
</script>

<style >

</style>
