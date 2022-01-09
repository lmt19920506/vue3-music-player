import {get} from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get(`/api/getSongsUrl`, {
    mid: songs.map(song => {
      return song.mid
    })
  }).then(result => {
    const map = result.map
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter(song => {
      return song.url.indexOf('vkey') > -1
    })
  })
}

const lyricMap = {}  // 保留歌词
export function getLyric(song) {
  // 当歌曲变化的时候，获取歌词
  if (song.lyric) { // 如果切换到的歌是已经加载过歌词的，直接把返前歌曲的歌词resolve出去，减少http的请求，实现性能优化
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = song[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return get('/api/getLyric', {mid}).then(result => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时iwuf获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}