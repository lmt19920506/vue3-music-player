import { PLAY_MODE } from '@/assets/js/constant.js'
import { shuffle } from '@/assets/js/util'

// 顺序播放
export function selectPlay({commit}, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

// 随机播放
export function randomPlay({commit}, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

// 切换播放模式
export function changeMode({commit, state, getters}, mode) {
  const currentId = getters.currentSong.id  // 获取当前播放歌曲的id，是为了防止模式切换到水机播放的状态下，歌曲正在播的歌曲还是在切换之前的正在播放的歌曲
  if (mode === PLAY_MODE.random) {
    // 如果是随机播放，就把之前的顺序播放列表的歌曲打乱顺序
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  const index = state.playList.findIndex(song => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}