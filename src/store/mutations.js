const mutations = {
  // 修改播放状态
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 设置顺序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 设置播放列表
  setPlayList(state, list) {
    state.playList = list
  },
  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 是指是否全屏播放
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  // 收藏
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  // 给歌曲添加歌词
  addSongLyric(state, {song, lyric}) {
    state.sequenceList.map(item => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  }
}

export default mutations