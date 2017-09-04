<template>
  <div class="chain-container">
    <div class="chain-content" v-html="chainObj.nodeContent.desc"></div>
    <ul class="chain-select-ul">
      <li v-for="(item, index) in chainObj.nodeContent.options" :key="item.id" class="chain-select-li">
        <span class="chain-select-text">{{ item.content }}</span>
        <span :class="[ radioValue === index ? 'chain-radio-box is-checked' : 'chain-radio-box' ]" @click="chainRadio(index)">
          <span class="chain-radio-btn"></span>
          <input type="radio" class="chain-radio-input" :value="index" />
        </span>

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    radioValue: 0
  }),
  props: {
    chainObj: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    chainRadio (index) {
      this.radioValue = index
    }
  }
}
</script>
