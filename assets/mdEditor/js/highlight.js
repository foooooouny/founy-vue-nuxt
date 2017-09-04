// /*
// Syntax highlighting with language autodetection.
// https://highlightjs.org/
// */

// (function (factory) {
//   // Find the global object for export to both the browser and web workers.
//   var globalObject = typeof window === 'object' && window ||
//                      typeof self === 'object' && self

//   // Setup highlight.js for different environments. First is Node.js or
//   // CommonJS.
//   if (typeof exports !== 'undefined') {
//     factory(exports)
//   } else if (globalObject) {
//     // Export hljs globally even when using AMD for cases when this script
//     // is loaded with others that may still expect a global hljs.
//     globalObject.hljs = factory({})

//     // Finally register the global hljs with AMD.
//     if (typeof define === 'function' && define.amd) {
//       define([], function () {
//         return globalObject.hljs
//       })
//     }
//   }
// }(function (hljs) {
//   // Convenience variables for build-in objects

//   return hljs
// }))

let hljs = {}
let ArrayProto = []
let objectKeys = Object.keys

// Global internal variables used within the highlight.js library.
let languages = {}
let aliases = {}

// Regular expressions used throughout the highlight.js library.
let noHighlightRe = /^(no-?highlight|plain|text)$/i
let languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i
let fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm

var spanEndTag = '</span>'

// Global options used when within external APIs. This is modified when
// calling the `hljs.configure` function.
var options = {
  classPrefix: 'hljs-',
  tabReplace: null,
  useBR: false,
  languages: undefined
}

/* Utility functions */

function escape (value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function tag (node) {
  return node.nodeName.toLowerCase()
}

function testRe (re, lexeme) {
  var match = re && re.exec(lexeme)
  return match && match.index === 0
}

function isNotHighlighted (language) {
  return noHighlightRe.test(language)
}

function blockLanguage (block) {
  var i, match, length, _class
  var classes = block.className + ' '

  classes += block.parentNode ? block.parentNode.className : ''

  // language-* takes precedence over non-prefixed class names.
  match = languagePrefixRe.exec(classes)
  if (match) {
    return getLanguage(match[1]) ? match[1] : 'no-highlight'
  }

  classes = classes.split(/\s+/)

  for (i = 0, length = classes.length; i < length; i++) {
    _class = classes[i]

    if (isNotHighlighted(_class) || getLanguage(_class)) {
      return _class
    }
  }
}

function inherit (parent) { // inherit(parent, override_obj, override_obj, ...)
  var key
  var result = {}
  var objects = Array.prototype.slice.call(arguments, 1)

  for (key in parent) { result[key] = parent[key] }
  objects.forEach(function (obj) {
    for (key in obj) { result[key] = obj[key] }
  })
  return result
}

/* Stream merging */

function nodeStream (node) {
  var result = [];
  (function _nodeStream (node, offset) {
    for (var child = node.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === 3) { offset += child.nodeValue.length } else if (child.nodeType === 1) {
        result.push({
          event: 'start',
          offset: offset,
          node: child
        })
        offset = _nodeStream(child, offset)
        // Prevent void elements from having an end tag that would actually
        // double them in the output. There are more void elements in HTML
        // but we list only those realistically expected in code display.
        if (!tag(child).match(/br|hr|img|input/)) {
          result.push({
            event: 'stop',
            offset: offset,
            node: child
          })
        }
      }
    }
    return offset
  })(node, 0)
  return result
}

function mergeStreams (original, highlighted, value) {
  var processed = 0
  var result = ''
  var nodeStack = []

  function selectStream () {
    if (!original.length || !highlighted.length) {
      return original.length ? original : highlighted
    }
    if (original[0].offset !== highlighted[0].offset) {
      return (original[0].offset < highlighted[0].offset) ? original : highlighted
    }

    /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
    return highlighted[0].event === 'start' ? original : highlighted
  }

  function open (node) {
    function attrStr (a) { return ' ' + a.nodeName + '="' + escape(a.value).replace('"', '&quot;') + '"' }
    result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attrStr).join('') + '>'
  }

  function close (node) {
    result += '</' + tag(node) + '>'
  }

  function render (event) {
    (event.event === 'start' ? open : close)(event.node)
  }

  while (original.length || highlighted.length) {
    var stream = selectStream()
    result += escape(value.substring(processed, stream[0].offset))
    processed = stream[0].offset
    if (stream === original) {
      /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
      nodeStack.reverse().forEach(close)
      do {
        render(stream.splice(0, 1)[0])
        stream = selectStream()
      } while (stream === original && stream.length && stream[0].offset === processed)
      nodeStack.reverse().forEach(open)
    } else {
      if (stream[0].event === 'start') {
        nodeStack.push(stream[0].node)
      } else {
        nodeStack.pop()
      }
      render(stream.splice(0, 1)[0])
    }
  }
  return result + escape(value.substr(processed))
}

