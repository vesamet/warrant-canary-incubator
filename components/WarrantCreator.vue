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
                  <div v-if="securityLevel === 'medium'" class="mb-4">
                    <v-text-field
                      v-model="signKey"
                      label="Private key for signing*"
                      color="secondary"
                      type="password"
                      prepend-inner-icon="mdi-key"
                      dense
                      hint="This key is used for signing the canary itself to prove authenticity."
                      :rules="[(v) => !!v || 'A sign key is required.']"
                      class="d-inline-block mr-2 mb-2"
                      style="width: 80%"
                      placeholder="Y4PsjneDjxckrgibojs38VDWFBTyvlVtTQR3Z9RTRw0="
                    />
                    <span style="width: 20%"
                      ><KeyGenerator
                        :privateKey="signKey"
                        :publicKey="pubkey"
                        :isOptional="false"
                        @update:publicKey="(k) => (pubkey = k)"
                        @update:privateKey="(k) => (signKey = k)"
                      />
                    </span>
                    <v-text-field
                      v-model="newpubkey"
                      label="New sign key"
                      color="secondary"
                      type="password"
                      class="d-inline-block mr-2 mb-2"
                      prepend-inner-icon="mdi-key"
                      style="width: 80%"
                      hint="Specifies the expected replacement public key (if any) tied to the entity for any future signatures."
                      dense
                      placeholder="(optional)"
                    />
                    <span style="width: 20%"
                      ><KeyGenerator
                        :privateKey="newSignKey"
                        :publicKey="newpubkey"
                        @update:publicKey="(k) => (newpubkey = k)"
                        @update:privateKey="(k) => (newSignKey = k)"
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
                        class="py-0"
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
                    prepend-inner-icon="mdi-label-variant"
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
                      style="width: 80%"
                      class="d-inline-block mr-2 mb-2"
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
                    <v-text-field
                      v-model="newpanickey"
                      prepend-inner-icon="mdi-key-star"
                      label="New panic key"
                      type="password"
                      style="width: 80%"
                      class="d-inline-block mr-2 mb-2"
                      color="secondary"
                      dense
                      hint="Specifies the replacement public panic key (if any) for any future signatures."
                      placeholder="(optional)"
                    />
                    <span style="width: 20%"
                      ><KeyGenerator
                        :privateKey="privateNewPanicKey"
                        :publicKey="newpanickey"
                        @update:publicKey="(k) => (newpanickey = k)"
                        @update:privateKey="(k) => (privateNewPanicKey = k)"
                      />
                    </span>
                  </div>
                  <v-autocomplete
                    v-model="version"
                    :items="[{ text: 'v0.1', value: 0.1 }]"
                    label="Version"
                    color="secondary"
                    prepend-inner-icon="mdi-label-variant"
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
                For you privacy, keys are not stored anywhere online or
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
import * as ed from 'noble-ed25519'
import { bytesToBase64 } from '@/utils/base64'
import '@/assets/jsonEditorTheme.js'

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
      pubkey: '',
      newpubkey: '',
      panickey: '',
      newpanickey: '',
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
      signKey: '',
      newSignKey: '',
      privatePanicKey: '',
      privateNewPanicKey: '',
      securityLevel: 'medium',
      securityLevels: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high', disabled: true },
      ],
      useBlockHash: true,
      canary: {},
      error: '',
    }
  },
  computed: {
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
    async sign() {
      try {
        // Validate keys
        try {
          await ed.getPublicKey(this.signKey)
        } catch (e) {
          console.log(e)
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Error',
            text: 'The private sign key is invalid.',
          })
          return
        }
        // Define keys
        let publicKey = null
        if (this.securityLevel === 'medium') {
          // Public key for sign key
          let publicKey = await ed.getPublicKey(this.signKey)
          publicKey = bytesToBase64(publicKey)
        }
        // Define canary
        let canary = {
          claims: {},
        }
        let claims = {}
        claims.domain = this.domain
        if (publicKey) claims.pubkey = publicKey
        if (this.newpubkey) claims.newpubkey = this.newpubkey
        if (this.panickey) claims.panickey = this.panickey
        if (this.newpanickey) claims.newpanickey = this.newpanickey
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
        // //freshness: '',
        canary.claims = claims
        // Define signatures
        let signatures = {}
        if (this.securityLevel === 'medium') {
          console.log(claims)
          await this.asyncForEach(Object.entries(claims), async (c) => {
            const [key, value] = c
            let signature = await ed.sign(value, this.signKey)
            signatures[`signed_${key}`] = bytesToBase64(signature)
          })
        }
        // let signatures = {
        //   signed_domain: '',
        //   signed_pubkey: '',
        //   signed_newpubkey: '',
        //   signed_panickey: '',
        //   signed_newpanickey: '',
        //   signed_version: '',
        //   signed_release: '',
        //   signed_expiry: '',
        //   signed_freshness: '',
        //   signed_codes: '',
        // }
        canary.signatures = signatures
        this.canary = Object.assign({}, { canary: canary })
        this.step = 2
      } catch (e) {
        console.log(e)
      }
    },
    remove(item) {
      this.codes = this.codes.filter((c) => c !== item.value)
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
  },
}
</script>

<style>
.jsoneditor-menu {
  background-color: var(--v-primary-base);
  border-bottom: 1px solid var(--v-primary-base);
}
.jsoneditor-poweredBy,
.jsoneditor-transform,
.jsoneditor-repair {
  display: none;
}
.jsoneditor-mode-code {
  border: none;
}
.ace_content {
  font-size: 1.2em;
}
</style>
