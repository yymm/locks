<template>
  <div id="public">
    <div :id="selectedMdTheme" class="preview" :class="selectedMode">
      <div class="markdown-body" v-html="parsed" style="box-sizing: border-box; overflow: scroll; height: 100%;"></div>
    </div>
    <div class="control-button control-left"  @click="moveSlide(showIndex--)" v-if="selectedMode.indexOf('slide') === 0">&#10094;</div>
    <div class="control-button control-right" @click="moveSlide(showIndex++)" v-if="selectedMode.indexOf('slide') === 0">&#10095;</div>
    <div class="current-page-index" v-if="selectedMode.indexOf('slide') === 0">{{ `${showIndex+1} / ${maxIndex}`  }}</div>
  </div>
</template>

<script>
require('@/assets/ASCIIMathTeXImg.js')
let LZString = require('@/assets/lz-string.min.js')
import MdParser from '@/parser/md-parser'
import MdSlideParser from '@/parser/md-slide-parser'

export default {
  data() {
    return {
      text: '',
      showIndex: 0,
      maxIndex: 0,
      selectedMdTheme: '',
      selectedMode: '',
      selectedHljsStyle: ''
    }
  },
  computed: {
    parsed: function() {
      if (this.selectedMode.indexOf('slide') === 0) {
        this.$nextTick(function() { this.moveSlide() })
        return MdSlideParser(this.text)
      } else {
        return MdParser(this.text)
      }
    }
  },
  mounted() {
    let raw_data = this.$router.currentRoute.path.split('/').pop()
    console.log(raw_data)
    let data = LZString.decompressFromEncodedURIComponent(raw_data)
    data = JSON.parse(data)
    this.text = data.text
    this.selectedMode = data.options.mode
    this.selectedMdTheme = data.options.mdTheme
    this.selectedHljsStyle = data.options.hljsStyle
    this.changeHljsStyle()
    let title = data.text.split('\n')[0].trim().replace(/^#+\s+/, '')
    document.title = title + ' - Locks'
  },
  methods: {
    changeHljsStyle: function() {
      let els = document.querySelectorAll('link[title]')
      Array.from(els).map((item) => {
        item.disabled = (item.getAttribute('title') !== this.selectedHljsStyle)
      })
    },
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
  }
}
</script>

<style>
html, body, #public, #app, .preview {
  height: 100%;
}
.preview {
  overflow: scroll;
}
</style>
