/*
    DOM 操作 API
*/

// 根据 html 代码片段创建 dom 对象
function createElemByHTML (html) {
  let div = void 0
  div = document.createElement('div')
  div.innerHTML = html
  return div.children
}

// 是否是 DOM List
function isDOMList (selector) {
  if (!selector) {
    return false
  }
  if (selector instanceof HTMLCollection || selector instanceof NodeList) {
    return true
  }
  return false
}

// 封装 document.querySelectorAll
function querySelectorAll (selector) {
  let result = document.querySelectorAll(selector)
  if (isDOMList(result)) {
    return result
  } else {
    return [result]
  }
}

// 创建构造函数
function DomElement (selector) {
  if (!selector) {
    return
  }

  // selector 本来就是 DomElement 对象，直接返回
  if (selector instanceof DomElement) {
    return selector
  }

  this.selector = selector

  // 根据 selector 得出的结果（如 DOM，DOM List）
  let selectorResult = []
  if (selector.nodeType === 1) {
    // 单个 DOM 节点
    selectorResult = [selector]
  } else if (isDOMList(selector)) {
    // DOM List
    selectorResult = selector
  } else if (typeof selector === 'string') {
    // 字符串
    selector = selector.replace('/\n/mg', '').trim()
    if (selector.indexOf('<') === 0) {
      // 如 <div>
      selectorResult = createElemByHTML(selector)
    } else {
      // 如 #id .class
      selectorResult = querySelectorAll(selector)
    }
  }

  let length = selectorResult.length
  if (!length) {
    // 空数组
    return this
  }

  // 加入 DOM 节点
  let i = void 0
  for (i = 0; i < length; i++) {
    this[i] = selectorResult[i]
  }
  this.length = length
}

