<template>
  <div>
    <div v-for="item in cArr" :key="item.id">
      <Chain :chainObj="item"/>
    </div>
    <Editor/>
  </div>
</template>

<script>
import '~/assets/sass/chain.scss'
import '~/assets/wangeditor.scss'
import '~/assets/font/icomoon.woff'
import Cchain from '~/components/cchain/chain.vue'
import Editor from '~/components/wangeditor'

export default {
  head: {
    title: 'my detail',
    meta: [
      { hid: 'description', name: 'description', content: 'About page description' }
    ]
  },
  components: {
    Chain: Cchain,
    Editor
  },
  async asyncData ({ app }) {
    const func = new Promise((resolve, reject) => {
      setTimeout(async () => {
        resolve(await app.axios.$get('http://icanhazip.com?id=1000'))
      }, 500)
    })
    let cArr = await func
    return { cArr }
  }
}
</script>
