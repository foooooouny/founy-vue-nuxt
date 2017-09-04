<template>
  <div>
     <component :is="isComponent()" :chainObj="chainObj">{{ chainObj }}</component>
    <!-- <MyChain :chainObj="chainObj" />
     -->
  </div>
</template>

<script>
import { IteratorArr } from '~/utils/iterator.js'
let typeArr = [[1, 'DescChain'], [2, 'SelectChain']]

export default {
  name: 'vue-cchain',
  props: {
    chainObj: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    DescChain: function (resolve) {
      require(['./descChain.vue'], resolve)
    },
    SelectChain: function (resolve) {
      require(['./selectChain.vue'], resolve)
    }
  },
  methods: {
    isComponent () {
      return IteratorArr(typeArr, this.chainObj.type)
    }
  }
}
</script>
