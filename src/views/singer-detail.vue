<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/base/music-list/music-list'
// import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant.js'
export default {
  components: {
    MusicList
  },
  props: {
    singer: Object
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    computedSinger() {
      let ret = null
      if (!JSON.stringify(this.singer === '{}')) {
        console.log('this.singer---', this.singer)
        ret = this.singer
      } else {
        // const cachedSinger = storage.session.get(SINGER_KEY)
        const cachedSinger = JSON.parse(localStorage.getItem(SINGER_KEY))
        console.log('cachedSinger111---', cachedSinger)
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      console.log('computedSinger222---', this.computedSinger)
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      console.log('computedSinger333---', this.computedSinger)
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created() {
    const singer = this.computedSinger
    const result = await getSingerDetail(singer)
    console.log('song-list---', result.songs)
    this.songs = await processSongs(result.songs)
    console.log('singer detail query---', result)
    console.log('songs query---', this.songs)
  },
}
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>