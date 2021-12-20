import { computed, ref } from 'vue'
export default function useShortcut(props, groupRef) {
  const scrollRef = ref(null)
  const ANCHOR_HEIGHT = 18  // 导航栏每个锚点的高度
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })
  const touch = {}

  function onShortcutTouchStart(e) {
    console.log('e---', e)
    /**
     * 通过设置dataset设置data-index，拿到点击得索引
     * 拿到索引后，要知道对应得dom是什么，拿到dom之后，可以利用better-scroll
     * better-scroll内部有个api：scrollToElement方法，去滚动到对应得位置
     * 在前面use-fixed做固定title的时候，拿到groupRef，就是左侧容器对应的dom，
     * 可以根据children对应的index对应滚动到第几项，具体滚动到第几组
     * 这里需要把groupRef传进来
     * 
     */
    console.log('touch---', e.touches[0].pageY)
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    /**
     * 在前面，根据索引，求得位置，然后滚动到具体位置
     * 那怎么在touch move中拿到这个索引呢
     * 因为在touch start的时候，会有一个初始的索引值，并且可以记录touch start的时候，手指触碰的纵坐标
     * 然后在touch move的时候，也可以实时拿到手指触碰的纵坐标
     * 然后touch move的纵坐标减去touch start的纵坐标，求得一个差，这个差除以每个锚点的高度，这样就知道偏移了多少下标
     * 然后根据初始的索引加上偏移的索引，就可以求得touch move的索引
     */
    /**
     * 首先，记录touch开始和移动的纵坐标，然后做差：在外面定义一个变量touch来保留
     * 1.用touch定义一个对象
     * 2.在触碰点击的时候，因此在onShortcutTouchStart函数中，用touch的时候记录一下：touch.y1 = e.touches[0].pageY
     * 3.move的时候，记录手指在导航栏上的纵坐标：touch.y2 = e.touches[0].pageY
     * 4.做差 (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
     * 5.最终索引 = 开始索引 + 偏移索引(那怎么拿到一开始的索引呢？把anchorIndex保存到touch这个对象里：touch.anchorIndex = anchorIndex,这种写法是一个闭包技巧) 
     * 6.算出最终索引: const anchorIndex = touch.anchorIndex + delta
     */
    console.log('move---', e.touches[0].pageY)
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0   // 或0，是正数向下取整的简略写法 === math.floor
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]  // 对应滚动到的组
    // scrollRef.value对应的是better-scroll封装的组件实例
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}