/* Initialization */

function expandMode (mode) {
  if (mode.variants && !mode.cached_variants) {
    mode.cached_variants = mode.variants.map(function (variant) {
      return inherit(mode, {variants: null}, variant)
    })
  }
  return mode.cached_variants || (mode.endsWithParent && [inherit(mode)]) || [mode]
}

function compileLanguage (language) {
  function reStr (re) {
    return (re && re.source) || re
  }

  function langRe (value, global) {
    return new RegExp(
      reStr(value),
      'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
    )
  }

  function compileMode (mode, parent) {
    if (mode.compiled) { return }
    mode.compiled = true

    mode.keywords = mode.keywords || mode.beginKeywords
    if (mode.keywords) {
      var compiledKeywords = {}

      var flatten = function (className, str) {
        if (language.case_insensitive) {
          str = str.toLowerCase()
        }
        str.split(' ').forEach(function (kw) {
          var pair = kw.split('|')
          compiledKeywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1]
        })
      }

      if (typeof mode.keywords === 'string') { // string
        flatten('keyword', mode.keywords)
      } else {
        objectKeys(mode.keywords).forEach(function (className) {
          flatten(className, mode.keywords[className])
        })
      }
      mode.keywords = compiledKeywords
    }
    mode.lexemesRe = langRe(mode.lexemes || /\w+/, true)

    if (parent) {
      if (mode.beginKeywords) {
        mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b'
      }
      if (!mode.begin) { mode.begin = /\B|\b/ }
      mode.beginRe = langRe(mode.begin)
      if (!mode.end && !mode.endsWithParent) { mode.end = /\B|\b/ }
      if (mode.end) { mode.endRe = langRe(mode.end) }
      mode.terminator_end = reStr(mode.end) || ''
      if (mode.endsWithParent && parent.terminator_end) { mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end }
    }
    if (mode.illegal) { mode.illegalRe = langRe(mode.illegal) }
    if (mode.relevance == null) { mode.relevance = 1 }
    if (!mode.contains) {
      mode.contains = []
    }
    mode.contains = Array.prototype.concat.apply([], mode.contains.map(function (c) {
      return expandMode(c === 'self' ? mode : c)
    }))
    mode.contains.forEach(function (c) { compileMode(c, mode) })

    if (mode.starts) {
      compileMode(mode.starts, parent)
    }

    var terminators =
        mode.contains.map(function (c) {
          return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin
        })
          .concat([mode.terminator_end, mode.illegal])
          .map(reStr)
          .filter(Boolean)
    mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function (/* s */) { return null }}
  }

  compileMode(language)
}

