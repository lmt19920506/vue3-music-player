<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroll from './use-scroll'
import { ref } from 'vue'
export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'],
  /**
   * better-scroll 使用scroll组件封装的
   * scroll有一个userScroll钩子函数，在里面定义了一个scroll对象，因此要return暴露出去
   * 暴露出去之后，可以通过scroll组件实例可以访问到scroll变量了，通过scroll变量，可以拿到better-scroll实例了
   * 通过这样一层层的关系，拿到better-scroll实例了
   */
  setup(props, {emit}) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)
    return {
      rootRef,
      scroll   // 对应的是use-scroll.js
    }
  }
}
</script>

<style>

</style>