// 修改原型
DomElement.prototype = {
  constructor: DomElement,

  // 类数组，forEach
  forEach: function forEach (fn) {
    let i = void 0
    for (i = 0; i < this.length; i++) {
      let elem = this[i]
      let result = fn.call(elem, elem, i)
      if (result === false) {
        break
      }
    }
    return this
  },

  // 获取第几个元素
  get: function get (index) {
    let length = this.length
    if (index >= length) {
      index = index % length
    }
    return $(this[index])
  },

  // 第一个
  first: function first () {
    return this.get(0)
  },

  // 最后一个
  last: function last () {
    let length = this.length
    return this.get(length - 1)
  },

  // 绑定事件
  on: function on (type, selector, fn) {
    // selector 不为空，证明绑定事件要加代理
    if (!fn) {
      fn = selector
      selector = null
    }

    // type 是否有多个
    let types = []
    types = type.split(/\s+/)

    return this.forEach(function (elem) {
      types.forEach(function (type) {
        if (!type) {
          return
        }

        if (!selector) {
          // 无代理
          elem.addEventListener(type, fn, false)
          return
        }

        // 有代理
        elem.addEventListener(type, function (e) {
          let target = e.target
          if (target.matches(selector)) {
            fn.call(target, e)
          }
        }, false)
      })
    })
  },

  // 取消事件绑定
  off: function off (type, fn) {
    return this.forEach(function (elem) {
      elem.removeEventListener(type, fn, false)
    })
  },

  // 获取/设置 属性
  attr: function attr (key, val) {
    if (val == null) {
      // 获取值
      return this[0].getAttribute(key)
    } else {
      // 设置值
      return this.forEach(function (elem) {
        elem.setAttribute(key, val)
      })
    }
  },

  // 添加 class
  addClass: function addClass (className) {
    if (!className) {
      return this
    }
    return this.forEach(function (elem) {
      let arr = void 0
      if (elem.className) {
        // 解析当前 className 转换为数组
        arr = elem.className.split(/\s/)
        arr = arr.filter(function (item) {
          return !!item.trim()
        })
        // 添加 class
        if (arr.indexOf(className) < 0) {
          arr.push(className)
        }
        // 修改 elem.class
        elem.className = arr.join(' ')
      } else {
        elem.className = className
      }
    })
  },

  // 删除 class
  removeClass: function removeClass (className) {
    if (!className) {
      return this
    }
    return this.forEach(function (elem) {
      let arr = void 0
      if (elem.className) {
        // 解析当前 className 转换为数组
        arr = elem.className.split(/\s/)
        arr = arr.filter(function (item) {
          item = item.trim()
          // 删除 class
          if (!item || item === className) {
            return false
          }
          return true
        })
        // 修改 elem.class
        elem.className = arr.join(' ')
      }
    })
  },

  // 修改 css
  css: function css (key, val) {
    let currentStyle = key + ':' + val + ';'
    return this.forEach(function (elem) {
      let style = (elem.getAttribute('style') || '').trim()
      let styleArr = void 0
      let resultArr = []
      if (style) {
        // 将 style 按照 ; 拆分为数组
        styleArr = style.split(';')
        styleArr.forEach(function (item) {
          // 对每项样式，按照 : 拆分为 key 和 value
          let arr = item.split(':').map(function (i) {
            return i.trim()
          })
          if (arr.length === 2) {
            resultArr.push(arr[0] + ':' + arr[1])
          }
        })
        // 替换或者新增
        resultArr = resultArr.map(function (item) {
          if (item.indexOf(key) === 0) {
            return currentStyle
          } else {
            return item
          }
        })
        if (resultArr.indexOf(currentStyle) < 0) {
          resultArr.push(currentStyle)
        }
        // 结果
        elem.setAttribute('style', resultArr.join('; '))
      } else {
        // style 无值
        elem.setAttribute('style', currentStyle)
      }
    })
  },

  // 显示
  show: function show () {
    return this.css('display', 'block')
  },

  // 隐藏
  hide: function hide () {
    return this.css('display', 'none')
  },

  // 获取子节点
  children: function children () {
    let elem = this[0]
    if (!elem) {
      return null
    }

    return $(elem.children)
  },

  // 增加子节点
  append: function append ($children) {
    return this.forEach(function (elem) {
      $children.forEach(function (child) {
        elem.appendChild(child)
      })
    })
  },

  // 移除当前节点
  remove: function remove () {
    return this.forEach(function (elem) {
      if (elem.remove) {
        elem.remove()
      } else {
        let parent = elem.parentElement
        parent && parent.removeChild(elem)
      }
    })
  },

  // 是否包含某个子节点
  isContain: function isContain ($child) {
    let elem = this[0]
    let child = $child[0]
    return elem.contains(child)
  },

  // 尺寸数据
  getSizeData: function getSizeData () {
    let elem = this[0]
    return elem.getBoundingClientRect() // 可得到 bottom height left right top width 的数据
  },

  // 封装 nodeName
  getNodeName: function getNodeName () {
    let elem = this[0]
    return elem.nodeName
  },

  // 从当前元素查找
  find: function find (selector) {
    let elem = this[0]
    return $(elem.querySelectorAll(selector))
  },

  // 获取当前元素的 text
  text: function text (val) {
    if (!val) {
      // 获取 text
      let elem = this[0]
      return elem.innerHTML.replace(/<.*?>/g, function () {
        return ''
      })
    } else {
      // 设置 text
      return this.forEach(function (elem) {
        elem.innerHTML = val
      })
    }
  },

  // 获取 html
  html: function html (value) {
    let elem = this[0]
    if (value == null) {
      return elem.innerHTML
    } else {
      elem.innerHTML = value
      return this
    }
  },

  // 获取 value
  val: function val () {
    let elem = this[0]
    return elem.value.trim()
  },

  // focus
  focus: function focus () {
    return this.forEach(function (elem) {
      elem.focus()
    })
  },

  // parent
  parent: function parent () {
    let elem = this[0]
    return $(elem.parentElement)
  },

  // parentUntil 找到符合 selector 的父节点
  parentUntil: function parentUntil (selector, _currentElem) {
    let results = document.querySelectorAll(selector)
    let length = results.length
    if (!length) {
      // 传入的 selector 无效
      return null
    }

    let elem = _currentElem || this[0]
    if (elem.nodeName === 'BODY') {
      return null
    }

    let parent = elem.parentElement
    let i = void 0
    for (i = 0; i < length; i++) {
      if (parent === results[i]) {
        // 找到，并返回
        return $(parent)
      }
    }

    // 继续查找
    return this.parentUntil(selector, parent)
  },

  // 判断两个 elem 是否相等
  equal: function equal ($elem) {
    if ($elem.nodeType === 1) {
      return this[0] === $elem
    } else {
      return this[0] === $elem[0]
    }
  },

  // 将该元素插入到某个元素前面
  insertBefore: function insertBefore (selector) {
    let $referenceNode = $(selector)
    let referenceNode = $referenceNode[0]
    if (!referenceNode) {
      return this
    }
    return this.forEach(function (elem) {
      let parent = referenceNode.parentNode
      parent.insertBefore(elem, referenceNode)
    })
  },

  // 将该元素插入到某个元素后面
  insertAfter: function insertAfter (selector) {
    let $referenceNode = $(selector)
    let referenceNode = $referenceNode[0]
    if (!referenceNode) {
      return this
    }
    return this.forEach(function (elem) {
      let parent = referenceNode.parentNode
      if (parent.lastChild === referenceNode) {
        // 最后一个元素
        parent.appendChild(elem)
      } else {
        // 不是最后一个元素
        parent.insertBefore(elem, referenceNode.nextSibling)
      }
    })
  }
}

// new 一个对象
export default function $ (selector) {
  return new DomElement(selector)
}
