<template>
  <div>
    <singer-list @select="select" :data="singerListData"></singer-list>
    <!-- <router-view :singer="selectSinger"></router-view> -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import {getSingerList} from '@/service/singer'
import singerList from '@/components/base/index-list/index-list'
// import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant.js'
export default {
  components: {
    singerList
  },
  data() {
    return {
      singerListData: [],
      selectSinger: {}
    }
  },
  async mounted() {
    const result = await getSingerList()
    // console.log('singerList---', result)
    this.singerListData = result.singers
  },
  methods: {
    select(data) {
      console.log('select---', data)
      this.selectSinger = data
      this.setStorage(data)
      this.$router.push(`/singer/${data.mid}`)
    },
    setStorage(val) {
      // storage.session.set(SINGER_KEY, val)
      localStorage.setItem(SINGER_KEY, JSON.stringify(val))
    }
  }
}
</script>

<style>

</style>