import E from 'wangeditor'
import $ from '~/utils/wangUtil'
import MarkdownIt from 'markdown-it'

let md = new MarkdownIt()
console.log(md.render('### FDSFDSF'))
// 构造函数
// function Markdown (editor) {
//   this.editor = editor
//   this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-italic"><i/>\n        </div>')
//   this.type = 'markd'

//   // 当前是否 active 状态
//   this._active = false
// }

// // 原型
// Markdown.prototype = {
//   constructor: Markdown,

//   // 点击事件
//   onClick: function onClick (e) {
//     // 点击菜单将触发这里

//     var editor = this.editor
//     var isSeleEmpty = editor.selection.isSelectionEmpty()

//     if (isSeleEmpty) {
//       // 选区是空的，插入并选中一个“空白”
//       editor.selection.createEmptyRange()
//     }

//     // 执行 Markdown 命令
//     editor.cmd.do('Markdown')

//     if (isSeleEmpty) {
//       // 需要将选取折叠起来
//       editor.selection.collapseRange()
//       editor.selection.restoreSelection()
//     }
//   },

//   // 试图改变 active 状态
//   tryChangeActive: function tryChangeActive (e) {
//     var editor = this.editor
//     var $elem = this.$elem
//     if (editor.cmd.queryCommandState('Markdown')) {
//       this._active = true
//       $elem.addClass('w-e-active')
//     } else {
//       this._active = false
//       $elem.removeClass('w-e-active')
//     }
//   }
// }

// let Editor = E.createMenu(function (check) {
//   // 定义菜单id，不要和其他菜单id重复。编辑器自带的所有菜单id，可通过『参数配置-自定义菜单』一节查看
//   let menuId = 'markd'

//   // check将检查菜单配置（『参数配置-自定义菜单』一节描述）中是否该菜单id，如果没有，则忽略下面的代码。
//   if (!check(menuId)) {
//     return
//   }
//   // this 指向 editor 对象自身
//   let editor = this

//   // 创建 menu 对象
//   let menu = new E.Menu({
//     // 编辑器对象
//     editor: editor,
//     // 菜单id
//     id: menuId,
//     // 菜单标题
//     title: 'markd',

//     // 正常状态和选中装下的dom对象，样式需要自定义
//     $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-omega"></i></a>'),
//     $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-omega"></i></a>')
//   })

//   // 要插入的符号（可自行添加）
//   let symbols = ['∑', '√', '∫', '∏', '≠', '♂', '♀']

//   // panel 内容
//   let $container = $('<div></div>')
//   $.each(symbols, function (k, value) {
//     $container.append('<a href="#" style="display:inline-block;margin:5px;">' + value + '</a>')
//   })

//   // 插入符号的事件
//   $container.on('click', 'a', function (e) {
//     var $a = $(e.currentTarget)
//     var s = $a.text()
//     console.log(md.render('### NIHAO'))

//     // 执行插入的命令
//     editor.command(e, 'insertHtml', s)
//   })

//   // 添加panel
//   menu.dropPanel = new E.DropPanel(editor, menu, {
//     $content: $container,
//     width: 350
//   })

//   // 增加到editor对象中
//   editor.menus[menuId] = menu
// })

export default E