/*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
function highlight (name, value, ignoreIllegals, continuation) {
  function subMode (lexeme, mode) {
    var i, length

    for (i = 0, length = mode.contains.length; i < length; i++) {
      if (testRe(mode.contains[i].beginRe, lexeme)) {
        return mode.contains[i]
      }
    }
  }

  function endOfMode (mode, lexeme) {
    if (testRe(mode.endRe, lexeme)) {
      while (mode.endsParent && mode.parent) {
        mode = mode.parent
      }
      return mode
    }
    if (mode.endsWithParent) {
      return endOfMode(mode.parent, lexeme)
    }
  }

  function isIllegal (lexeme, mode) {
    return !ignoreIllegals && testRe(mode.illegalRe, lexeme)
  }

  function keywordMatch (mode, match) {
    var matchStr = language.case_insensitive ? match[0].toLowerCase() : match[0]
    return mode.keywords.hasOwnProperty(matchStr) && mode.keywords[matchStr]
  }

  function buildSpan (classname, insideSpan, leaveOpen, noPrefix) {
    let classPrefix = noPrefix ? '' : options.classPrefix
    let openSpan = '<span class="' + classPrefix
    let closeSpan = leaveOpen ? '' : spanEndTag

    openSpan += classname + '">'

    return openSpan + insideSpan + closeSpan
  }

  function processKeywords () {
    var keywordMatch, lastIndex, match, result

    if (!top.keywords) { return escape(modeBuffer) }

    result = ''
    lastIndex = 0
    top.lexemesRe.lastIndex = 0
    match = top.lexemesRe.exec(modeBuffer)

    while (match) {
      result += escape(modeBuffer.substring(lastIndex, match.index))
      keywordMatch = keywordMatch(top, match)
      if (keywordMatch) {
        relevance += keywordMatch[1]
        result += buildSpan(keywordMatch[0], escape(match[0]))
      } else {
        result += escape(match[0])
      }
      lastIndex = top.lexemesRe.lastIndex
      match = top.lexemesRe.exec(modeBuffer)
    }
    return result + escape(modeBuffer.substr(lastIndex))
  }

  function processSubLanguage () {
    var explicit = typeof top.subLanguage === 'string'
    if (explicit && !languages[top.subLanguage]) {
      return escape(modeBuffer)
    }

    var result = explicit
      ? highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage])
      : highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : undefined)

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
    if (top.relevance > 0) {
      relevance += result.relevance
    }
    if (explicit) {
      continuations[top.subLanguage] = result.top
    }
    return buildSpan(result.language, result.value, false, true)
  }

  function processBuffer () {
    result += (top.subLanguage != null ? processSubLanguage() : processKeywords())
    modeBuffer = ''
  }

  function startNewMode (mode) {
    result += mode.className ? buildSpan(mode.className, '', true) : ''
    top = Object.create(mode, {parent: {value: top}})
  }

  function processLexeme (buffer, lexeme) {
    modeBuffer += buffer

    if (lexeme == null) {
      processBuffer()
      return 0
    }

    let newMode = subMode(lexeme, top)
    if (newMode) {
      if (newMode.skip) {
        modeBuffer += lexeme
      } else {
        if (newMode.excludeBegin) {
          modeBuffer += lexeme
        }
        processBuffer()
        if (!newMode.returnBegin && !newMode.excludeBegin) {
          modeBuffer = lexeme
        }
      }
      startNewMode(newMode, lexeme)
      return newMode.returnBegin ? 0 : lexeme.length
    }

    var endMode = endOfMode(top, lexeme)
    if (endMode) {
      var origin = top
      if (origin.skip) {
        modeBuffer += lexeme
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          modeBuffer += lexeme
        }
        processBuffer()
        if (origin.excludeEnd) {
          modeBuffer = lexeme
        }
      }
      do {
        if (top.className) {
          result += spanEndTag
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance
        }
        top = top.parent
      } while (top !== endMode.parent)
      if (endMode.starts) {
        startNewMode(endMode.starts, '')
      }
      return origin.returnEnd ? 0 : lexeme.length
    }

    if (isIllegal(lexeme, top)) { throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"') }

    /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
    modeBuffer += lexeme
    return lexeme.length || 1
  }

  var language = getLanguage(name)
  if (!language) {
    throw new Error('Unknown language: "' + name + '"')
  }

  compileLanguage(language)
  let top = continuation || language
  let continuations = {} // keep continuations for sub-languages
  let result = ''
  let current
  for (current = top; current !== language; current = current.parent) {
    if (current.className) {
      result = buildSpan(current.className, '', true) + result
    }
  }
  let modeBuffer = ''
  let relevance = 0
  try {
    let match
    let count
    let index = 0
    while (true) {
      top.terminators.lastIndex = index
      match = top.terminators.exec(value)
      if (!match) { break }
      count = processLexeme(value.substring(index, match.index), match[0])
      index = match.index + count
    }
    processLexeme(value.substr(index))
    for (current = top; current.parent; current = current.parent) { // close dangling modes
      if (current.className) {
        result += spanEndTag
      }
    }
    return {
      relevance: relevance,
      value: result,
      language: name,
      top: top
    }
  } catch (e) {
    if (e.message && e.message.indexOf('Illegal') !== -1) {
      return {
        relevance: 0,
        value: escape(value)
      }
    } else {
      throw e
    }
  }
}

/*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - secondBest (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
function highlightAuto (text, languageSubset) {
  languageSubset = languageSubset || options.languages || objectKeys(languages)
  var result = {
    relevance: 0,
    value: escape(text)
  }
  var secondBest = result
  languageSubset.filter(getLanguage).forEach(function (name) {
    var current = highlight(name, text, false)
    current.language = name
    if (current.relevance > secondBest.relevance) {
      secondBest = current
    }
    if (current.relevance > result.relevance) {
      secondBest = result
      result = current
    }
  })
  if (secondBest.language) {
    result.secondBest = secondBest
  }
  return result
}

/*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
function fixMarkup (value) {
  return !(options.tabReplace || options.useBR)
    ? value
    : value.replace(fixMarkupRe, function (match, p1) {
      if (options.useBR && match === '\n') {
        return '<br>'
      } else if (options.tabReplace) {
        return p1.replace(/\t/g, options.tabReplace)
      }
      return ''
    })
}

function buildClassName (prevClassName, currentLang, resultLang) {
  let language = currentLang ? aliases[currentLang] : resultLang
  let result = [prevClassName.trim()]

  if (!prevClassName.match(/\bhljs\b/)) {
    result.push('hljs')
  }

  if (prevClassName.indexOf(language) === -1) {
    result.push(language)
  }

  return result.join(' ').trim()
}

/*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
function highlightBlock (block) {
  var node, originalStream, result, resultNode, text
  var language = blockLanguage(block)

  if (isNotHighlighted(language)) { return }

  if (options.useBR) {
    node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n')
  } else {
    node = block
  }
  text = node.textContent
  result = language ? highlight(language, text, true) : highlightAuto(text)

  originalStream = nodeStream(node)
  if (originalStream.length) {
    resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    resultNode.innerHTML = result.value
    result.value = mergeStreams(originalStream, nodeStream(resultNode), text)
  }
  result.value = fixMarkup(result.value)

  block.innerHTML = result.value
  block.className = buildClassName(block.className, language, result.language)
  block.result = {
    language: result.language,
    re: result.relevance
  }
  if (result.secondBest) {
    block.secondBest = {
      language: result.secondBest.language,
      re: result.secondBest.relevance
    }
  }
}

/*
  Updates highlight.js global options with values passed in the form of an object.
  */
