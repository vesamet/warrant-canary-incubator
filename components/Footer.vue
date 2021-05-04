<template>
  <div class="main-footer">
    <div class="text-left">
      <span class="separator">▙</span>
      <LinkText :link="cliUrl">CLI version</LinkText>
    </div>
    <div class="text-right">
      <span class="separator">▞</span> Created by
      <LinkText :link="repoUrl">Gwenaël Guyot</LinkText> for CanaryTail
      <span class="separator">░</span>
      <a :href="repoUrl"
        ><v-icon small color="primary" class="mr-2 github-btn"
          >mdi-github</v-icon
        ></a
      >
    </div>
  </div>
</template>

<script>
import LinkText from '@/components/LinkText.vue'
export default {
  components: {
    LinkText,
  },
  data() {
    return {
      repoUrl: 'https://github.com/vesamet/warrant-canary-incubator',
      cliUrl: 'https://github.com/canarytail/client',
    }
  },
}
</script>

<style scoped>
.main-footer {
  background-color: var(--v-secondary-base);
  font-size: 0.8em;
  padding: 4px 0 4px 0;
  color: black;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
}
.separator {
  display: inline-block;
  margin: 0px 4px 0px 4px;
}
.github-btn {
  transition: all 0.2s ease;
}
.github-btn:hover {
  transform: scale(1.2);
}
</style>
