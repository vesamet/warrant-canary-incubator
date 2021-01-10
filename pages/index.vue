<template>
  <v-row justify="center" align="center" class="ma-0 pa-0">
    <v-col cols="12">
      <v-row class="mb-3" justify="center" align="center">
        <v-col cols="5" class="text-center">
          <v-btn
            color="black"
            class="action-button mt-5"
            @click="$router.push({ path: '/read' })"
          >
            <Title class="px-2" dark bg="transparent">Validate</Title>
          </v-btn>
          <img
            src="@/assets/img/canary-read.png"
            alt="Image of a canary intercepting a warrant canary."
            class="action-image-read"
          />
        </v-col>
        <v-col cols="5" class="text-center">
          <img
            src="@/assets/img/canary-create.png"
            alt="Image of a canary writing a warrant canary."
            class="action-image-create"
          />
          <v-btn
            color="black"
              class="action-button mt-5"
            @click="$router.push({ path: '/create' })"
          >
            <Title class="px-2" dark bg="transparent">Sign</Title>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Title from '@/components/Title.vue'
export default {
  components: {
    Title,
  },
}
</script>
<style scoped>
.action-image-create {
  width: 200px;
  margin: auto;
}
.action-image-read {
  padding-top: 40px;
  width: 235px;
  transform: translateX(-15px);
  margin: auto;
}
.action-button {
  min-height: 70px !important;
}
</style>
