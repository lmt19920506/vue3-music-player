import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric() {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)
  watch(currentSong, async (newSong) => {
    console.log('newSong---', newSong)
    if (!newSong.url || !newSong.id) {
      return
    }
    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {song: newSong, lyric})
    // 获取歌词是个异步过程，如果在获取过程中切换了歌曲，
    // 那当前歌曲处理歌词的函数处理就没意义了，因此这里做一个判断
    if (currentSong.value.lyric !== lyric) {
      return 
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    console.log('currentLyric---', currentLyric.value)
  })

  function handleLyric({lineNum}) {
    console.log('lineNum---', lineNum)
    currentLineNum.value = lineNum
  }
  return {
    currentLineNum,
    currentLyric
  }
}