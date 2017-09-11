<template>
  <div class="settings">
    <div>
      <h4>TextLint <span :class="textlintStatus? 'active' : 'inactive'"></span></h4>
      <label for="textlintUrl">Server URL: </label>
      <input id="textlintUrl" text="text" style="width: 250px;" @keyup.enter="connectTextLintServer($event)" value="http://localhost:5000"></input>
      <div v-if="textlintRules">
        <table>
          <tr><th>status</th><th>rule</th><th>config</th></tr>
          <tr v-for="(rule, key) in textlintRules">
            <th><input type="checkbox" v-model="rule.status"></input></th>
            <th>{{ key }}</th>
            <th><input type="text" v-model="JSON.stringify(rule.config)"</th>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  props: {
    displayFlash: {
      type: Function
    }
  },
  data() {
    return {
      textlintStatus: false,
      textlintUrl: '',
      textlintRules: {},
    }
  },
  methods: {
    connectTextLintServer: async function(e) {
      const url = e.target.value
      try {
        let res = await axios.post(url + '/connect', { message: 'negotiate connection' })
        if (res.data.message) {
          this.textlintUrl = url
          this.handshakeTextLintServer()
        } else {
          this.displayFlash('Error', 'Invalid server...', 'error')
        }
      }
      catch(e) {
        this.displayFlash('Error', `Invalid request. Code: ${e.response.status}`, 'error')
      }
    },
    handshakeTextLintServer: async function() {
      try {
        let res = await axios.post(this.textlintUrl + '/handshake', { message: 'handshake!' })
        console.log(res)
        let rules = {};
        for (let rule in res.data.list) {
          rules[rule] = { status: false, config: {} }
        }
        console.log(rules)
        this.textlintRules = rules
        this.textlintStatus = true
      }
      catch(e) {
        this.displayFlash('Error', `Invalid request. Code: ${e.response.status}`, 'error')
        this.textlintStatus = false
      }
    },
    saveTextLintSetting: function() {
      if (this.textlintStatus) {
        const data = {
          textlint: {
            url: this.textlintUrl,
            rules: this.textlintRules,
            textlintConfig: this.textlintConfig
          }
        }
        localStorage['settings-textlint'] = JSON.stringify(data)
      }
    }
  }
}
</script>

<style scoped>
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
