<template>
  <div id="editor">
    <div class="editor" :style="{ display: showEditor }"></div>
    <div class="markdown-body preview" v-html="parsed"></div>
    <div class="control-button control-left"  @click="moveSlide(showIndex--)" v-if="selectedMode === 'slide'">&#10094;</div>
    <div class="control-button control-right" @click="moveSlide(showIndex++)" v-if="selectedMode === 'slide'">&#10095;</div>
    <div class="control-button control-fullscreen" @click="handleFullscreen">fullscreen</div>
    <div class="menu">
      <div class="menu-item">
        <select v-model="selectedTheme" @change="changeTheme">
          <option>abcdef</option>
          <option>ambiance-mobile</option>
          <option>ambiance</option>
          <option>base16-dark</option>
          <option>base16-light</option>
          <option>bespin</option>
          <option>blackboard</option>
          <option>cobalt</option>
          <option>colorforth</option>
          <option>dracula</option>
          <option>duotone-dark</option>
          <option>duotone-light</option>
          <option>eclipse</option>
          <option>elegant</option>
          <option>erlang-dark</option>
          <option>hopscotch</option>
          <option>icecoder</option>
          <option>isotope</option>
          <option>lesser-dark</option>
          <option>liquibyte</option>
          <option>material</option>
          <option>mbo</option>
          <option>mdn-like</option>
          <option>midnight</option>
          <option selected>monokai</option>
          <option>neat</option>
          <option>neo</option>
          <option>night</option>
          <option>panda-syntax</option>
          <option>paraiso-dark</option>
          <option>paraiso-light</option>
          <option>pastel-on-dark</option>
          <option>railscasts</option>
          <option>rubyblue</option>
          <option>seti</option>
          <option>solarized</option>
          <option>the-matrix</option>
          <option>tomorrow-night-bright</option>
          <option>tomorrow-night-eighties</option>
          <option>ttcn</option>
          <option>twilight</option>
          <option>vibrant-ink</option>
          <option>xq-dark</option>
          <option>xq-light</option>
          <option>yeti</option>
          <option>zenburn</option>
          <option>3024-day</option>
          <option>3024-night</option>
        </select>
        <select v-model="selectedKeymap" @change="changeKeymap">
          <option>vim</option>
          <option>emacs</option>
          <option>sublime</option>
          <option selected>default</option>
        </select>
        <select v-model="selectedMode">
          <option>normal</option>
          <option>slide</option>
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
      showEditor: 'block',
      selectedMode: 'normal',
      selectedTheme: 'monokai',
      selectedKeymap: 'default'
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
    changeTheme: function() {
      if (this.cm) {
        console.log(this.selectedTheme)
        this.cm.setOption("theme", this.selectedTheme)
      }
    },
    changeKeymap: function() {
      if (this.cm) {
        this.cm.setOption("keyMap", this.selectedKeymap)
      }
    }
  },
  async mounted() {
    let localStorageKey = 'memo-' + this.$router.currentRoute.path.replace('/', '')
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
