import { PLAY_MODE, FAVORITE_KEY } from '@/assets/js/constant.js'
import { load } from '@/assets/js/array-store'

const state = {
  sequenceList: [],   // 顺序播放列表
  playList: [],   // 真实播放列表
  playing: false,  // 是否正在播放
  playMode: PLAY_MODE.sequence,   // 默认顺序播放
  currentIndex: 0,  // 当前播放索引，
  fullScreen: false,  // 是否全屏播放
  favoriteList: load(FAVORITE_KEY)  // 收藏列表
}

export default state