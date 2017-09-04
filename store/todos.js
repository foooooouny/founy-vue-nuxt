export const state = () => ({
  list: [
    {
      id: 0,
      text: '测试',
      done: false
    },
    {
      id: 1,
      text: '测试2',
      done: true
    }
  ],
  count: 1
})

export const mutations = {
  add (state, text) {
    state.list.push({
      id: state.count++,
      text,
      done: false
    })
  },
  remove (state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1)
  },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}

export const getters = {
  doneTodos: state => {
    return state.list.filter(todo => todo.done)
  },
  allTodos: state => {
    return state.list
  }
}

export const actions = {
  addTodo ({ commit, getters }, obj) {
    return new Promise((resolve, reject) => {
      commit('add', obj.text)
      resolve(getters.doneTodos)
    })
  },
  removeTodo ({ commit }, { todo }) {
    commit('remove', todo)
  },
  toggleTodo ({ commit, getters }, todo) {
    return new Promise((resolve, reject) => {
      commit('toggle', todo)
      resolve(getters.doneTodos)
    })
  }
}
