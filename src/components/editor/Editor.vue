<template>
  <div id="editor">
    <div class="editor" :style="{ display: showEditor }"></div>
    <div :id="selectedMdTheme" class="preview" :class="selectedMode">
      <div class="slide-controls">
        <div class="markdown-body" v-html="parsed"></div>
        <div class="control-button control-left"  @click="moveSlide(showIndex--)" v-if="selectedMode.indexOf('slide') === 0">&#10094;</div>
        <div class="control-button control-right" @click="moveSlide(showIndex++)" v-if="selectedMode.indexOf('slide') === 0">&#10095;</div>
        <div class="current-page-index" v-if="selectedMode.indexOf('slide') === 0">{{ `${showIndex+1} / ${maxIndex}`  }}</div>
        <div class="control-button control-fullscreen" @click="handleFullscreen">fullscreen</div>
      </div>
      <div v-if="showTextLint" class="textlint">
        <div class="textlint-controls">
          <div style="position: relative;">
            <img width="25" src="https://textlint.github.io/img/textlint-icon_256x256.png"></img>
            <span class="textlint-header-button" style="left: 50px; color: #9be304;" @click="fixByTextLint">✔ Fix</span>
            <span class="textlint-header-button" style="left: 120px; color: #bbb;" @click="showTextLint = false">✖ Close</span>
          </div>
        </div>
        <table>
          <tr v-for="message in textlintMessages" :title="message.rule">
            <td>{{ message.lc }}</td>
            <td style="color: #9be304;">{{ message.fix ? '✔' : ''}}</td>
            <td>{{ message.text }}</td>
          </tr>
        </table>
      </div>
    </div>
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
        <select v-model="selectedMode" @change="changeMode">
          <option>normal</option>
          <option>slide</option>
          <option>slide-center</option>
        </select>
        <select v-model="selectedHljsStyle" @change="changeHljsStyle">
          <option v-for="style in highlightjsStyles">{{ style }}</option>
        </select>
        <select v-model="selectedMdTheme" @change="changeMdTheme">
          <option v-for="theme in mdThemes">{{ theme }}</option>
        </select>
        <button @click="clickPublicLinkButton">Public Link</button>
        <modal v-if="showPublicLinkModal" @modal-close="showPublicLinkModal = false">
          <h3 slot="header">Public Link</h3>
          <input type="text" style="width: 250px;" slot="body" :value="publicLinkUrl" readonly></input>
        </modal>
      </div>
    </div>
    <flash v-if="showFlash" @flash-close="showFlash = false" :color="flashItem.color" :background="flashItem.background">
      <h3 slot="header">{{ flashItem.header }}</h3>
      <p slot="body">{{ flashItem.body }}</p>
    </flash>
  </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import axios from 'axios'
import MdParser from '@/parser/md-parser'
import MdSlideParser from '@/parser/md-slide-parser'
import Modal from '@/components/common/ModalDialog.vue'
import Flash from '@/components/common/Flash.vue'
require('../../../node_modules/codemirror/mode/markdown/markdown')
require('../../../node_modules/codemirror/mode/gfm/gfm')
require('../../../node_modules/codemirror/mode/javascript/javascript')
require('../../../node_modules/codemirror/mode/python/python')
require('../../../node_modules/codemirror/mode/rust/rust')
require('../../../node_modules/codemirror/mode/go/go')
require('../../../node_modules/codemirror/mode/vue/vue')
require('../../../node_modules/codemirror/mode/css/css')
require('../../../node_modules/codemirror/mode/htmlmixed/htmlmixed')
require('../../../node_modules/codemirror/mode/commonlisp/commonlisp')
require('../../../node_modules/codemirror/mode/shell/shell')
require('../../../node_modules/codemirror/mode/jsx/jsx')
require('../../../node_modules/codemirror/mode/cmake/cmake')
require('../../../node_modules/codemirror/mode/clike/clike')
require('../../../node_modules/codemirror/keymap/vim')
require('../../../node_modules/codemirror/keymap/emacs')
require('../../../node_modules/codemirror/keymap/sublime')
require('../../../node_modules/codemirror/addon/fold/foldcode.js')
require('../../../node_modules/codemirror/addon/fold/foldgutter.js')
require('../../../node_modules/codemirror/addon/fold/markdown-fold.js')
require('../../../node_modules/codemirror/addon/fold/brace-fold.js')
require('../../../node_modules/codemirror/addon/lint/lint.js')
require('@/assets/show-hint-for-emoji.js')
require('@/assets/ASCIIMathTeXImg.js')
let LZString = require('@/assets/lz-string.min.js')

