<template>
  <div class="progress-bar">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16;
export default {
  name: "progress-bar",
  emits: ["progress-changing", "progress-changed"],
  props: {
    process: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      offset: 0,
    };
  },
  mounted() {
    // console.log('ref---', this.$refs.progress.style)
    // console.log('el---', this.$el)
  },
  created() {
    this.touch = {}
  },
  methods: {
    onTouchStart(e) {
      // console.log("start---", e);
      // console.log("start---", 111);
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    onTouchMove(e) {
      const delta = e.touches[0].pageX - this.touch.x1
        const tempWidth = this.touch.beginWidth + delta
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
        this.offset = barWidth * progress
        this.$emit('progress-changing', progress)
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    }
  },
  computed: {
    progressStyle() {
      return `width:${this.offset}px`;
    },
    btnStyle() {
      return `transform:translate3d(${this.offset}px,0,0)`;
    },
  },
  watch: {
    process(newProcess) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      this.offset = barWidth * newProcess;
      // console.log("offset---", this.offset);
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    // background: red;
    .progress {
      position: absolute;
      height: 100%;
      width: 100px;
      // background: $color-theme;
      background: red;
    }
    .progress-btn-wrapper {
      // background: blue;
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        // background: pink;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
