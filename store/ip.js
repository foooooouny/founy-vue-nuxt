export const state = () => ({
  ip: 111
})

export const mutations = {
  SET_IP (state, ip) {
    console.log('SET_IP' + ip)
    state.ip = ip
  }
}

export const actions = {
  async SET_IP ({ commit }, { axios }) {
    const ip = await axios.$get('http://icanhazip.com')
    commit('SET_IP', ip)
  }
}

export const getters = {
  GET_IP: state => {
    return state.ip
  }
}
