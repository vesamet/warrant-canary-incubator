<template>
  <div>
    <v-form v-model="valid">
      <v-stepper v-model="step" class="elevation-0">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1"> Sign </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 2" step="2">
            Retrieve
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card class="mb-4 pa-5">
              <v-row class="ma-0 pa-0">
                <v-col cols="12" md="6" class="ma-0 pa-0 pr-1">
                  <v-text-field
                    v-model="domain"
                    prepend-inner-icon="mdi-web"
                    label="Domain*"
                    color="secondary"
                    dense
                    class="mb-2"
                    :rules="[(v) => !!v || 'A domain name is required.']"
                    hint="
                    Specifies the web address (if any) tied to the entity. 
                    This is used for simplistic TLS/SSL certificate verification of authenticity as well."
                    placeholder="www.cryptanalys.is"
                  />
                  <div v-if="securityLevel === 'medium'" class="mb-6">
                    <v-autocomplete
                      class="d-inline-block mr-2 mb-0 key-field"
                      label="Private keys for signing*"
                      color="secondary"
                      v-model="signKeys"
                      :items="signKeys"
                      return-object
                      clearable
                      :item-text="
                        (item) =>
                          `${
                            item.public ? item.public.substring(0, 16) : ''
                          }...`
                      "
                      deletable-chips
                      multiple
                      dense
                      no-data-text="These keys are used for signing the canary itself to prove authenticity."
                      :rules="[
                        (v) =>
                          v.length > 0 || 'At least one sign key is required.',
                      ]"
                      prepend-inner-icon="mdi-key"
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          close
                          small
                          @click="data.select"
                          @click:close="removeSignKey(data.item)"
                        >
                          {{ data.item.public.substring(0, 8) }}...
                        </v-chip>
                      </template>
                    </v-autocomplete>
                    <span style="width: 20%"
                      ><KeyGenerator
                        :privateKey="signKeyToAdd"
                        :publicKey="pubKeyToAdd"
                        :isOptional="false"
                        @update:publicKey="(k) => (pubKeyToAdd = k)"
                        @update:privateKey="(k) => (signKeyToAdd = k)"
                        @onClose="addSignKey"
                        closeLabel="Add key or close"
                      />
                    </span>
                  </div>
                  <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="dateMenu"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    class="py-0 my-0"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="expiry"
                        label="Expiry date*"
                        readonly
                        dense
                        prepend-icon="mdi-calendar"
                        :rules="[(v) => !!v || 'An expiry date is required.']"
                        v-bind="attrs"
                        v-on="on"
                        class="py-0 mt-0"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="expiry" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dateMenu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.save(expiry)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                  <v-switch
                    v-model="triggered"
                    color="error"
                    class="pb-0 pt-2 my-0"
                    :label="triggered ? 'Triggered' : 'Not triggered'"
                  ></v-switch>
                </v-col>
                <v-col cols="12" md="6" class="ma-0 pa-0 pl-1">
                  <v-autocomplete
                    v-model="securityLevel"
                    :items="securityLevels"
                    label="Security level"
                    color="secondary"
                    prepend-inner-icon="mdi-label-letiant"
                    dense
                    class="mb-2"
                    placeholder="(optional)"
                  />
                  <div v-if="securityLevel === 'medium'" class="mb-4">
                    <v-text-field
                      v-model="panickey"
                      label="Panic key"
                      color="secondary"
                      type="password"
                      class="d-inline-block mr-2 mb-2 key-field"
                      hint="Specifies the public key (if any) that can trigger the canary simply by being signed by it. 
                    This is used when the party wishes to end the canary for whatever reason."
                      prepend-inner-icon="mdi-key-star"
                      dense
                      placeholder="(optional)"
                    />
                    <span style="width: 20%"
                      ><KeyGenerator
                        :privateKey="privatePanicKey"
                        :publicKey="panickey"
                        @update:publicKey="(k) => (panickey = k)"
                        @update:privateKey="(k) => (privatePanicKey = k)"
                      />
                    </span>
                  </div>
                  <v-autocomplete
                    v-model="version"
                    :items="[{ text: 'v0.1', value: 0.1 }]"
                    label="Version"
                    color="secondary"
                    prepend-inner-icon="mdi-label-letiant"
                    dense
                    class="mb-2"
                    placeholder="(optional)"
                  />
                  <v-switch
                    v-model="useBlockHash"
                    color="secondary"
                    class="py-0 my-0"
                    label="Prove sign date by block hash"
                  ></v-switch>
                  <p v-if="useBlockHash && fetchHashError">
                    Paste the first block hash from
                    <LinkText link="https://blockchain.info/latestblock"
                      >this link</LinkText
                    >
                    in the field above.<br />
                    <v-text-field
                      v-model="hash"
                      prepend-inner-icon="mdi-bitcoin"
                      label="Latest block hash"
                      class="d-inline-block mt-2"
                      color="secondary"
                      dense
                      placeholder="0000000000000000000033c3a37d18ee679f05dedc52e807b7177b521a825fcd"
                    />
                  </p>
                </v-col>
                <transition name="fade">
                  <v-col v-if="triggered" cols="12" class="py-0 my-0">
                    <v-card outlined class="mb-2 pa-2">
                      <p>Add the threat(s) you wish to trigger</p>
                      <v-autocomplete
                        class="mt-2 mb-2"
                        label="Codes"
                        v-model="codes"
                        :items="availableCodes"
                        clearable
                        deletable-chips
                        multiple
                        dense
                        prepend-inner-icon="mdi-dense"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            small
                            @click="data.select"
                            @click:close="remove(data.item)"
                          >
                            {{ data.item.text }}
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </v-card>
                  </v-col>
                </transition>
              </v-row>
              <p style="font-size: 0.9em" class="mb-0">
                For your privacy, keys are not stored anywhere online or
                locally.<br />
                Key manipulations are entirely done in your browser.
              </p>
            </v-card>
            <div class="text-right">
              <v-btn
                color="primary"
                :disabled="!valid || loading"
                @click="sign()"
              >
                Sign
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card class="pa-3 mb-6" min-height="200px">
              <p>
                Warrant canary successfully signed!<br />
                You may
                <a :href="encodedCanary" download="canary.json">
                  <v-btn class="d-inline-block" color="primary" x-small>
                    download
                  </v-btn>
                </a>
                it and serve it on your domain.
              </p>
              <v-divider class="my-3"></v-divider>
              <p class="pb-0 mb-1" style="font-size: 0.8em">
                Json representation of the canary:
              </p>
              <v-jsoneditor
                v-model="canary"
                :options="{ mode: 'code', theme: 'ace/theme/twilight' }"
                :plus="false"
                height="250px"
              />
            </v-card>
            <v-row justify="space-between">
              <v-col class="text-left">
                <v-btn
                  text
                  @click="
                    step--
                    canary = {}
                  "
                >
                  Back
                </v-btn>
              </v-col>
              <v-col class="text-right">
                <a :href="encodedCanary" download="canary.json">
                  <v-btn color="primary">Download as file</v-btn>
                </a>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-form>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { encode, decode, decodeToUint8Array } from '@/utils/base64'
