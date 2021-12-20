<template>
  <div class="singer-detail">
    <!-- <music-list></music-list> -->
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
// import MusicList from '@/components/base/music-list/music-list'
export default {
  components: {
    // MusicList
  },
  props: {
    singer: Object
  },
  async created() {
    const result = await getSingerDetail(this.singer)
    const songs = await processSongs(result.songs)
    console.log('singer detail query---', result)
    console.log('songs query---', songs)
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
    // background: $color-background;
  }
</style>