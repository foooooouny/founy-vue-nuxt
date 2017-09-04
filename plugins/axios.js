import Vue from 'vue'
import axios from 'axios'

let cAxios = {
  pubCfg: function (url, params, config) {
    let cfg = Object.assign({
      url,
      params,
      withCredentials: true
    }, config)

    return cfg
  },
  getData: function (url, params, config) {
    config = Object.assign({}, config, {
      method: 'get'
    })
    return axios(this.pubCfg(url, params, config))
  },
  postData: function (url, params, config) {
    config = Object.assign({}, config, {
      method: 'post'
    })
    return axios(this.pubCfg(url, params, config))
  }
}

export default cAxios
