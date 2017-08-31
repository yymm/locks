<template>
  <div class='header'>
    <div class="header-content" style="justify-content: right;">
      <div class="icon-lock" style="clear: left; float: left;">
        <div class="lock-top-1" style="background-color: #263238"></div>
        <div class="lock-top-2"></div>
        <div class="lock-body" style="background-color: #263238"></div>
        <div class="lock-char">S</div>
      </div>
    </div>
    <div class="header-content">
      <div style="flex: 1;">
        <h1 style="font-size: 64px; font-weight: 600;">Locks</h1>
        <h3 style="margin-top: 10px;">LocalStoraged & Rich Markdown Slide Editor</h3>
        <div style="display: flex; flex-flow: row; align-items: center; margin-top: 30px;">
          <div class='new-button button' @click="$emit('new-page')">{{ Object.keys(this.data).length === 0 ? "Let's start!" : "New" }}</div>
          <div class="meter">
            <div class="meter-label">Used {{ sum }}</div>
            <div class="meter-progress" :style="{ width: (sum / 5 * 200) + 'px' }"></div>
          </div>
          <div style="font-size: 12px; margin-left: 10px; padding-top: 10px;">(Max: 5MB)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['sum', 'data']
}
</script>

<style scoped>
.header {
  position: relative;
  height: 300px;
  min-height: 300px;
  display: flex;
  flex-flow: row;
}
.header-content {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.new-button {
  color: #eee;
  background: #263238;
  padding: 10px;
  cursor: pointer;
}
.new-button:hover {
  background: #37474f;
  color: #fff;
}
/*
 * icon-lock
 * https://codepen.io/msaetre/pen/rtakL
 */
.icon-lock {
  width: 250px;
  height: 250px;
  position: relative;
  overflow: hidden;
  margin-left: 25px;
  margin-bottom: 25px;
}
.icon-lock .lock-top-1 {
  width: 40%;
  height: 40%;
  position: absolute;
  left: 50%;
  margin-left: -20%;
  top: 16%;
  background-color: #000;
  border-radius: 40%;
}
.icon-lock .lock-top-2 {
  width: 24%;
  height: 40%;
  position: absolute;
  left: 50%;
  margin-left: -12%;
  top: 24%;
  background-color: #fff;
  border-radius: 25%;
}
.icon-lock .lock-body {
  width: 60%;
  height: 48%;
  position: absolute;
  left: 50%;
  margin-left: -30%;
  bottom: 11%;
  background-color: #000;
  border-radius: 15%;
}
.icon-lock .lock-hole {
  width: 16%;
  height: 16%;
  position: absolute;
  left: 50%;
  margin-left: -8%;
  top: 51%;
  border-radius: 100%;
  background-color: #151517;
  /* background-color: #2CC3B5; */
}
.icon-lock .lock-hole:after {
  content: "";
  width: 43%;
  height: 78%;
  position: absolute;
  left: 50%;
  margin-left: -20%;
  top: 100%;
  background-color: inherit;
  /* background-color: #2CC3B5; */
}
.lock-char {
  width: 16%;
  height: 16%;
  position: absolute;
  left: 45%;
  margin-left: -6%;
  top: 49%;
  color: #fff;
  font-weight: 700;
  font-size: 80px;
}
/*
 * meter
 */
.meter {
  position: relative;
  height: 30px;
  width: 200px;
  border: 1px solid #61cafc;
  border-radius: 2px;
  margin-left: 50px;
}
.meter-label {
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 5px;
  line-height: 28px;
  z-index: 5;
}
.meter-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  background: #61cafc;
}
</style>
