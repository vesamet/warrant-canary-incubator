<template>
  <div class="title-box">
    <div class="prefix">░</div>
    <div>
      <h2
        class="title"
        :class="dark ? 'dark' : ''"
        :style="bg ? `background-color: ${bg};` : ''"
      >
        <slot />
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    bg: { type: String, default: '' },
  },
}
</script>

<style scoped>
.title-box {
  text-align: center;
  width: 100%;
  display: grid;
  grid-template-columns: min-content min-content;
  grid-auto-rows: min-content;
  justify-items: center;
  justify-content: center;
  align-items: center;
  grid-gap: 5px;
  margin-top: 10px;
  margin: auto;
}

.prefix {
  font-size: 1.6em;
}
.title {
  color: #121212;
  padding-top: 0px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: white;
}
.title.dark {
  color: white;
  background-color: #121212;
}
</style>
