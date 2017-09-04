<template>
  <div class="chain-container">
    <div class="chain-conect" v-html="chainObj.nodeContent.desc">
    </div>
  </div>
</template>

<script>

export default {
  props: {
    chainObj: {
      type: Object,
      default: () => {}
    }
  },
  methods: {

  }
}
</script>
