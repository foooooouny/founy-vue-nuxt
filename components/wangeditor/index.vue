<template>
  <div class="chain-wangeditor">
    <div id="editorElem"></div>
    <button @click="getContent">查看内容</button>
  </div>
</template>

<script>
// import E from 'wangeditor'
import E from './plugin'

export default {
  data: () => ({
    editorContent: ''
  }),
  methods: {
    getContent: function () {
      alert(this.editorContent)
    }
  },
  mounted () {
    let editor = new E('#editorElem')
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
    }
    // console.log(E)
    // console.log(editor.menus)
    editor.customConfig.menus = ['head', 'bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', 'table', 'video', 'code', 'undo', 'redo', 'markd']
    // 使用 base64 保存图片
    // editor.customConfig.uploadImgShowBase64 = true
    // 上传图片到服务器
    editor.customConfig.uploadImgServer = '/upload'
    editor.create()
  }
}
</script>
