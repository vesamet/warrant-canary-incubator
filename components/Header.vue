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
        <LinkText link="https://canarytail.org">CanaryTail</LinkText> standard.
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
  min-height: 160px;
  margin-bottom: 0px;
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

@media only screen and (max-width: 924px) {
  .tabbed {
  margin-left: 10px;
  margin-right: 10px;
  padding-bottom: 10px;
  }
}
</style>
