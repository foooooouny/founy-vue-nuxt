<template>
    <div class="mdContainer" :class="{ fullPage: fullPageStatus }">
        <div class="navContainer" v-if="navStatus">
            <div class="nameContainer" v-if="brandCnt" @click="brandLinkFunc" v-html="brandCnt"></div>
            <div class="markContainer">
                <ul class="markListGroup">
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addStrong" title="strong" v-if="isShow('Strong')">
                    <i class="fa fa-bold" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addItalic" title="italic" v-if="isShow('Italic')">
                    <i class="fa fa-italic" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addStrikethrough" title="strikethrough" v-if="isShow('Strikethrough')">
                    <i class="fa fa-strikethrough" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addHTitle(1)" title="H1-title" v-if="isShow('H1')">
                    <i class="fa fa-header" aria-hidden="true"><span>1</span></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addHTitle(2)" title="H2-title" v-if="isShow('H2')">
                    <i class="fa fa-header" aria-hidden="true"><span>2</span></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addHTitle(3)" title="H3-title" v-if="isShow('H3')">
                    <i class="fa fa-header" aria-hidden="true"><span>3</span></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addHTitle(4)" title="H4-title" v-if="isShow('H4')">
                    <i class="fa fa-header" aria-hidden="true"><span>4</span></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addHTitle(5)" title="H5-title" v-if="isShow('H5')">
                    <i class="fa fa-header" aria-hidden="true"><span>5</span></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addHTitle(6)" title="H6-title" v-if="isShow('H6')">
                    <i class="fa fa-header" aria-hidden="true"><span>6</span></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addLine" title="line" v-if="isShow('Line')">
                    <i class="fa fa-minus" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addQuote" title="quote" v-if="isShow('Quote')">
                    <i class="fa fa-quote-left" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addCode" v-if="isShow('Code')">
                    <i class="fa fa-code" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addLink" v-if="isShow('Link')">
                    <i class="fa fa-link" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addImage" v-if="isShow('Image')">
                    <i class="fa fa-picture-o" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addTable" title="table" v-if="isShow('Table')">
                    <i class="fa fa-table" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addUl" title="ul-list" v-if="isShow('Ul')">
                    <i class="fa fa-list-ul" aria-hidden="true"></i>
                  </li>
                  <li :class="[ disabledStatus ? 'disabled' : '', 'markListItem']" @click="addOl" title="ol-list" v-if="isShow('Ol')">
                    <i class="fa fa-list-ol" aria-hidden="true"></i>
                  </li>
                  <li class="markListItem" @click="columnsFn" title="columns" v-if="isShow('Columns')">
                    <i class="fa fa-columns" aria-hidden="true"></i>
                  </li>
                  <li class="markListItem" @click="previewFn" title="preview" v-if="isShow('Preview')">
                    <i class="fa fa-eye" aria-hidden="true" v-if="previewBtn"></i>
                    <i class="fa fa-eye-slash" aria-hidden="true" v-if="!previewBtn"></i>
                  </li>
                  <li class="markListItem" @click="fullPageFn" title="fullpage" v-if="isShow('Fullpage')">
                    <i class="fa fa-arrows-alt" aria-hidden="true" v-if="!fullPageBtn"></i>
                    <i class="fa fa-compress" aria-hidden="true" v-if="fullPageBtn"></i>
                  </li>
                </ul>
            </div>
        </div>
        <div class="mdBodyContainer" :class="{ noMenu: !navStatus }" :style="{ height: editorH }">
            <div :id="editorContainerId" class="editContainer" v-if="editStatus">
              <textarea :id="containerId" class="mdEditor" @keydown.9="tabFn" v-scroll="editScroll" v-model="inputVsp" :placeholder="editorHolder"></textarea>
            </div>
            <div :id="previewContainerId" class="previewContainer markdown-body" v-scroll="previewScroll" v-html="compiledMarkdown" v-if="previewStatus">
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import marked from 'marked'
import scroll from 'vue-scroll'
import hljs from '~/assets/mdEditor/js/highlight.js'
import range from '~/assets/mdEditor/js/rangeFn.js'

Vue.use(scroll)

