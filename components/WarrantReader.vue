<template>
  <v-row class="ma-0 pa-2">
    <v-col cols="12" md="6">
      <v-card color="info" class="pa-3 json-card">
        <Title dark class="black--text">JSON</Title>
        <p class="black--text mt-2">
          <UploadMenu @onUpload="(e) => validateUpload(e)" />
          or paste your canary's json in the field above.
        </p>
        <v-jsoneditor
          v-model="canary"
          :options="{ mode: 'code', theme: 'ace/theme/twilight' }"
          :plus="false"
          height="350px"
        />
        <v-btn large color="primary" class="validate-btn" @click="validate()"
          >Validate</v-btn
        >
      </v-card>
    </v-col>
    <v-col cols="12" md="6" align-self="stretch">
      <v-card color="secondary" class="pa-3 fill-height">
        <Title dark class="black--text">Validated_Canary</Title>
        <p v-if="!validated" class="text-center black--text mt-7">
          Waiting for a valid canary...
        </p>
        <div v-else class="black--text pa-3">
          <p><strong>░ Version:</strong> {{ validated.version }}</p>
          <p><strong>░ Domain:</strong> {{ validated.domain }}</p>
          <p>
            <strong>░ Freshness: </strong>
            <a
              :href="`https://www.blockchain.com/btc/block/${validated.freshness}`"
              target="_blank"
              ><v-btn color="primary" class="ml-2" x-small
                >Check block hash</v-btn
              ></a
            >
          </p>
          <p><strong>░ Release:</strong> {{ validated.release }}</p>
          <p><strong>░ Expiry:</strong> {{ validated.expiry }}</p>
          <p><strong>░ Codes/Threat status:</strong> <br /><strong v-if="validated.threat.length > 0 " class="error--text">The following threats have been triggered:</strong><br>
          <span v-for="threat in validated.threat" :key="threat.value"><span class="error--text">▙</span> {{threat.text}}<br/></span>
          </p>
          <v-divider class="my-3 black"></v-divider>
          <p>
            <strong>░ Public key:</strong> <code>{{ validated.pubkey }}</code>
          </p>
          <p v-if="validated.newpubkey">
            <strong>░ New public key:</strong>
            <code>{{ validated.newpubkey }}</code>
          </p>
          <p v-if="validated.panickey">
            <strong>░ Panic key:</strong> <code>{{ validated.panickey }}</code>
          </p>
          <p v-if="validated.newpanickey">
            <strong>░ New panic key:</strong>
            <code>{{ validated.newpanickey }}</code>
          </p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import '@/assets/jsonEditorTheme.js'
import '@/assets/jsonEditorCustomStyle.css'
import Title from '@/components/Title.vue'
import LinkText from '@/components/LinkText.vue'
import UploadMenu from '@/components/UploadMenu.vue'
export default {
  components: {
    Title,
    LinkText,
    UploadMenu,
  },
  data() {
    return {
      canary: {},
      validated: false,
    }
  },
  methods: {
    validate() {
      let parsedJson = null
      if (!this.canary.canary) {
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Error: invalid canary',
          text: "The JSON object is missing the root property 'canary'.",
        })
        return
      }
      //Define threat level
      let availableCodes = [
        { text: 'Warrants', value: 'war' },
        { text: 'Gag orders', value: 'gag' },
        { text: 'Subpoenas', value: 'subp' },
        { text: 'Trap and trace orders', value: 'trap' },
        { text: 'Court order to cease operations', value: 'cease' },
        {
          text: 'Coercion, blackmail, or otherwise operating under duress',
          value: 'duress',
        },
        { text: 'Raids with high confidence', value: 'raid' },
        { text: 'Raids with high confidence', value: 'seize' },
        { text: 'Compromised credentials', value: 'xcred' },
        { text: 'Compromised operations', value: 'xopers' },
      ]
      let codes = this.canary?.canary?.claims?.codes || []
      let threat = availableCodes.filter((c) => {
        return !codes.includes(c.value)
      })
      // Validate the canary
      this.validated = {
        domain: this.canary?.canary?.claims?.domain,
        pubkey: this.canary?.canary?.claims?.pubkey,
        newpubkey: this.canary?.canary?.claims?.newpubkey,
        panickey: this.canary?.canary?.claims?.panickey,
        newpanickey: this.canary?.canary?.claims?.newpanickey,
        freshness: this.canary?.canary?.claims?.freshness,
        release: this.canary?.canary?.claims?.release,
        expiry: this.canary?.canary?.claims?.expiry,
        version: this.canary?.canary?.claims?.version,
        threat: threat,
      }
      this.$notify({
        group: 'foo',
        type: 'success',
        title: 'Sucess',
        text: 'Warrant canary successfuly validated.',
      })
    },
    validateUpload(text) {
      let parsedUpload = null
      try {
        parsedUpload = JSON.parse(text)
      } catch (e) {
        console.log(e)
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Upload error',
          text: 'The text in the file is not a valid JSON.',
        })
        return
      }
      this.canary = parsedUpload
    },
  },
}
</script>

<style scoped>
.json-card {
  position: relative;
}
.validate-btn {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
code {
  overflow: auto;
  text-overflow: auto;
  white-space: nowrap;
  display: inline-block;
  width: 100%;
  min-width: 1px;
}
</style>
