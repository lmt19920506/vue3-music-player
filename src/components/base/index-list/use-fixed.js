import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeights = ref([])   // 2.把每一个组的列表的高度区间记录下来，用一个数组
  console.log('ref---', groupRef.value)
  const scrollY = ref(0)  // 纵向滚动值
  const currentIndex = ref(0)   // 当前组的索引
  const distance = ref(0)  // 当前组得下一个组离容器顶部得距离
  const TITLE_HEIGHT = 30
  
  watch(() => props.data, async () => {
    // dom变化是在nexttick之后，因此要等一个nexttick
    // 在nexttick去计算，就可以正确获取到高度
    await nextTick()
    // 
    calculate()  
  })

  watch(scrollY, (newY) => {   // 监听y值，其实就是监听滚动
    const listHeightsVal = listHeights.value
    /*
      为什么length -1 ？ 是因为listHeightsVal就是这个区间值，是要比list大1的，
      刚开始push了一个0，所以说长度是比它大一个的，
      并且在内部要去顶部和底部做一个对比
    */
    for (let i = 0; i < listHeightsVal.length - 1; i++) {    
      const heightTop = listHeightsVal[i]  // 顶部的值
      const heightBottom = listHeightsVal[i + 1]  // 底部的值
      // console.log('heightBottom---', heightBottom, newY, heightBottom - newY)
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i // i就是当前组的索引
        distance.value = heightBottom - newY
      }
    }
  })
  /**
   * fixedTitle逻辑：
   * 首先，获取listHeights-左侧列表区间高度，
   * 然后，再去监听滚动事件，拿到实时滚动的位置，
   * 再去watch滚动位置，当它实时滚动的时候，判断滚动的位置，
   * y值落在哪个区间内，落在哪个区间，说明就是当前区间，拿到对应的索引，
   * 通过索引，可以求得当前组是什么，对应的title是什么
   */

  const fixedTitle = computed(() => {
    if (scrollY.value <= 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  function calculate() {
    // 区间高度是一个累计的值的一个数组
    console.log(111)
    // 1.获取每个groupRef得每一个children，即每个分类项目-->li组成得dom的数组
    const list = groupRef.value.children
    console.log('list-children---', list)
    const listHeightsVal = listHeights.value
    console.log('listHeightsVal---', listHeightsVal)
    let height = 0   // 第一个组的高度从0开始
    listHeightsVal.length = 0 // 初始化操作  
    // 第一个组的高度为0
    listHeightsVal.push(height)
    for (let i = 0; i < list.length; i++) {
      // console.log('clientHeight---', list[i].clientHeight)
      height += list[i].clientHeight   // 累加，滚动的值就是整个列表的高度, 滚动区间的值从0到滚动的最大的高度，是一个不断递增的值
      // console.log('height---++', height)
      listHeightsVal.push(height)
    }
    // console.log('listHeightsVal--end---', listHeightsVal)
  }
  // 什么时候调用calculate，去计算呢，
  // 是当数据变化的时候，dom就会发生变化
  // 那数据是怎么来的呢，是props传进来的，因此在外面调用useFixed时，把props传进来
  // 然后去监听它，因此在watch里面写


  // 要知道实时滚动的y值是多少
  // 实时滚动要借助scroll滚动事件
  function onScroll (pos) {
    // console.log('onscroll---', pos)
    scrollY.value = -pos.y
  }
  
  /**
   * 实现标题顶的效果，实际就是固定标题向上有个偏移量
   * 偏移量有多少呢？取决于下面这个组顶部距离容器顶部的距离
   * 距离足够小，就向上偏移
   * 小到比层的高度还要小的时候，就需要向上偏移的距离 - 层differ得值，就是它得偏移量
   * 怎么求得距离呢？每个组都有个区间，当前取得底部就是下个组得顶部
   * 因此在滚动过程中，拿到当前组的底部的值减去滚动的y值，求得距离，然后再判断距离是否满足条件
   */

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}