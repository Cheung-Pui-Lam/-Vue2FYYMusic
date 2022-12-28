import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 真正的音乐播放列表(怎正存放音乐的地方)
    audioInfo: [ ],
    // 默认播放列表信息,默认无播放(当点击音乐播放时会替换成audioInfo)
    audioInfoFirst: [
        {
          name: '暂无歌曲播放',
          artist: '未知',
          url: " ",
          volume: 0.7,
          // 歌曲封面
          cover:' ',
          // 歌词
          lrc: ' ',
        },   
    ]
  },
  mutations: {
    // 更新到音乐列表
    // 追加到最后面
    updateAudioInfo(state, payload) {
      // 过滤重复的
      state.audioInfo = state.audioInfo.filter(item => item.id != payload.id)
      state.audioInfo.push(payload)
      // console.log('追加成功!');
    },
    // 插入到最前面
    insertAudioInfo(state, payload) {
      // 过滤重复的
      state.audioInfo = state.audioInfo.filter(item => item.id != payload.id)
      // 插入到前面
      state.audioInfo.unshift(payload)
      // console.log('成功插入到播放列表!');
    },
    // 清空播放列表
    clear(state) {
      state.audioInfo = []
    },
  },
  // 在Actions 中不能直接修改 state中的数据，要通过 mutations修改。
  actions: {
    // 获取歌曲信息
    getAudioInfo(context, payload) {
      console.log('payload: ', payload)

      // 创建暂存列表
      const result = {}

      Promise.all([//全为成功走res,有一个失败走reason
        // 获取歌曲的url
        context.dispatch('getMusicUrl', payload.id),
        // 获取歌曲的基本信息
        context.dispatch('getMusicInfo', payload.id),
        // 获取歌曲的歌词
        context.dispatch('getMusicLyric', payload.id),
      ]).then(
        res => {
          console.log('res: ', res)
          // id 是用来区分音频的唯一标识
          // 判断获取到的音乐url是否为null(播放权限)
          if (res[0].data.data[0].url !== null) {
            result.id = payload.id
            // 音乐地址
            result.url = res[0].data.data[0].url
            // 音乐标题
            result.name = res[1].data.songs[0].name
            // 艺术家
            result.artist = res[1].data.songs[0].ar[0].name
            // 封面
            result.cover = res[1].data.songs[0].al.picUrl
            // 歌词
            result.lrc = res[2].data.lrc ? res[2].data.lrc.lyric : null

            // 接收标志位isInsert,判断是插入前面还是追加到后面
            if(payload.isInsert) {
              // 插入到最前面
              context.commit('insertAudioInfo', result)
            } else {
              // 追加到后面
              context.commit('updateAudioInfo', result)
            }
          }
        },
        reason => {
          console.log('信息获取失败!,失败结果: ', reason)
        }
      )
    },
    // 获取歌曲Url
    getMusicUrl(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/song/url?id=${id}`).then(
          res => {
            resolve(res)
          },
          reason => {
            reject(reason)
          }
        )
      })
    },
    // 获取歌曲信息
    getMusicInfo(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/song/detail?ids=${id}`).then(
          res => {
            resolve(res)
          },
          reason => {
            reject(reason)
          }
        )
      })
    },
    // 获取歌词
    getMusicLyric(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/lyric?id=${id}`).then(
          res => {
            resolve(res)
          },
          reason => {
            reject(reason)
          }
        )
      })
    },
  },
})