function configure (userOptions) {
  options = inherit(options, userOptions)
}

/*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
function initHighlighting () {
  if (initHighlighting.called) { return }
  initHighlighting.called = true

  var blocks = document.querySelectorAll('pre code')
  ArrayProto.forEach.call(blocks, highlightBlock)
}

/*
  Attaches highlighting to the page load event.
  */
function initHighlightingOnLoad () {
  addEventListener('DOMContentLoaded', initHighlighting, false)
  addEventListener('load', initHighlighting, false)
}

function registerLanguage (name, language) {
  var lang = languages[name] = language(hljs)
  if (lang.aliases) {
    lang.aliases.forEach(function (alias) { aliases[alias] = name })
  }
}

function listLanguages () {
  return objectKeys(languages)
}

function getLanguage (name) {
  name = (name || '').toLowerCase()
  return languages[name] || languages[aliases[name]]
}

/* Interface definition */

hljs.highlight = highlight
hljs.highlightAuto = highlightAuto
hljs.fixMarkup = fixMarkup
hljs.highlightBlock = highlightBlock
hljs.configure = configure
hljs.initHighlighting = initHighlighting
hljs.initHighlightingOnLoad = initHighlightingOnLoad
hljs.registerLanguage = registerLanguage
hljs.listLanguages = listLanguages
hljs.getLanguage = getLanguage
hljs.inherit = inherit

// Common regexps
hljs.IDENT_RE = '[a-zA-Z]\\w*'
hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*'
hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?'
hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)' // 0x..., 0..., decimal, float
hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)' // 0b...
hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~'

// Common modes
hljs.BACKSLASH_ESCAPE = {
  begin: '\\\\[\\s\\S]', relevance: 0
}
hljs.APOS_STRING_MODE = {
  className: 'string',
  begin: '\'',
  end: '\'',
  illegal: '\\n',
  contains: [hljs.BACKSLASH_ESCAPE]
}
hljs.QUOTE_STRING_MODE = {
  className: 'string',
  begin: '"',
  end: '"',
  illegal: '\\n',
  contains: [hljs.BACKSLASH_ESCAPE]
}
hljs.PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
}
hljs.COMMENT = function (begin, end, inherits) {
  var mode = hljs.inherit(
    {
      className: 'comment',
      begin: begin,
      end: end,
      contains: []
    },
    inherits || {}
  )
  mode.contains.push(hljs.PHRASAL_WORDS_MODE)
  mode.contains.push({
    className: 'doctag',
    begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
    relevance: 0
  })
  return mode
}
hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$')
hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/')
hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$')
hljs.NUMBER_MODE = {
  className: 'number',
  begin: hljs.NUMBER_RE,
  relevance: 0
}
hljs.C_NUMBER_MODE = {
  className: 'number',
  begin: hljs.C_NUMBER_RE,
  relevance: 0
}
hljs.BINARY_NUMBER_MODE = {
  className: 'number',
  begin: hljs.BINARY_NUMBER_RE,
  relevance: 0
}
hljs.CSS_NUMBER_MODE = {
  className: 'number',
  begin: hljs.NUMBER_RE + '(' +
      '%|em|ex|ch|rem' +
      '|vw|vh|vmin|vmax' +
      '|cm|mm|in|pt|pc|px' +
      '|deg|grad|rad|turn' +
      '|s|ms' +
      '|Hz|kHz' +
      '|dpi|dpcm|dppx' +
      ')?',
  relevance: 0
}
hljs.REGEXP_MODE = {
  className: 'regexp',
  begin: /\//,
  end: /\/[gimuy]*/,
  illegal: /\n/,
  contains: [
    hljs.BACKSLASH_ESCAPE,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [hljs.BACKSLASH_ESCAPE]
    }
  ]
}
hljs.TITLE_MODE = {
  className: 'title',
  begin: hljs.IDENT_RE,
  relevance: 0
}
hljs.UNDERSCORE_TITLE_MODE = {
  className: 'title',
  begin: hljs.UNDERSCORE_IDENT_RE,
  relevance: 0
}
hljs.METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
  relevance: 0
}

export default hljs