export default {
  name: 'app',
  data () {
    return {
      cm: null,
      localStorageKey: '',
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
      mdThemes: [],
      overwrapMode: false,
      showPublicLinkModal: false,
      showFlash: false,
      flashItem: {header: '', body: '', color: '#263238', background: '#049be3'},
      publicLinkUrl: '',
      showTextLint: false,
      textlintMessages: [],
    }
  },
  computed: {
    parsed: function() {
      if (this.selectedMode.indexOf('slide') === 0) {
        this.$nextTick(function() { this.moveSlide() })
        return this.cm ? MdSlideParser(this.cm.getValue()) : ""
      } else {
        return this.cm ? MdParser(this.cm.getValue()) : ""
      }
    }
  },
  methods: {
    moveSlide: function(n) {
      let els = this.$el.querySelectorAll('.slide-page')
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
        this.saveLocalstorage()
      }
    },
    changeHljsStyle: function() {
      let els = document.querySelectorAll('link[title]')
      Array.from(els).map((item) => {
        item.disabled = (item.getAttribute('title') !== this.selectedHljsStyle)
        this.saveLocalstorage()
      })
    },
    changeKeymap: function() {
      if (this.cm) {
        this.cm.setOption("keyMap", this.selectedKeymap)
        this.saveLocalstorage()
      }
    },
    changeMode: function() {
      this.saveLocalstorage()
    },
    changeMdTheme: function() {
      this.saveLocalstorage()
    },
    saveLocalstorage: function() {
      if (this.cm) {
        let data = {
          text: this.cm.getValue(),
          options: {
            cmTheme: this.selectedCmTheme,
            mode: this.selectedMode,
            keymap: this.selectedKeymap,
            hljsStyle: this.selectedHljsStyle,
            mdThemes: this.selectedMdTheme
          }
        }
        localStorage[this.localStorageKey] = JSON.stringify(data)
      }
    },
    clickPublicLinkButton: async function() {
      let str = 'Hello World!'
      let data = {
        text: this.cm.getValue(),
        options: {
          mode: this.selectedMode,
          hljsStyle: this.selectedHljsStyle,
          mdTheme: this.selectedMdTheme
        }
      }

      let compress = LZString.compressToEncodedURIComponent(JSON.stringify(data))
      let publicLinkUrl = location.href.split('#')[0] + '#/public/' + compress

      try {
        let res = await axios.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyB72MwS3skhkKcieqZWChBaPtJPeVVcsR8', { longUrl: publicLinkUrl })
        this.publicLinkUrl = res.data.id
      }
      catch(e) {
        if (e.response.status === 400) {
          console.log('MESSAGE: ' + e.response.data.error.message)
          this.displayFlash('Warning', 'Text data is too long... Google URL Shortener API failed...', 'warning')
        } else {
          console.log('Google URL Shortener API is dead.. Oops...')
          console.log('MESSAGE: ' + e.response.data.error.message)
        }
        return
      }

      this.showPublicLinkModal = true
    },
    fixByTextLint: async function() {
      try {
        let data = JSON.parse(localStorage['settings-textlint'])
        let res = await axios.post(data.url + '/fix', { text: this.cm.getValue(), options: data.options })
        if (res.data.error) {
          console.log(res.data.error)
          this.displayFlash('TextLint Server Error', res.data.error, 'error')
        } else {
          this.cm.setValue(res.data.fix)
          this.displayFlash('TextLint', 'Automatically fix succeeded!')
        }
      }
      catch(e) {
        console.log('Server has gone...', e)
      }
    },
    displayFlash: function(header, body, style = 'info') {
      this.flashItem.header = header
      this.flashItem.body = body
      this.flashItem.background = '#049be3'
      this.flashItem.color = '#263238'
      if (style === 'warning') {
        this.flashItem.background = '#e38f04'
        this.flashItem.color = '#986003'
      }
      if (style === 'error') {
        this.flashItem.background = '#fb7738'
        this.flashItem.color = '#983303'
      }
      this.showFlash = true
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

    // Check TextLint feature
    if ('settings-textlint' in localStorage) {
      this.showTextLint = true
      CodeMirror.registerHelper('lint', 'markdown', async function(text) {
        let found = []
        this.textlintMessages = []
        let data = JSON.parse(localStorage['settings-textlint'])
        try {
          let res = await axios.post(data.url + '/lint', { text: text, options: data.options })
          if (res.data.error) {
            console.log(res.data.error)
            this.displayFlash('TextLint Server Error', res.data.error, 'error')
            return found
          }
          this.textlintMessages = res.data.json.map((v) => {
            return {
              lc: `${v.line}:${v.column}`,
              severity: v.severity === 1 ? 'warning' : 'error',
              text: v.message,
              rule: v.ruleId,
              fix: 'fix' in v
            }
          })
          for (let message of res.data.json) {
            found.push({
              from: CodeMirror.Pos(message.line-1, message.column-1),
              to: CodeMirror.Pos(message.line-1, message.column),
              message: message.message,
              severity: message.severity === 1 ? 'warning' : 'error',
            })
          }
        }
        catch(e) {
          console.log('Server has gone...', e)
        }
        return found
      }.bind(this))
    }

    // Initialize localStorage Key
    this.localStorageKey = 'memo-' + this.$router.currentRoute.path.split('/').pop()

    // if storage existed, change editor state
    let storage = JSON.parse(localStorage[this.localStorageKey] || 'null')
    if (storage) {
      this.selectedCmTheme = storage.options.cmTheme
      this.selectedMode= storage.options.mode
      this.selectedKeymap = storage.options.keymap
      this.selectedHljsStyle = storage.options.hljsStyle
      this.selectedMdTheme = storage.options.mdThemes
    }

    // Create CodeMirror
    this.cm = CodeMirror(this.$el.querySelector('.editor'), {
      mode: 'gfm',
      value: storage ? storage.text : '',
      theme: storage ? storage.options.cmTheme : this.selectedCmTheme,
      lineNumbers: true,
      foldGutter: true,
      gutters: this.showTextLint ? ["CodeMirror-lint-markers", "CodeMirror-foldgutter"] : ["CodeMirror-foldgutter"],
      lint: this.showTextLint
    })

    // for Mobile
    var userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('iphone') != -1 || userAgent.indexOf('ipad') != -1) {
      const origOnKeyPress = this.cm.display.input.onKeyPress
      this.cm.display.input.onKeyPress = function(e) {
        if(e.which >= 0x10000) {
          return
        }

        if(!this.cm.display.input.composing) {
          this.cm.keyPressTimer = setTimeout( () => {
            origOnKeyPress.call(this, e)
          }, 30)
        }
      }

      const inputArea = this.cm.display.input.div || this.cm.display.input.textarea
      inputArea.addEventListener('compositionstart', (_cm, e) => {
        if(this.cm.keyPressTimer) {
          clearTimeout(this.cm.keyPressTimer)
        }
      }, false)

      const inputField = this.cm.display.input.getField()
      window.addEventListener('keydown', function(e){
        if(e.target == inputField && this.cm.display.input.composing) {
          e.stopPropagation()
        }
      }, true)

      inputField.addEventListener('blur', function(e){
        if(e.relatedTarget) {
          return
        }
        e.stopPropagation()

        if (this.cm.display.input.composing) {
          inputField.focus()
          setTimeout(function(){
            inputField.blur()
          }, 1)
        }
      }, false)
    }

    //
    // Emoji Complete
    //
    let res = await axios.get('https://api.github.com/emojis')
    if (res.status !== 200) {
      console.log('Axios Error: github api is dead...woops...')
      return
    }

    let emojiList = []
    for (let key in res.data) {
      emojiList.push({text: `${key}:`, displayText: `<img width="15" height="15" src="${res.data[key]}" alt="icon" async></img> ${key}`})
    }

    let emojiComplete = function(cm) {
      // Save localStorage at editing everytime
      this.saveLocalstorage()
      // Emoji complete
      CodeMirror.showHint(cm, function() {
        let cur = cm.getCursor(), token = cm.getTokenAt(cur)
        let start = token.start, end = cur.ch, word = token.string.slice(0, end - start)
        let ch = cur.ch, line = cur.line
        let currentWord = token.string
        while (ch-- > -1) {
          let t = cm.getTokenAt({ch, line}).string
          if (t === ':') {
            let filteredList = emojiList.filter((item) => {
              return item.text.indexOf(currentWord) == 0 ? true : false
            })
            if (filteredList.length >= 1) {
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

    this.cm.on('change', emojiComplete.bind(this))
  },
  components: {
    'modal': Modal,
    'flash': Flash
  }
}
</script>

<style>
html, body, #editor, #app {
  height: 100%;
}
#editor {
  position: relative;
  display: flex;
  flex-flow: row;
  overflow: hidden;
}
.editor {
  flex: 1;
}
.preview {
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  overflow-y: scroll;
}
.CodeMirror {
  font-size: 1rem;
  height: 100%;
}
.control-fullscreen {
  top: 10px;
  right: 10px;
  color: black;
  opacity: 0.3;
  font-size: 1rem;
}
.control-fullscreen:hover {
  opacity: 1;
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
.normal {
  padding-top: 24px;
}
.textlint {
  max-height: 300px;
  min-height: 300px;
  background: #263238;
  color: #9fb4be;
  overflow: scroll;
  position: relative;
}
.textlint table {
  width: 100%;
  margin-top: 45px;
  padding: 10px;
}
.textlint td {
  border-bottom: 1px solid #5e7b8a;
  padding: 5px 15px;
  line-height: 24px;
}
.textlint tr:hover {
  background: #36474f;
}
.textlint-header-button {
  position: absolute;
  top: 2px;
  border: 1px solid #263238;
  border-radius: 3px;
  padding: 5px;
  padding-bottom: 2px;
  background: #263238;
  cursor: pointer;
}
.textlint-header-button:hover {
  background: #3e515b;
}
.slide-controls {
  position: relative;
  height: 100%;
}
.markdown-body {
  box-sizing: border-box;
  height: 100%;
}
.textlint-controls {
  position: fixed;
  width: 200px;
  background: #9fb4be;
  color: #263238;
  padding: 5px;
}
</style>
