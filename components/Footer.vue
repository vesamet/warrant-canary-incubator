<template>
  <div class="main-footer">
    <span class="separator">▞</span> Created by
    <LinkText :link="repoUrl">Gwenaël Guyot</LinkText> for CanaryTail
    <span class="separator">░</span>
    <a :href="repoUrl"
      ><v-icon small color="primary" class="mr-2 github-btn"
        >mdi-github</v-icon
      ></a
    >
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
    }
  },
}
</script>

<style scoped>
.main-footer {
  background-color: var(--v-secondary-base);
  font-size: 0.8em;
  padding: 4px 0 4px 0;
  text-align: right;
  color: black;
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
