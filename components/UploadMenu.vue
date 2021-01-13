<template>
  <v-menu
    v-model="isOpen"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
    :nudge-bottom="43"
    :nudge-left="50"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="d-inline-block"
        color="secondary black--text"
        x-small
        v-bind="attrs"
        v-on="on"
      >
        <v-icon color="black" small>mdi-download</v-icon> Upload
      </v-btn>
    </template>

    <v-card color="secondary black--text" class="pa-3" style="max-width: 370px">
      <Title dark>Canary_Uploader</Title>
      <v-divider light class="my-2"></v-divider>
      <p class="text-center">Upload your <code>canary.json</code> file.</p>
      <v-file-input
        v-model="file"
        show-size
        color="primary"
        light
        :rules="rules"
        prepend-icon="mdi-file-code"
        label="Warrant canary file"
        accept="application/json, text/plain"
        dense
        :truncate-length="24"
      ></v-file-input>
      <v-divider light class="my-2"></v-divider>
      <div class="text-center">
        <v-btn @click="isOpen = false" text class="mx-3 black--text" small
          >Cancel</v-btn
        >
        <v-btn @click="onUpload()" :disabled="!file" color="primary" light class="mx-3" small
          >Upload</v-btn
        >
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import Title from '@/components/Title.vue'
import { bytesToBase64 } from '@/utils/base64'
export default {
  components: {
    Title,
  },
  data() {
    return {
      isOpen: false,
      file: null,
      rules: [
        (value) =>
          !value ||
          value.type === 'application/json' ||
          value.type === 'text/plain' ||
          `Error: the file extention should end with .txt or .json.`,
      ],
    }
  },
  methods: {
    async onUpload() {
      let file = this.file
      const reader = new FileReader()
      reader.onload = (event) => {
        this.$emit('onUpload', event.target.result)
        this.isOpen = false
      }
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    },
  },
}
</script>

<style lang="scss" scoped></style>
