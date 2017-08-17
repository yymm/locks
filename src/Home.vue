<template>
  <div id="home">
    <div class='new button' @click="newPage">new</div>
    <div class='item' v-for="(value, key, index) in data" :key="index">
      <router-link :to="key">
        <span class='datetime'>{{ key }}</span>
        <span class='shorthand'>{{ value.text.substr(0, value.text.indexOf('\n')) }}</span>
      </router-link>
      <span class='delete button' @click="deleteData(key)">delete</span>
    </div>
  </div>
</template>

<script>
let formatDate = function (date) {
  let format = 'YYYY-MM-DD-hh-mm-ss'
  format = format.replace(/YYYY/g, date.getFullYear())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  return format
}
export default {
  data() {
    return {
      data: {}
    }
  },
  created() {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.indexOf('memo-') === 0 ) {
        let value = null
        try {
          value = JSON.parse(localStorage[key])
          this.data[key.replace('memo-', '')] = value
        }
        catch(e) {
          localStorage.removeItem(key)
        }
      }
    }
  },
  methods: {
    newPage: function() {
      let datetime = formatDate(new Date(Date.now()))
      this.$router.push(datetime)
      localStorage['memo-' + datetime] = ''
    },
    deleteData: function(key) {
      localStorage.removeItem('memo-' + key)
      this.$delete(this.data, key)
    }
  }
}
</script>

<style scoped>
#home {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding-top: 30px;
}
.new {
  position: absolute;
  top: 10px;
  right: 10px;
}
.item {
  position: relative;
  background: #00AA8D;
  width: 400px;
  height: 80px;
  padding: 20px;
  margin: 10px;
  box-sizing: border-box;
}
.item a {
  text-decoration: none;
}
.datetime {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #eee;
}
.datetime:hover {
  color: #fff;
}
.shorthand {
  position: absolute;
  top: 38px;
  left: 50px;
  font-size: 1.3rem;
  color: #000;
}
.delete {
  position: absolute;
  bottom: 0px;
  right: 0px;
}
.button {
  color: #eee;
  background: #263238;
  padding: 10px;
}
.button:hover {
  background: #37474f;
  color: #fff;
}
</style>
