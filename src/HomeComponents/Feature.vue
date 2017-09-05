<template>
  <div class="feature">
    <div class="title">
      <h1 style="font-size: 48px;">Feature</h1>
    </div>
    <div class="container">
      <div class="contents">
        <div class="item" style="width: 400px; margin-top: 50px;">
          <h3>LocalStoraged</h3>
          <ul style="margin-bottom: 0;"><li><span style="color: #049be3;">Anyone available!</span><ul class="localstoraged-ul"><li>
            <span>Anyone can use, if you access here.</span>
          </li></ul></li></ul>
          <ul style="margin-bottom: 0; margin-top: 0;"><li><span style="color: #049be3;">Safe</span><ul class="localstoraged-ul"><li>
            <span>Data stored in your device, don't worry leak.</span>
          </li></ul></li></ul>
          <ul style="margin-top: 0;"><li><span style="color: #049be3;">Fast</span><ul class="localstoraged-ul"><li>
            <span>Less network communication.</span>
          </li></ul></li></ul>
        </div>
      </div>
      <div class="contents">
        <div class="item">
          <h3>Mode</h3>
          <ul><li v-for="v in mode">
            <span v-if="v.link"><a target="_blank" :href="v.link">{{ v.text }}</a></span>
            <span v-else>{{ v.text }}</span>
          </li></ul>
        </div>
        <div class="item">
          <h3>Editor</h3>
          <ul><li v-for="v in editor">
            <span v-if="v.link"><a target="_blank" :href="v.link">{{ v.text }}</a></span>
            <span v-else>{{ v.text }}</span>
          </li></ul>
        </div>
      </div>
      <div class="contents">
        <div class="item">
          <h3>Parser</h3>
          <ul><li v-for="v in parser">
            <span v-if="v.link"><a target="_blank" :href="v.link">{{ v.text }}</a></span>
            <span v-else>{{ v.text }}</span>
          </li></ul>
        </div>
        <div class="item">
          <h3>Themes</h3>
          <ul><li v-for="v in theme">
            <span v-if="v.link"><a target="_blank" :href="v.link">{{ v.text }}</a></span>
            <span v-else>{{ v.text }}</span>
          </li></ul>
        </div>
      </div>
      <div class="contents">
        <div class="item">
          <h3>TODO</h3>
          <ul style="list-style-type: none;"><li v-for="v in todo">
            <span><input type="checkbox" v-model="v.done" disabled></input>{{ v.text }}</span>
          </li></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let mode = [
  { text: 'slide' },
  { text: 'slide (centering)' },
  { text: 'normal (simple markdown)' },
  { text: 'Fullscreen available all mode' },
]
let editor = [
  { text: 'powerd by CodeMirror', link: 'https://codemirror.net/' },
  { text: 'GFM' },
  { text: 'auto save (also theme & mode)' },
  { text: 'realtime preview' },
  { text: 'fenced code highlighting' },
  { text: 'emoji complete' },
  { text: 'mode (vim/emacs/sublime)' },
  { text: 'folding' },
]
let parser = [
  { text: 'powered by MarkdownIt', link: 'https://github.com/markdown-it/markdown-it' },
  { text: 'markdown-it-emoji', link: 'https://www.npmjs.com/package/markdown-it-emoji' },
  { text: 'markdown-it-asciimath', link: 'https://www.npmjs.com/package/markdown-it-asciimath' },
  { text: 'markdown-it-highlightjs', link: 'https://www.npmjs.com/package/markdown-it-highlightjs' },
  { text: 'markdown-it-sub', link: 'https://www.npmjs.com/package/markdown-it-sub' },
  { text: 'markdown-it-sup', link: 'https://www.npmjs.com/package/markdown-it-sup' },
  { text: 'markdown-it-ins', link: 'https://www.npmjs.com/package/markdown-it-ins' },
  { text: 'markdown-it-mark', link: 'https://www.npmjs.com/package/markdown-it-mark' },
  { text: 'markdown-it-deflist', link: 'https://www.npmjs.com/package/markdown-it-deflist' },
  { text: 'markdown-it-container', link: 'https://www.npmjs.com/package/markdown-it-container' },
  { text: 'markdown-it-block-embed', link: 'https://www.npmjs.com/package/markdown-it-block-embed' },
  { text: 'markdown-it-imsize', link: 'https://www.npmjs.com/package/markdown-it-imsize' },
  { text: 'markdown-it-task-lists', link: 'https://www.npmjs.com/package/markdown-it-task-lists' },
  { text: 'markdown-it-playground', link: 'https://www.npmjs.com/package/markdown-it-playground' },
  { text: 'markdown-it-smartarrows', link: 'https://www.npmjs.com/package/markdown-it-smartarrows' },
  { text: 'markdown-it-link-attributes', link: 'https://www.npmjs.com/package/markdown-it-link-attributes' },
]
let theme = [
  { text: 'default (github)' },
  { text: 'flask', link: 'http://flask.pocoo.org/' },
  { text: 'iceberg', link: 'http://cocopon.me/app/vim-iceberg/' },
  { text: 'noto', link: 'https://www.google.com/get/noto/' },
  { text: 'presentation' },
  { text: 'vscode', link: 'https://github.com/raycon/vscode-markdown-css' },
  { text: 'vue', link: 'https://jp.vuejs.org/index.html' },
  { text: 'locks' },
]
let todo = [
  { text: 'Feat: Sync other device', done: false },
  { text: 'Feat: Generate public link', done: true },
  { text: 'Feat: Generate raw html', done: false },
]

export default {
  data() {
    return {
      mode: mode,
      editor: editor,
      parser: parser,
      theme: theme,
      todo: todo
    }
  }
}
</script>

<style scoped>
.feature {
  position: relative;
  width: 900px;
  min-width: 900px;
  height: auto;
  min-height: 300px;
  padding-top: 100px;
  margin: auto;
}
.title {
  display: flex;
  justify-content: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.contents {
  display: flex;
  flex-flow: row;
}
.item {
  width: 300px;
  min-width: 300px;
  margin: auto;
  padding: 30px 20px 0px 100px;
}
h3 {
  font-size: 24px;
  padding-bottom: 4px;
  border-bottom: 1px solid #263238;
}
ul {
  margin: 1em 0;
  padding-left: 2em;
  list-style-type: disc;
}
li {
  padding-bottom: 3px;
}
a {
  text-decoration: none;
  color: #708f9e;
}
a:hover {
  color: #61cafc;
}
.localstoraged-ul {
  margin: 0.3em 0 0.6em;
  padding-left: 0.5em;
}
.localstoraged-ul li {
  list-style-type: none;
}
</style>
