<template>
  <a :href="link" target="_blank"><slot /></a>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: '#',
    },
  },
}
</script>

<style scoped>
a {
  display: inline-block;
  background-color: var(--v-info-lighten1);
  color: black !important;
  transition: all 0.2s ease;
  padding-left: 2px;
  padding-right: 2px;
  text-decoration: none;
  border-radius: 4px;
}
a:hover {
  background-color: var(--v-info-lighten2);
  text-decoration: underline;
}
</style>
