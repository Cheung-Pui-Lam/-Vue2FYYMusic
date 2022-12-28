// 设置全局方法

// 1.播放(向外暴露)
export function playMusic(id){
    console.log(id);
    this.$axios.get('/song/url',{
      params:{
        // 对象的简写形式
        id
      }            
    }).then(res=>{
      console.log('111',res);
      let url = res.data.data[0].url
      const songid = res.data.data[0].id
      // 判断获取到的歌曲url是否为null
      if(url !== null){
        this.$axios.get('/song/detail',{
          params:{
            // 对象的简写形式
            ids:songid
          }
          }).then(res=>{
            console.log('通过歌曲id获取到的歌曲信息',res);
            this.$parent.audio.name = res.data.songs[0].name //歌曲名字
            this.$parent.audio.artist = res.data.songs[0].ar[0].name //歌手名字
            this.$parent.audio.cover = res.data.songs[0].al.picUrl
          }) 
      }else{
        // 提示暂时无音源!
        this.$notify.error({
          title: '播放失败!',
          message: '不好意思!当前歌曲暂无音源!'
        });
      }          
      // 通过$parent获取到播放组件(存在index父组件当中)
      // console.log(this.$parent.musicUrl);
      // 将后端获取过来的音乐url赋值给index父组件实现音乐的url切换(播放)
      this.$parent.musicUrl = url
      this.$parent.audio.url = url
    })
  }