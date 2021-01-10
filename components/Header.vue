<template>
  <div class="secondary black--text main-header">
    <Logo />
    <div class="tabbed">
      <h1>Warrant Canary <span>Incubator</span></h1>
      <v-divider class="my-2 black"></v-divider>
      <p>
        A tool to sign &amp; validate
        <LinkText link="https://en.wikipedia.org/wiki/Warrant_canary"
          >warrant canaries</LinkText
        >
        in compliance with
        <LinkText link="https://canarytail.org">CanaryTrail</LinkText> standard.
      </p>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue'
import LinkText from '@/components/LinkText.vue'
export default {
  components: {
    Logo,
    LinkText,
  },
}
</script>

<style scoped>
.main-header {
  position: relative;
  overflow: visible;
  min-height: 180px;
  margin-bottom: 20px;
  padding-top: 20px;
}
h1 {
  font-size: 2em;
  font-weight: 900;
}
h1 span {
  font-size: 0.5em;
  font-weight: 900;
}
.tabbed {
  margin-left: 150px;
  margin-right: 50px;
}
</style>
