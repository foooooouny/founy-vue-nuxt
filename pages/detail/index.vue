<template>
  <div>
    <Test/>
    <div>detail-1{{ ip }}</div>
    <nuxt-link to="/">go to home</nuxt-link>
    <!-- <textarea id="SimpleMDE"></textarea> -->
    <MdEditor/>
  </div>
</template>

<script>
import Detail from '~/components/detail'
import MdEditor from '~/components/mdEditor'
// import SimpleMDE from 'simplemde'
// import Editor from 'editor'
// import Mock from 'mockjs'

export default {
  head: {
    title: 'my detail',
    meta: [
      { hid: 'description', name: 'description', content: 'About page description' }
    ]
  },
  async asyncData ({ app }) {
    let func = new Promise((resolve, reject) => {
      setTimeout(async () => {
        resolve(await app.axios.$get('http://icanhazip.com'))
      }, 1500)
    })
    const ip = await func
    return { ip }
  },
  components: {
    Test: Detail,
    MdEditor
  },
  mounted () {
    // let simplemde = new SimpleMDE({ element: document.getElementById('SimpleMDE') })
    // let a = axios.get('data')
    // return simplemde
  }
}
</script>
