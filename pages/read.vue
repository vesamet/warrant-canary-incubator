<template>
  <v-row justify="center" align="center" class="ma-0 pa-0">
    <v-col cols="12">
      <Title>Validate</Title>
      <v-divider class="my-3" color="white"></v-divider>
      <WarrantReader />
    </v-col>
  </v-row>
</template>

<script>
import WarrantReader from '@/components/WarrantReader.vue'
import Title from '@/components/Title.vue'
export default {
  components: {
    WarrantReader,
    Title,
  },
}
</script>
<style scoped></style>