export default {
  name: 'markdown-editor',
  props: ['textareaId', 'editorPHolder', 'editorHeight', 'mdValuesP', 'fullPageStatusP', 'editStatusP', 'columnsStatusP', 'navStatusP', 'brandContent', 'hidType'],
  data () {
    return {
      // 编辑器id
      containerId: this.textareaId || 'MdEditor',
      editorContainerId: `txt_${this.textareaId || 'MdEditor'}`,
      // 展示窗id
      previewContainerId: `preview_${this.textareaId || 'MdEditor'}`,
      editorHolder: this.editorPHolder || '此处填写Markdown格式文档',
      defaultEditorH: this.editorHeight || '400px',
      editorH: this.editorHeight || '400px',
      // markdown 内容
      inputVsp: this.mdValuesP || '',
      // 编辑器状态
      editStatus: Boolean(this.columnsStatusP) || Boolean(this.editStatusP),
      // 展示窗状态
      previewStatus: Boolean(this.columnsStatusP) || !this.editStatusP,
      // 分栏功能状态
      columnsStatus: Boolean(this.columnsStatusP),
      // 功能禁用按钮状态
      disabledStatus: !this.columnsStatusP && !this.editStatusP,
      // preview 图标显示状态，默认跟编辑器状态
      previewBtn: Boolean(this.columnsStatusP) || Boolean(this.editStatusP),
      // 编辑器全屏状态
      fullPageStatus: Boolean(this.fullPageStatusP),
      // 编辑器全屏按钮状态
      fullPageBtn: Boolean(this.fullPageStatusP),
      // 导航条显示状态
      navStatus: Boolean(this.navStatusP),
      // 导航条 logo内容，如果有内容，显示logo
      brandCnt: this.brandContent,
      maxEditScrollHeight: 0,
      maxPreviewScrollHeight: 0,
      // 需要隐藏的功能：Strong、Italic、Strikethrough、H1、H2、H3、H4、H5、H6、Line、Quote、Code、Link、Image、Table、Ul、Ol、Fullpage、Columns、Preview
      hiddenType: this.hidType || [],
      // body 当前scrollTop值
      bodyScrollTop: 0
    }
  },
  // created: function() {
  //   if (!this.editStatus && !this.previewStatus) {
  //     this.editStatus = true
  //     this.previewStatus = true
  //   }
  // },
  methods: {
    insertContent: function (val) {
      if (this.disabledStatus) {
        return
      }
      let textareaDom = document.getElementById(this.containerId)
      let value = textareaDom.value
      let point = range.getCursortPosition(textareaDom)
      let lastChart = value.substring(point - 1, point)
      let lastFourCharts = value.substring(point - 4, point)
      if (lastChart !== '\n' && value !== '' && lastFourCharts !== '    ') {
        val = '\n' + val
        range.insertAfterText(textareaDom, val)
      } else {
        range.insertAfterText(textareaDom, val)
      }
      this.inputVsp = document.getElementById(this.containerId).value
    },
    tabFn: function(evt) {
      if (this.disabledStatus) {
        return
      }
      this.insertContent('    ')
      // 屏蔽屌tab切换事件
      if (evt.preventDefault) {
        evt.preventDefault()
      } else {
        evt.returnValue = false
      }
    },
    addImage: function(evt) {
      if (this.disabledStatus) {
        return
      }
      setTimeout(() => {
        this.insertContent('![Vue](https://cn.vuejs.org/images/logo.png)')
      }, 1000)
    },
    addHTitle: function(index) {
      if (this.disabledStatus) {
        return
      }
      let tmp = ''
      switch (index) {
        case 1:
          tmp = '# '
          break
        case 2:
          tmp = '## '
          break
        case 3:
          tmp = '### '
          break
        case 4:
          tmp = '#### '
          break
        case 5:
          tmp = '##### '
          break
        case 6:
          tmp = '###### '
          break
        default:
          break
      }
      this.insertContent(tmp)
    },
    addCode: function() {
      if (this.disabledStatus) {
        return
      }
      let textareaDom = document.getElementById(this.containerId)
      let value = textareaDom.value
      let point = range.getCursortPosition(textareaDom)
      let lastChart = value.substring(point - 1, point)
      this.insertContent('```\n\n```')
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 5)
      } else {
        range.setCaretPosition(textareaDom, point + 4)
      }
    },
    addStrikethrough: function() {
      if (this.disabledStatus) {
        return
      }
      let textareaDom = document.getElementById(this.containerId)
      let value = textareaDom.value
      let point = range.getCursortPosition(textareaDom)
      let lastChart = value.substring(point - 1, point)
      this.insertContent('~~~~')
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 3)
      } else {
        range.setCaretPosition(textareaDom, point + 2)
      }
    },
    addStrong: function() {
      if (this.disabledStatus) {
        return
      }
      let textareaDom = document.getElementById(this.containerId)
      let value = textareaDom.value
      let point = range.getCursortPosition(textareaDom)
      let lastChart = value.substring(point - 1, point)
      this.insertContent('****')
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 3)
      } else {
        range.setCaretPosition(textareaDom, point + 2)
      }
    },
    addItalic: function() {
      if (this.disabledStatus) {
        return
      }
      let textareaDom = document.getElementById(this.containerId)
      let value = textareaDom.value
      let point = range.getCursortPosition(textareaDom)
      let lastChart = value.substring(point - 1, point)
      this.insertContent('**')
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 2)
      } else {
        range.setCaretPosition(textareaDom, point + 1)
      }
    },
    // setStrong: function() {
    //   if (this.disabledStatus) {
    //     return
    //   }
    //   let textareaDom = document.getElementById(this.containerId)
    //   let point = range.getCursortPosition(textareaDom)
    // },
    addLine: function() {
      if (this.disabledStatus) {
        return
      }
      this.insertContent('\n----\n')
    },
    addLink: function() {
      if (this.disabledStatus) {
        return
      }
      this.insertContent('[Vue](https://cn.vuejs.org/images/logo.png)')
    },
    addQuote: function() {
      if (this.disabledStatus) {
        return
      }
      let textareaDom = document.getElementById(this.containerId)
      let value = textareaDom.value
      let point = range.getCursortPosition(textareaDom)
      let lastChart = value.substring(point - 1, point)
      this.insertContent('> ')
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 3)
      } else {
        range.setCaretPosition(textareaDom, point + 2)
      }
    },
    addTable: function() {
      if (this.disabledStatus) {
        return
      }
      this.insertContent('\nheader 1 | header 2\n')
      this.insertContent('---|---\n')
      this.insertContent('row 1 col 1 | row 1 col 2\n')
      this.insertContent('row 2 col 1 | row 2 col 2\n\n')
    },
    addUl: function() {
      if (this.disabledStatus) {
        return
      }
      this.insertContent('* ')
    },
    addOl: function() {
      if (this.disabledStatus) {
        return
      }
      this.insertContent('1. ')
    },
    columnsFn: function() {
      if (!this.columnsStatus) {
        this.editStatus = true
        this.previewStatus = true
      } else {
        this.previewStatus = !this.previewStatus
      }
      this.previewBtn = true
      this.columnsStatus = !this.columnsStatus
      setTimeout(() => {
        this.maxEditScrollHeight = document.getElementById(this.containerId) ? document.getElementById(this.containerId).scrollHeight - document.getElementById(this.containerId).clientHeight : this.maxEditScrollHeight
        this.maxPreviewScrollHeight = document.getElementById(this.previewContainerId) ? document.getElementById(this.previewContainerId).scrollHeight - document.getElementById(this.previewContainerId).clientHeight : this.maxPreviewScrollHeight
      }, 1)
    },
    previewFn: function() {
      if (this.columnsStatus) {
        this.editStatus = true
        this.previewStatus = false
        this.columnsStatus = !this.columnsStatus
      } else {
        this.editStatus = !this.editStatus
        this.previewStatus = !this.previewStatus
      }
      if (this.previewStatus && !this.columnsStatus) {
        this.disabledStatus = true
      } else {
        this.disabledStatus = false
      }
      this.previewBtn = !this.previewStatus
    },
    fullPageFn: function() {
      this.fullPageStatus = !this.fullPageStatus
      this.fullPageBtn = !this.fullPageBtn
      let maxEditScrollHeight = document.getElementById(this.editorContainerId) ? document.getElementById(this.editorContainerId).scrollHeight - document.getElementById(this.editorContainerId).clientHeight : this.maxEditScrollHeight
      let maxPreviewScrollHeight = document.getElementById(this.previewContainerId) ? document.getElementById(this.previewContainerId).scrollHeight - document.getElementById(this.previewContainerId).clientHeight : this.maxPreviewScrollHeight
      this.maxEditScrollHeight = maxEditScrollHeight
      this.maxPreviewScrollHeight = maxPreviewScrollHeight
      if (this.fullPageStatus) {
        this.editorH = '100%'
        this.bodyScrollFunc().fullPage()
      } else {
        this.editorH = this.defaultEditorH
        this.bodyScrollFunc().unFullPage()
      }
    },
    previewScroll: function(e, position) {
      if (this.maxEditScrollHeight !== 0 && this.columnsStatus) {
        let topPercent = position.scrollTop / this.maxPreviewScrollHeight
        document.getElementById(this.containerId).scrollTop = this.maxEditScrollHeight * topPercent
      }
    },
    editScroll: function(e, position) {
      if (this.maxPreviewScrollHeight !== 0 && this.columnsStatus) {
        let topPercent = position.scrollTop / this.maxEditScrollHeight
        document.getElementById(this.previewContainerId).scrollTop = this.maxPreviewScrollHeight * topPercent
      }
    },
    isShow: function (v) {
      let hType = this.hiddenType
      let typeBool = true
      for (let i of hType) {
        if (v === i) {
          typeBool = false
        }
      }
      return typeBool
    },
    brandLinkFunc: function () {
      window.open('http://cpc.top')
    },
    bodyScrollFunc: function () {
      let that = this
      return {
        fullPage: function () {
          that.bodyScrollTop = document.body.scrollTop
          document.body.classList.add('fullPage')
          document.body.style.top = -that.bodyScrollTop + 'px'
        },
        unFullPage: function () {
          document.body.classList.remove('fullPage')
          // scrollTop lost after set position:fixed, restore it back.
          document.body.scrollTop = that.bodyScrollTop
        }
      }
    }
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.inputVsp, {
        sanitize: true
      })
    }
  },
  watch: {
    inputVsp: function() {
      let data = {}
      data.mdValue = this.inputVsp
      data.htmlValue = marked(this.inputVsp, {
        sanitize: true
      })
      this.$emit('childevent', data)
      let maxEditScrollHeight = document.getElementById(this.containerId) ? document.getElementById(this.containerId).scrollHeight - document.getElementById(this.containerId).clientHeight : this.maxEditScrollHeight
      let maxPreviewScrollHeight = document.getElementById(this.previewContainerId) ? document.getElementById(this.previewContainerId).scrollHeight - document.getElementById(this.previewContainerId).clientHeight : this.maxPreviewScrollHeight
      this.maxEditScrollHeight = maxEditScrollHeight
      this.maxPreviewScrollHeight = maxPreviewScrollHeight
    }
  },
  mounted () {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      highlight: function (code) {
        return hljs.highlightAuto(code).value
      }
    })
  }
}
</script>

