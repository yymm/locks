<template>
  <div id="home" @click.shift="showSettings = !showSettings">
    <header-components :data="data" :sum="sum" v-on:new-page="newPage"></header-components>
    <div class='workspace'>
      <div class="empty" v-if="data.length === 0">
        No Data...
      </div>
      <div class='item' v-for='(value, index) in data'>
        <router-link :to="'editor/' + value.datetime">
          <span class='datetime'>{{ value.datetime }}</span>
          <span class='shorthand'>{{ value.shorthand }}</span>
        </router-link>
        <span class='size'>{{ value.size_read }}</span>
        <span class='delete-button button' @click="deleteData(value.datetime, index)">delete</span>
      </div>
    </div>
    <feature-components></feature-components>
    <footer-components></footer-components>
    <modal v-if="showSettings" @modal-close="showSettings = false" width="500px">
      <h3 slot="header">Settings</h3>
      <settings slot="body" :displayFlash="displayFlash"></settings>
    </modal>
    <flash v-if="showFlash" @flash-close="showFlash = false" :color="flashItem.color" :background="flashItem.background">
      <h3 slot="header">{{ flashItem.header }}</h3>
      <p slot="body">{{ flashItem.body }}</p>
    </flash>
  </div>
</template>

<script>
import util from './util'
import Header from './Header.vue'
import Feature from './Feature.vue'
import Footer from './Footer.vue'
import Settings from './Settings.vue'
import Modal from '../common/ModalDialog.vue'
import Flash from '../common/Flash.vue'

export default {
  data() {
    return {
      data: [],
      showSettings: false,
      showFlash: false,
      flashItem: {header: '', body: '', color: '#263238', background: '#049be3'}
    }
  },
  created() {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.match(/^settings-[a-z]+$/)) {
        continue
      }
      if (localStorage.hasOwnProperty(key) && key.indexOf('memo-') === 0 ) {
        let value = null
        try {
          value = JSON.parse(localStorage[key])
          let size_bytes = util.memorySizeOf(value)
          value['datetime'] = key.replace('memo-', '')
          value['size_bytes'] = size_bytes
          value['size_read'] = util.formatByteSize(size_bytes)
          value['shorthand'] = value.text.substr(0, value.text.indexOf('\n'))
          this.data.push(value)
        }
        catch(e) {
          // JSON.parse Error
          localStorage.removeItem(key)
        }
      }
    }
    this.data.sort((a, b) => { return a.datetime < b.datetime; })
  },
  computed: {
    sum() {
      let sum = 0;
      if (this.data) {
        sum = this.data.reduce((prev, curr) => {
          return prev + curr.size_bytes
        }, 0)
      }
      return util.formatMiByteSize(sum)
    }
  },
  methods: {
    newPage: function() {
      let datetime = util.formatDate(new Date(Date.now()))
      localStorage['memo-' + datetime] = ''
      this.$router.push('editor/' + datetime)
    },
    deleteData: function(key, index) {
      localStorage.removeItem('memo-' + key)
      this.data.splice(index, 1)
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
  components: {
    'header-components': Header,
    'feature-components': Feature,
    'footer-components': Footer,
    'modal': Modal,
    'settings': Settings,
    'flash': Flash
  }
}
</script>

<style scoped>
#home {
  position: relative;
  font-family: 'Quantico', sans-serif;
  color: #263238;
  height: 100%;
  overflow: scroll;
}
.workspace {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: flex-start;
  width: 1200px;
  min-width: 1200px;
  height: auto;
  min-height: 250px;
  margin: auto;
  padding-top: 30px;
}
.item {
  position: relative;
  background: #049be3;
  width: 400px;
  height: 87px;
  padding: 20px;
  margin: 20px 50px;
  box-sizing: border-box;
  overflow: hidden;
}
.empty {
  padding-top: 85px;
  font-size: 64px;
  color: #c2cfd6;
}
.item a {
  text-decoration: none;
}
.datetime {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #eee;
  font-size: 18px;
}
.shorthand {
  position: absolute;
  top: 35px;
  left: 15px;
  font-size: 24px;
  color: #263238;
  max-width: 310px;
}
.size {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  color: #9be304;
}
.delete-button {
  color: #eee;
  background: #263238;
  position: absolute;
  bottom: 0px;
  right: 0px;
  padding: 10px;
}
.delete-button:hover {
  background: #37474f;
  color: #fff;
}
</style>
