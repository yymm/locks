<template>
  <div id="home" @click.alt.shift.meta="showSettings = !showSettings">
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
    <modal class='settings' v-if="showSettings" @modal-close="showSettings = false" width="400px">
      <h3 slot="header">Settings</h3>
      <div slot="body">
        <h4>TextLint <span :class="textlintSettings ? 'active' : 'inactive'"></span></h4>
        <label for="textlintUrl">Server URL: </label>
        <input id="textlintUrl" text="text" style="width: 250px;" @keyup.enter="checkTextLintServer"></input>
        <div v-if="textlintSettings"></div>
      </div>
    </modal>
    </div>
  </div>
</template>

<script>
import util from './util'
import Header from './HomeComponents/Header.vue'
import Feature from './HomeComponents/Feature.vue'
import Footer from './HomeComponents/Footer.vue'
import Modal from './ModalDialog.vue'

export default {
  data() {
    return {
      data: [],
      showSettings: false,
      textlintSettings: null
    }
  },
  created() {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.match(/^settings$/)) {
        console.log('Setting found.')
      } else {
        console.log('Setting not found.')
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
    }
  },
  components: {
    'modal': Modal,
    'header-components': Header,
    'feature-components': Feature,
    'footer-components': Footer
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
.active {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  background: #9be304;
  display: inline-block;
  border-radius: 5px;
  animation: active 1s linear 0s infinite alternate none running;
}

@keyframes active {
  0% { transform: scale(1.0); }
  20% { transform: scale(1.1); }
  40% { transform: scale(1.2); }
  60% { transform: scale(1.3); }
  80% { transform: scale(1.4); }
  100% { transform: scale(1.5); }
}

.inactive {
  display: inline-block;
  width: 10px;
  height: 2px;
  margin-left: 5px;
  background: #e34c04;
  transform: rotate(45deg);
  margin: 5px auto;
}

.inactive:after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: inherit;
  transform: rotate(90deg);
}
</style>