<style lang="scss">
  body {
    &.fullPage {
      position: fixed;
      width: 100%;
    }
  }
  .mdContainer {
    width: 100%;
    height: 100%;
    background-color: lightblue;
    &.fullPage {
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      height: 100%;
    }
  }
  .navContainer {
    width: 100%;
    // height: 36px;
    background-color: #F5F5F5;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 4px 10px;
  }
  .nameContainer {
    max-width: 30px;
    color: lightblue;
    margin-right: 10px;
    cursor: pointer;
  }
  .markContainer {
    width: auto;
    height: 100%;
    margin-left: 0px;
  }
  ul.markListGroup {
    height: 100%;
    width: auto;
    display: block;
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
  }
  li.markListItem {
    list-style: none;
    margin: 0 1px;
    padding: 5px;
    display: inline-block;
    // width: 20px;
    // height: 20px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    color: #333;
    border-radius: 1px;
    &:hover {
      background: #eee;
    }
    &.disabled {
      background-color: #e9e9e9;
      color: #a4a4a4;
      cursor: no-drop;
    }
  }
  .mdBodyContainer {
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    &.noMenu{
      height: 100%;
    }
  }

  // 编辑区域
  .editContainer {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-right: 1px solid #ddd;
    background: #333;
    color: #fff;
    padding: 10px;
  }
  .mdEditor {
    padding: 10px;
    height: 100%;
    width: 100%;
    background: transparent;
    outline: none;
    color: #fff;
    resize: none;
  }

  // 预览区
  .previewContainer {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    overflow: auto;
    padding: 10px;
    text-align: left;
  }
  .fa {
    >span {
      position: relative;
      top: 1px;
    }
  }
</style>
