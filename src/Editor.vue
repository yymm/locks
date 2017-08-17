<template>
  <div id="editor">
    <div class="editor" :style="{ display: showEditor }"></div>
    <div :id="selectedMdTheme" class="markdown-body preview" v-html="parsed"></div>
    <div class="control-button control-left"  @click="moveSlide(showIndex--)" v-if="selectedMode === 'slide'">&#10094;</div>
    <div class="control-button control-right" @click="moveSlide(showIndex++)" v-if="selectedMode === 'slide'">&#10095;</div>
    <div class="current-page" v-if="selectedMode === 'slide'">{{ `${showIndex+1} / ${maxIndex}`  }}</div>
    <div class="control-button control-fullscreen" @click="handleFullscreen">fullscreen</div>
    <div class="menu" :style="{ display: showEditor }">
      <div class="menu-item">
        <select v-model="selectedCmTheme" @change="changeCmTheme">
          <option v-for="theme in cmThemes">{{ theme }}</option>
        </select>
        <select v-model="selectedKeymap" @change="changeKeymap">
          <option>vim</option>
          <option>emacs</option>
          <option>sublime</option>
          <option>default</option>
        </select>
        <select v-model="selectedMode">
          <option>normal</option>
          <option>slide</option>
        </select>
        <select v-model="selectedHljsStyle" @change="changeHljsStyle">
          <option v-for="style in highlightjsStyles">{{ style }}</option>
        </select>
        <select v-model="selectedMdTheme">
          <option v-for="theme in mdThemes">{{ theme }}</option>
        </select>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import axios from 'axios'
