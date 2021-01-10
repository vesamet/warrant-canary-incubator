<template>
  <v-menu
    v-model="isOpen"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
    :nudge-right="13"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="secondary" small v-bind="attrs" v-on="on">
        <v-icon color="black">mdi-key-plus</v-icon>
      </v-btn>
    </template>

    <v-card color="secondary black--text" class="pa-3" style="max-width: 370px">
      <Title dark>Key_Generator</Title>
      <v-divider light class="my-2"></v-divider>
      <p class="text-center">
        You can generate a
        <v-btn
          class="d-inline-block"
          color="primary"
          x-small
          @click="generateKeyPair()"
        >
          <v-icon color="white" small>mdi-autorenew</v-icon> new
        </v-btn>
        key pair or specify private/public key directly.<br />
        <span style="font-style: italic; font-size: 0.8em">{{
          isOptional ? '' : '(Private key is only mandatory for the Sign key)'
        }}</span>
      </p>
      <v-text-field
        :value="privateKey"
        color="primary"
        label="Private Key"
        light
        counter
        dense
        prepend-inner-icon="mdi-key"
        @input="(k) => $emit('update:privateKey', k)"
      ></v-text-field>
      <v-text-field
        color="primary"
        :value="publicKey"
        prepend-inner-icon="mdi-key"
        light
        dense
        counter
        style="max-width: 82%"
        class="d-inline-block"
        label="Public Key"
        @input="(k) => $emit('update:publicKey', k)"
      ></v-text-field>
      <span style="max-width: 18%"
        ><v-btn color="primary" x-small @click="renewPublicKey()">Renew</v-btn>
      </span>
      <v-divider light class="my-2"></v-divider>
      <div class="text-center">
        <v-btn @click="clear()" color="info" class="black--text mx-3" small
          >Clear</v-btn
        >
        <v-btn @click="isOpen = false" color="primary" class="mx-3" small>Done</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import * as ed from 'noble-ed25519'
import Title from '@/components/Title.vue'
import { bytesToBase64 } from '@/utils/base64'
export default {
  props: {
    privateKey: {
      type: String,
      default: '',
    },
    publicKey: {
      type: String,
      default: '',
    },
    isOptional: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Title,
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    async generateKeyPair() {
      let newPrivateKey = bytesToBase64(ed.utils.randomPrivateKey())
      this.$emit('update:privateKey', newPrivateKey)
      let newPublicKey = await ed.getPublicKey(newPrivateKey)
      this.$emit('update:publicKey', bytesToBase64(newPublicKey))
    },
    async renewPublicKey() {
      let newPublicKey = await ed.getPublicKey(this.privateKey)
      this.$emit('update:publicKey', bytesToBase64(newPublicKey))
    },
    clear() {
      this.$emit('update:privateKey', '')
      this.$emit('update:publicKey', '')
    },
  },
}
</script>

<style lang="scss" scoped></style>