import * as ed from 'noble-ed25519'
import '@/assets/jsonEditorTheme.js'
import '@/assets/jsonEditorCustomStyle.css'

import Title from './Title.vue'
import KeyGenerator from '@/components/KeyGenerator.vue'
export default {
  components: { Title, KeyGenerator },
  data() {
    return {
      valid: false,
      loading: false,
      step: 1,
      domain: '',
      pubkeys: [],
      panickey: '',
      version: 0.1,
      release: '',
      expiry: '',
      freshness: '',
      codes: [],
      availableCodes: [
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
      ],
      dateMenu: false,
      triggered: false,
      signKeys: [],
      signKeyToAdd: '',
      pubKeyToAdd: '',
      privatePanicKey: '',
      securityLevel: 'medium',
      securityLevels: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high', disabled: true },
      ],
      useBlockHash: true,
      canary: {},
      hash: '',
      error: '',
      canaryIsNew: true,
      fetchHashError: false,
    }
  },
  computed: {
    ...mapState(['passingCanary']),
    stringifiedCanary() {
      return JSON.stringify(this.canary)
    },
    encodedCanary() {
      return (
        'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this.stringifiedCanary)
      )
    },
  },
  methods: {
    ...mapMutations(['setPassingCanary']),
    async sign() {
      try {
        // Define public keys
        let publicKeys = null
        if (this.securityLevel === 'medium') {
          // Public key for sign key
          publicKeys = this.signKeys.map((k) => k.public)
        }
        // Define canary
        let canary = {
          claims: {},
        }
        //Defin claims
        let claims = {}
        claims.domain = this.domain.toLowerCase()
        if (publicKeys.length) claims.pubkeys = publicKeys
        if (this.panickey) claims.panickey = this.panickey
        if (this.hash && this.useBlockHash) claims.freshness = this.hash
        claims.version = '' + this.version
        claims.release = this.ISODateString(new Date())
        claims.expiry = this.ISODateString(new Date(this.expiry))
        claims.codes = this.availableCodes
          .map((c) => {
            return c.value
          })
          .filter((c) => {
            return !this.codes.includes(c)
          })

        canary.claims = claims
        //Define signatures
        if (this.securityLevel === 'medium') {
          let publicKeySignatures = {}
          await this.asyncForEach(this.signKeys, async (signKey) => {
            let signatures = {}
            await this.asyncForEach(Object.entries(claims), async (c) => {
              const [key, value] = c
              let signature = await ed.sign(
                String(value),
                decodeToUint8Array(signKey.private)
              )
              signatures[`signed_${key}`] = encode(signature)
            })
            publicKeySignatures[signKey.public] = signatures
          })
          canary.signatures = publicKeySignatures
        }

        // Update canary
        this.canary = Object.assign({}, { canary: canary })
        this.step = 2
      } catch (e) {
        console.log(e)
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Error',
          text: e,
        })
      }
    },
    remove(item) {
      this.codes = this.codes.filter((c) => c !== item.value)
    },
    async addSignKey() {
      if (!this.signKeyToAdd) return
      if (!this.pubKeyToAdd) {
        let publicKey = await ed.getPublicKey(
          decodeToUint8Array(this.signKeyToAdd)
        )
        this.pubKeyToAdd = encode(publicKey)
      }
      this.removeSignKey({
        private: this.signKeyToAdd,
        public: this.pubKeyToAdd,
      })
      this.signKeys.push({
        private: this.signKeyToAdd,
        public: this.pubKeyToAdd,
      })
      this.signKeyToAdd = ''
      this.pubKeyToAdd = ''
    },
    removeSignKey(item) {
      this.signKeys = this.signKeys.filter((c) => c.private !== item.private)
    },
    ISODateString(d) {
      function pad(n) {
        return n < 10 ? '0' + n : n
      }
      return (
        d.getUTCFullYear() +
        '-' +
        pad(d.getUTCMonth() + 1) +
        '-' +
        pad(d.getUTCDate()) +
        'T' +
        pad(d.getUTCHours()) +
        ':' +
        pad(d.getUTCMinutes()) +
        ':' +
        pad(d.getUTCSeconds()) +
        'Z'
      )
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    },
    getLatestHash() {
      let request = new XMLHttpRequest()

      request.open('GET', 'https://blockchain.info/q/latesthash')

      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          if (request.status === 200) {
            this.hash = request.responseText
          } else {
            this.fetchHashError = true
          }
        }
      }
      request.send()
    },
  },
  async mounted() {
    if (this.passingCanary?.domain) {
      let c = this.passingCanary
      this.domain = c.domain
      if (c.pubkey) this.pubkey = c.pubkey
      if (c.panickey) this.panickey = c.panickey
      this.version = Number(c.version)
      this.release = ''
      this.expiry = c.expiry.split('T')[0]
      if (c.threat.length > 0) this.triggered = true
      this.codes = c.threat.map((c) => c.value)
    }
    this.setPassingCanary({})
    this.getLatestHash()
  },
}
</script>

<style>
.key-field {
  width: 80%;
}

@media only screen and (max-width: 924px) {
  .key-field {
    width: 70%;
  }
}
</style>
