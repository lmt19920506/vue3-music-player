import axios from 'axios'
const basUrl = '/'
const ERR_OK = 0
axios.defaults.baseURL = basUrl

export function get(url, params) {
  return axios.get(url, {
    params
  }).then(res => {
    const serverData = res.data
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch(e => {
    console.log('get---err:', e)
  })
}