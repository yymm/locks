<template>
  <div id="home">
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
    <!--<div class='setting'>-->
      <!--<h1>Setting</h1>-->
    <!--</div>-->
    <feature-components></feature-components>
    <footer-components></footer-components>
    </div>
  </div>
</template>

<script>
import util from './util'
import Header from './HomeComponents/Header.vue'
import Feature from './HomeComponents/Feature.vue'
import Footer from './HomeComponents/Footer.vue'

export default {
  data() {
    return {
      data: [],
    }
  },
  created() {
    for (let key in localStorage) {
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
    'header-components': Header,
    'feature-components': Feature,
    'footer-components': Footer
  }
}
</script>

<style scoped>
#home {
  font-family: 'Quantico', sans-serif;
  color: #263238;
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
.setting {
  display: flex;
  justify-content: center;
  height: 100px;
  min-height: 100px;
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
