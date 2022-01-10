import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  console.log('songReady---', songReady)
  console.log('currentTime---', currentTime)
  const currentLyric = ref(null)
  const currentLineNum = ref(12)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {song: newSong, lyric})
    // 获取歌词是个异步过程，如果在获取过程中切换了歌曲，
    // 那当前歌曲处理歌词的函数处理就没意义了，因此这里做一个判断
    if (currentSong.value.lyric !== lyric) {
      return 
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    // console.log('currentLyric---', currentLyric.value)
    // console.log('currentLineNum---', currentLineNum.value)
    if (songReady.value) {
      playLyric()
    }
  })

  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({lineNum}) {
    // console.log('lineNum---', lineNum)
    // console.log('txt---', txt)
    currentLineNum.value = lineNum

    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    console.log('listEl---', listEl)
    if(!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  return {
    currentLineNum,
    currentLyric,
    playLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric
  }
}