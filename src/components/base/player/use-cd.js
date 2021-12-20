import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  // 播放状态
  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })
  /**
   * 拿到2个ref后，观测playing状态变化，同步旋转角度
   */
  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransForm(cdRef.value, cdImageRef.value)
    }
  })
 /**
  * cd开始时一个角度，然后点播放的时候，cd一直保持这个播放角度，旋转的一直时里面的image
  * 要去做同步的时候，内层是相对于外层去旋转的，也就是说外层有一个初始角度，getComputedStyle动态获取内层旋转角度的时候，实际是相对于外层的一个旋转
  * 外层本来就有一个初始角度了，那么我们需要把这2个角度叠加在一起才可以
  * 最终我们给外层设置transform，它是一开始0°的时候，它有个角度，image相对于外层旋转了角度，
  * 因此要把2者的角度叠加起来，然后再赋值给外层容器。
  * 这样才能保证2者在样式和感官上是一致的。所以需要角度叠加的过程
  */
  function syncTransForm(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransForm = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransForm : innerTransForm.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}