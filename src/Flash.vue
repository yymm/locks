<template>
  <transition name="flash">
    <div class="flash-container" @click="$emit('flash-close')" :style="{ color: color, background: background }">

      <div class="flash-header">
        <slot name="header">
          default header
        </slot>
      </div>

      <div class="flash-body">
        <slot name="body">
          default body
        </slot>
      </div>

    </div>
  </transition>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#263238'
    },
    background: {
      type: String,
      default: '#049be3'
    }
  },
  created() {
    setTimeout(function() {
      this.$emit('flash-close')
    }.bind(this), 10000)
  }
}
</script>

<style>
.flash-container {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
  padding: 10px;
  transition: all .5s ease;
  cursor: pointer;
  z-index: 9999;
}

.flash-header h3 {
  margin-top: 0;
  font-size: 14px;
  font-weight: 600;
}

.flash-body {
  margin-top: 10px;
  margin-bottom: 2px;
  font-size: 12px;
}

.flash-enter {
  right: -250px;
}

.flash-leave-active {
  right: -250px;
}
</style>
