<template>
  <div class="settings">
    <div>
      <h4>TextLint <span :class="textlintStatus? 'active' : 'inactive'"></span></h4>
      <label for="textlintUrl">Server URL: </label>
      <input id="textlintUrl" text="text" style="width: 350px;" @keyup.enter="connectTextLintServer($event)" :value="textlintUrl"></input>
      <div v-if="textlintRules.length !== 0">
        <table>
          <tr><th>status</th><th>rule</th><th>config</th></tr>
          <tr v-for="rule in textlintRules">
            <td><input type="checkbox" v-model="rule.status"></input></td>
            <td>{{ rule.name }}</th>
            <td><input type="text" v-model="rule.config"></input></td>
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
      textlintRules: [],
    }
  },
  mounted() {
    // load LocalStorage
    if ('settings-textlint' in localStorage) {
      this.textlintStatus = true
      const data = JSON.parse(localStorage['settings-textlint'])
      this.textlintUrl = data.url
      this.textlintRules = data.rules
    }
  },
  destroyed() {
    this.handshakeTextLintServer()
  },
  methods: {
    connectTextLintServer: async function(e) {
      const url = e.target.value
      try {
        let res = await axios.post(url + '/connect', { message: 'negotiate connection' })
        if (res.data.rules && res.data.rules.length !== 0) {
          this.saveTextLintSetting(url, res.data.rules)
          this.displayFlash('Success to connect', 'TextLint feature enabled!')
        } else {
          this.displayFlash('Error', 'Invalid server...', 'error')
        }
      }
      catch(e) {
        if (e.response) {
          this.displayFlash('Error', `Invalid request. Code: ${e.response.status}`, 'error')
        } else {
          this.displayFlash('Error', 'Server not found.', 'error')
        }
      }
    },
    handshakeTextLintServer: async function() {
      if (!this.textlintStatus) return
      try {
        let res = await axios.post(this.textlintUrl + '/handshake', { message: 'handshake!' })
        if (res.data.rules && res.data.rules.length !== 0) { // At least one rule
          this.saveTextLintSetting(this.textlintUrl, res.data.rules)
        } else {
          this.displayFlash('Error', 'Invalid server...', 'error')
          this.removeTextLintSetting()
        }
      }
      catch(e) {
        if (e.response) {
          this.displayFlash('Error', `Invalid request. Code: ${e.response.status}`, 'error')
        } else {
          this.displayFlash('Error', 'Server has gone.', 'error')
        }
        this.removeTextLintSetting()
      }
    },
    saveTextLintSetting: function(url, rules) {
      this.textlintStatus = true
      this.textlintUrl = url
      if (this.textlintRules.length !== 0) {
        if (this.textlintRules.length === rules.length) {
          for (let i = 0; i < rules.length; i++) {
            if (this.textlintRules[i].name !== rules[i]) {
              // Update new rules
              this.textlintRules = rules.map((v) => { return { name: v, status: false, config: '' } })
              break
            }
          }
        } else {
          // Update new rules
          this.textlintRules = rules.map((v) => { return { name: v, status: false, config: '' } })
        }
      } else {
        // Initialize rules
        this.textlintRules = rules.map((v) => { return { name: v, status: false, config: '' } })
      }
      let config = {}
      for (let rule of this.textlintRules) {
        if (rule.status) {
          if (rule.config.length === 0) {
            config[rule.name] = true
          } else {
            try {
              config[rule.name] = JSON.parse(rule.config)
            }
            catch(e) {
              this.displayFlash('JSON parse error.', e.message, 'error')
              config[rule.name] = true
            }
          }
        }
      }
      console.log({ rules: config })
      localStorage['settings-textlint'] = JSON.stringify({ url: url, rules: this.textlintRules, options: { rules: config } })
    },
    removeTextLintSetting: function() {
      this.textlintStatus = false
      this.textlintUrl = ''
      this.textlintRules = []
      localStorage.removeItem('settings-textlint')
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

table {
  border-collapse: separate;
  border-spacing: 1px;
  text-align: left;
}

table th {
  padding: 10px;
  font-weight: 600;
  vertical-align: top;
  border-bottom: 1px solid #ccc;
}

table td {
  padding: 10px;
  vertical-align: top;
  border-bottom: 1px solid #ccc;
}
</style>
