<template>
  <v-row justify="center" align="center" class="ma-0 pa-0">
    <v-col cols="12">
<Title>Sign</Title>
<v-divider class="my-3" color="white"></v-divider>
<WarrantCreator />
    </v-col>
  </v-row>
</template>

<script>
import WarrantCreator from '@/components/WarrantCreator.vue';
import Title from '@/components/Title.vue';
export default {
  components: {
      WarrantCreator,
      Title
  }
}
</script>
<style scoped>

</style>