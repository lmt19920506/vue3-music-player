<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goback">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="middle">
        <div class="middle-l" style="display: none">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img
                :src="currentSong.pic"
                :class="cdCls"
                class="image"
                ref="cdImageRef"
              />
            </div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricScrollRef">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{ current: currentLineNum === index }"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num"
              >
                {{line.txt}}
              </p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :process="process"></progress-bar>
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <!-- <i class="icon-pause"></i> -->
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i
              class="icon"
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCd from "./use-cd";
import useLyric from "./use-lyric";
import progressBar from "./progress-bar";
import Scroll from '@/components/base/scroll/scroll'
import { formatTime } from "@/assets/js/util";
export default {
  name: "player",
  components: {
    progressBar,
    Scroll
  },
  setup() {
    const audioRef = ref(null);
    const songReady = ref(null);
    const currentTime = ref(0); // 歌曲播放到的当前时间

    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    // 先定义playing播放状态，然后在根据playing的状态定义playIcon
    const playing = computed(() => store.state.playing);
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });
    // 当前播放歌曲的下标
    const currentIndex = computed(() => store.state.currentIndex);
    // 歌曲的进度
    const process = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });
    const { modeIcon, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();
    const { cdCls, cdRef, cdImageRef } = useCd();
    const { currentLyric, currentLineNum, playLyric, stopLyric, lyricListRef, lyricScrollRef } = useLyric({songReady, currentTime});
    console.log('currentLyric---', currentLyric.lines)
    // console.log(111)
    // 歌曲列表
    const playList = computed(() => store.state.playList);
    // disable样式
    const disableCls = computed(() => {
      return songReady.value ? "" : "disable";
    });
    
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      currentTime.value = 0; // 歌曲切换的时候，时间变为0
      songReady.value = false;
      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      // console.log("audioel---", audioEl);
    });
    // 根据播放状态，暂停/开始音乐
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause();
        stopLyric()
      }
    });

    function goback() {
      store.commit("setFullScreen", false);
    }
    // 点击开始/暂停，切换图标
    function togglePlay() {
      if (!songReady.value) {
        return;
      }
      store.commit("setPlayingState", !playing.value);
    }
    // audio的原生pause事件，比如关闭笔记本，音乐暂停，因此就要把playing播放状态改为false
    function pause() {
      store.commit("setPlayingState", false);
    }
    // 上一首
    function prev() {
      // 1.下标减1， 然后根据下标，到整个歌曲列表中取值
      // 2.如果本来是第一首歌，点击上一首，即为-1，到了最后一首
      // 3.暂停状态下，点击上一首，播放歌曲
      // 注意：如果只有一首歌的情况下，点击上一首，当前歌曲应该从0开始播放;
      //       列表没有歌曲，啥也不做
      const list = playList.value;
      let index = currentIndex.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        index = currentIndex.value - 1;
        if (index === -1) {
          index = list.length - 1;
        }
        store.commit("setCurrentIndex", index);
      }
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
    }
    // 下一首
    function next() {
      const list = playList.value;
      let index = currentIndex.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        index = currentIndex.value + 1;
        if (index === list.length) {
          index = 0;
        }
        store.commit("setCurrentIndex", index);
      }
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
    }
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0; // 从头播放
      audioEl.play();
    }
    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
      playLyric()
    }
    function error() {
      // 歌曲出错的时候，把songReady设为true，保证歌曲可以上下切换，不至于卡在那里
      songReady.value = true;
    }
    function updateTime(e) {
      // console.log("update time---", e.target.currentTime);
      currentTime.value = e.target.currentTime;
    }
    return {
      fullScreen,
      currentSong,
      disableCls,
      process,
      audioRef,
      playIcon,
      modeIcon,
      currentTime,
      goback,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      updateTime,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      formatTime,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      // lyric
      currentLineNum,
      currentLyric,
      lyricListRef,
      lyricScrollRef
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
