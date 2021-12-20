<template>
  <div>
    <m-header></m-header>
    <m-tab></m-tab>
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script>
import mHeader from '@/components/header/header'
import mTab from '@/components/tab/tab'
import player from '@/components/base/player/player'
export default {
  components: {
    mHeader, mTab, player
  }
}
</script>

<style>

</style>