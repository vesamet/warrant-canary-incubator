<template>
  <v-app dark>
    <v-main>
      <v-container class="main-container">
        <Header />
        <div class="main-content">
          <transition name="fade" mode="out-in">
            <nuxt />
          </transition>
        </div>
        <Footer />
      </v-container>
      <notifications group="foo" position="bottom center" :duration="7000" classes="vue-notification mb-12"/>
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {}
  },
}
</script>
<style lang="scss">
html {
  overflow-y: auto;
}
.v-application {
  font-family: $body-font-family, sans-serif !important;
  .title {
    // To pin point specific classes of some components
    font-family: $title-font, sans-serif !important;
  }
}
.main-container {
  position: relative;
  margin: auto;
  overflow: visible;
  max-width: 800px !important;
  margin-top: 90px;
  padding: 0 !important;
  background-color: var(--v-primary-base);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