import MdParser from './MarkdownParser'
import MdSlideParser from './MarkdownSlideParser'
require('../node_modules/codemirror/mode/markdown/markdown')
require('../node_modules/codemirror/mode/gfm/gfm')
require('../node_modules/codemirror/mode/javascript/javascript')
require('../node_modules/codemirror/mode/python/python')
require('../node_modules/codemirror/mode/rust/rust')
require('../node_modules/codemirror/mode/go/go')
require('../node_modules/codemirror/mode/vue/vue')
require('../node_modules/codemirror/mode/css/css')
require('../node_modules/codemirror/mode/htmlmixed/htmlmixed')
require('../node_modules/codemirror/mode/commonlisp/commonlisp')
require('../node_modules/codemirror/mode/shell/shell')
require('../node_modules/codemirror/mode/jsx/jsx')
require('../node_modules/codemirror/mode/cmake/cmake')
require('../node_modules/codemirror/mode/clike/clike')
require('../node_modules/codemirror/keymap/vim')
require('../node_modules/codemirror/keymap/emacs')
require('../node_modules/codemirror/keymap/sublime')
require('./assets/show-hint-for-emoji.js')
require('./assets/ASCIIMathTeXImg.js')
export default {
  name: 'app',
  data () {
    return {
      cm: null,
      showIndex: 0,
      maxIndex: 0,
      showEditor: 'block',
      selectedMode: 'normal',
      cmThemes: [],
      selectedCmTheme: 'material',
      selectedKeymap: 'default',
      selectedHljsStyle: 'Default',
      highlightjsStyles: [],
      selectedMdTheme: 'default',
      mdThemes: []
    }
  },
  computed: {
    parsed: function() {
      if (this.selectedMode === 'slide') {
        return this.cm ? MdSlideParser(this.cm.getValue()) : ""
      } else {
        return this.cm ? MdParser(this.cm.getValue()) : ""
      }
    }
  },
  methods: {
    moveSlide: function(n) {
      let els = this.$el.querySelectorAll('.slidePage')
      this.maxIndex = els.length
      if (this.showIndex > els.length - 1) this.showIndex = 0
      if (this.showIndex < 0) this.showIndex = els.length - 1
      for (let el of els) {
        el.style.display = 'none'
      }
      els[this.showIndex].style.display = 'block'
    },
    handleFullscreen: function(e) {
      if (this.showEditor === 'block') {
        this.showEditor = 'none'
      } else {
        this.showEditor = 'block'
      }
    },
    changeCmTheme: function() {
      if (this.cm) {
        this.cm.setOption("theme", this.selectedCmTheme)
      }
    },
    changeHljsStyle: function() {
      let els = document.querySelectorAll('link[title]')
      Array.from(els).map((item) => {
        item.disabled = (item.getAttribute('title') !== this.selectedHljsStyle)
      })
    },
    changeKeymap: function() {
      if (this.cm) {
        this.cm.setOption("keyMap", this.selectedKeymap)
      }
    }
  },
  async mounted() {
    // Load and Register codemirror css from index.html by 'link[type]'
    let cmThemeEls = document.querySelectorAll('link[type]')
    this.cmThemes = Array.from(cmThemeEls).map((item) => {
      let url = item.getAttribute('href')
      return url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'))
    })

    // Load and Register highlight.js styles from index.html by 'link[title]'
    let highlightjsStyleEls = document.querySelectorAll('link[title]')
    this.highlightjsStyles = Array.from(highlightjsStyleEls).map((item) => {
      return item.getAttribute('title')
    })

    // Load and Register highlight.js styles from index.html by 'link[title]'
    let mdThemeEls = document.querySelectorAll('link[hreflang]')
    this.mdThemes = Array.from(mdThemeEls).map((item) => {
      let url = item.getAttribute('href')
      return url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'))
    })
    console.log(document.querySelectorAll('link[hreflang]'))

    // Initialize localStorage Key
    let localStorageKey = 'memo-' + this.$router.currentRoute.path.replace('/', '')

    // Create CodeMirror
    this.cm = CodeMirror(this.$el.querySelector('.editor'), {
      mode: 'gfm',
      value: localStorage[localStorageKey],
      theme: 'monokai',
      lineNumbers: true
    })

    //
    // Emoji Complete
    //
    let res = await axios.get('https://api.github.com/emojis')
    if (res.status !== 200) {
      console.warning('github api is dead...woops...')
      return
    }

    let emojiList = []
    for (let key in res.data) {
      emojiList.push({text: `${key}:`, displayText: `<img width="15" height="15" src="${res.data[key]}" alt="icon" async></img> ${key}`})
    }

    let emojiComplete = function(cm) {
      localStorage[localStorageKey] = cm.getValue()
      CodeMirror.showHint(cm, function() {
        let cur = cm.getCursor(), token = cm.getTokenAt(cur)
        let start = token.start, end = cur.ch, word = token.string.slice(0, end - start)
        let ch = cur.ch, line = cur.line
        let currentWord = token.string
        while (ch-- > -1) {
          let t = cm.getTokenAt({ch, line}).string
          if (t === ' ') break
          if (t === ':') {
            let filteredList = emojiList.filter((item) => {
              return item.text.indexOf(currentWord) == 0 ? true : false
            })
            if (filteredList.length > 1) {
              return {
                list: filteredList,
                from: CodeMirror.Pos(line, ch),
                to: CodeMirror.Pos(line, end)
              }
            }
          }
          currentWord = t + currentWord
        }
      }, { completeSingle: false })
    }

    this.cm.on('change', emojiComplete)
  }
}
</script>

<style>
html, body, #editor, #app{
  height: 100%;
}
#editor {
  position: relative;
  display: flex;
  flex-flow: row;
}
.editor {
  flex: 1;
  overflow: scroll;
}
.preview {
  flex: 1;
  background: #fbfbfb;
  overflow: scroll;
}
.CodeMirror {
  font-size: 1rem;
  height: 100%;
}
.markdown-body {
  padding: 1.5rem;
}
.markdown-body ul {
  margin: 1em 0;
  padding-left: 2em;
  list-style-type: disc;
}
.markdown-body ol {
  margin: 1em 0;
  padding-left: 2em;
  list-style-type: decimal;
}
.control-button {
  position: absolute;
  font-size: 2rem;
}
.control-button:hover {
  color: #555;
  font-size: 2.2rem;
}
.control-left {
  bottom: 20px;
  right: 50px;
}
.control-right {
  bottom: 20px;
  right: 10px;
}
.current-page {
  position: absolute;
  font-size: 0.8rem;
  color: #222;
  bottom: 10px;
  left: 10px;
}
.control-fullscreen {
  top: 10px;
  right: 10px;
  color: #f2f2f2;
  font-size: 1rem;
}
.control-fullscreen:hover {
  color: #aaa;
  font-size: 1rem;
}
.menu {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-flow: column wrap;
  z-index: 1000;
}
.menu-item {
  flex: 1;
}
</style>
