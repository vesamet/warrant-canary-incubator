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
          <p>
            <strong :class="validated.expired ? 'error--text' : ''">
              ░ Expiry:</strong
            >
            {{ validated.expiry }}
            <span v-if="validated.expired" class="error--text">
              <v-icon color="error">mdi-alert-decagram</v-icon></span
            >
          </p>
          <p>
            <strong :class="validated.threat.length ? 'error--text' : ''"
              >░ Threat status: </strong
            ><v-icon v-if="validated.threat.length > 0" color="error"
              >mdi-alert-decagram</v-icon
            >
            <span v-if="!validated.threat.length">
              None triggered <v-icon color="green">mdi-check-circle</v-icon>
            </span>
            <span
              v-if="validated.threat.length > 0"
              class="error--text pb-1 d-inline-block ml-3"
              style="font-size: 0.9em"
              >These threats have been triggered:</span
            ><br />
            <span v-for="threat in validated.threat" :key="threat.value"
              ><span class="error--text d-inline-block ml-3">▙</span>
              {{ threat.text }}<br
            /></span>
          </p>
          <v-divider class="my-3 black"></v-divider>
          <div v-if="validated.pubkeys.length > 0">
            <strong :class="!validated.allKeysValid ? 'error--text' : ''"
              >░ Public keys:
            </strong>
            <v-icon v-if="!validated.allKeysValid" color="error"
              >mdi-alert-decagram</v-icon
            >
            <v-icon
              color="primary"
              @click="viewPubKeys = !viewPubKeys"
              class="float-right"
              >{{ viewPubKeys ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon
            >
            <span
              v-if="!validated.allKeysValid"
              class="error--text pb-1 d-inline-block ml-3"
              style="font-size: 0.9em"
              >One or more keys failed signing verification</span
            >
            <div v-for="key in validated.pubkeys" :key="key.publicKey">
              <code v-if="viewPubKeys" class="d-inline-block mr-2">
                <v-icon v-if="!key.isValid" color="error" class="d-inline-block"
                  >mdi-alert-decagram</v-icon
                >
                <v-icon v-else color="success" class="d-inline-block"
                  >mdi-check-circle</v-icon
                >
                {{ key.publicKey }}</code
              >
            </div>
          </div>

          <p v-if="validated.panickey">
            <strong>░ Panic key: </strong>
            <v-icon
              color="primary"
              @click="viewPanicKey = !viewPanicKey"
              class="float-right"
              >{{ viewPanicKey ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon
            >
            <code v-if="viewPanicKey">{{ validated.panickey }}</code>
          </p>
          <v-btn
            small
            color="info"
            class="edit-btn"
            fab
            absolute
            top
            right
            @click="edit()"
          >
            <v-icon color="black">mdi-pencil</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import * as ed from 'noble-ed25519'
import { decode, decodeToUint8Array } from '@/utils/base64'
import { mapMutations } from 'vuex'
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
      viewPubKeys: false,
      viewPanicKey: false,
    }
  },
  methods: {
    ...mapMutations(['setPassingCanary']),
    async validate() {
      if (!this.canary.canary) {
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Error: invalid canary',
          text: "The JSON object is missing the root property 'canary'.",
        })
        return
      }

      // Define signatures state
      let signaturesState = []
      let allKeysValid = true
      let signaturesObject = this.canary?.signatures
      if (signaturesObject) {
        await this.asyncForEach(
          Object.entries(signaturesObject),
          async (entry) => {
            const [publicKey, signatures] = entry
            let isValid = true
            await this.asyncForEach(
              Object.entries(signatures),
              async (entry) => {
                const [property, signature] = entry
                let propertyContent = this.canary?.canary[property]
                let isSigned = await ed.verify(
                  decode(signature),
                  String(propertyContent),
                  decodeToUint8Array(publicKey)
                )
                if (!isSigned) {
                  isValid = false
                  allKeysValid = false
                }
              }
            )
            signaturesState.push({ publicKey: publicKey, isValid: isValid })
          }
        )
      }

      //TODO: Check if one of the signatures is the panick key

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
      let codes = this.canary?.canary?.codes || []
      let threat = availableCodes.filter((c) => {
        return !codes.includes(c.value)
      })

      // Check if canary is expired:
      let expired = false
      if (new Date() > Date.parse(this.canary?.canary?.expiry)) {
        expired = true
      }
      // Format the canary
      this.validated = {
        domain: this.canary?.canary?.domain,
        pubkeys: signaturesState.length > 0 ? signaturesState : [],
        allKeysValid: allKeysValid,
        panickey: this.canary?.canary?.panickey,
        freshness: this.canary?.canary?.freshness,
        release: this.canary?.canary?.release,
        expiry: this.canary?.canary?.expiry,
        expired: expired,
        version: this.canary?.canary?.version,
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
    edit() {
      this.setPassingCanary(this.validated)
      this.$router.push({ path: '/sign' })
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    },
  },
}
</script>

<style scoped>
.json-card {
  position: relative;
  overflow-x: auto;
}
.validate-btn {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.edit-btn {
  margin-right: -35px;
  margin-top: 40px;
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
