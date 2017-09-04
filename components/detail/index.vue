<template>
  <div>
    {{ message }}
    {{ getIP }}
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <!-- <input/> -->
        <span :class="{ done: todo.done }" @click="toggle(todo)">{{ todo.text }}</span>
      </li>
      <li>
        <input type="text" class="input is-success" placeholder="add todo item" @keyup.enter="addTodo"/>
      </li>
      <li>
        <span @click="updateIP">GET_IP</span>
      </li>
      <a class="button is-primary is-large modal-button" data-target="modal-bis" @click="modalToggle">Launch image modal</a>
      <div :class="[ modalVisible ? 'is-active modal fade' : 'modal fade', modalIn || 'in' ]">
        <div class="modal-background"></div>
        <div class="modal-content">
          <p class="image is-4by3">
            <img src="http://bulma.io/images/placeholders/1280x960.png" alt="">
          </p>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="modalToggle"></button>
      </div>
    </ul>
    <el-progress type="circle" :percentage="progressD"></el-progress>
    <div id="MediumEditor"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    message: 'detail---------',
    modalVisible: false,
    modalIn: true
  }),
  computed: {
    todos () {
      return this.$store.state.todos.list
    },
    ...mapGetters('todos', {
      doneT: 'doneTodos',
      allT: 'allTodos'
    }),
    ...mapGetters('ip', {
      getIP: 'GET_IP'
    }),
    progressD () {
      return ~~(this.doneT.length / this.allT.length * 100)
    }
  },
  methods: {
    addTodo (e) {
      console.log(this.$store)
      this.$store.dispatch('todos/addTodo', { text: e.target.value }).then(d => {
        console.log(d)
        e.target.value = ''
      })
    },
    delTodo (e) {
      this.$store.dispatch('todos/removeTodo', e.target)
    },
    ...mapActions({
      toggle: 'todos/toggleTodo'
    }),
    updateIP () {
      this.$store.dispatch('ip/SET_IP', { axios: this.$axios })
    },
    modalToggle () {
      // console.log(this.modalVisible)
      this.modalVisible = !this.modalVisible
      setTimeout(() => {
        this.modalIn = !this.modalIn
      }, 1)
    }
    // ...mapActions('todos', {
    //   toggle: 'toggleTodo'
    // })
  }
}
</script>

<style>
/* @import 'bulma/sass/grid/_all.sass'; */

.done {
  text-decoration: line-through;
}
.fade {
  opacity: 0;
  transition: all .3s ease-in-out;
}
.fade.in {
  opacity: 1;
}
</style>
