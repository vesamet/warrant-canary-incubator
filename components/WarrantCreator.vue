<template>
  <div>
    <v-form v-model="valid">
      <v-stepper v-model="step" class="elevation-0">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">
            Define
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 2" step="2"> Sign </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3"> Retrieve </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card class="mb-7 pa-5">
              <v-row class="ma-0 pa-0">
                <v-col cols="12" md="6" class="ma-0 pa-0 pr-1">
                  <v-text-field
                    v-model="domain"
                    prepend-inner-icon="mdi-web"
                    label="Domain"
                    color="secondary"
                    dense
                    hint="
                    Specifies the web address (if any) tied to the entity. 
                    This is used for simplistic TLS/SSL certificate verification of authenticity as well."
                    placeholder="www.cryptanalys.is"
                  />
                  <v-text-field
                    v-model="pubkey"
                    label="Sign Key*"
                    color="secondary"
                    type="password"
                    prepend-inner-icon="mdi-key"
                    dense
                    hint="This key is used for signing the canary itself to prove authenticity."
                    :rules="[(v) => !!v || 'A sign key is required.']"
                    class="d-inline-block mr-2"
                    style="max-width: 80%"
                    placeholder="Y4PsjneDjxckrgibojs38VDWFBTyvlVtTQR3Z9RTRw0="
                  />
                  <span style="max-width: 20%"
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
                    label="New Sign key"
                    color="secondary"
                    type="password"
                    class="d-inline-block mr-2"
                    prepend-inner-icon="mdi-key"
                    style="max-width: 80%"
                    hint="Specifies the expected replacement key (if any) tied to the entity for any future signatures."
                    dense
                    placeholder="(optional)"
                  />
                  <span style="max-width: 20%"
                    ><v-btn color="secondary" small>
                      <v-icon color="black">mdi-key-plus</v-icon>
                    </v-btn>
                  </span>
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
                </v-col>
                <v-col cols="12" md="6" class="ma-0 pa-0 pl-1">
                  <v-autocomplete
                    v-model="version"
                    :items="[{ text: 'v0.1', value: 0.1 }]"
                    label="Version"
                    color="secondary"
                    prepend-inner-icon="mdi-label-variant"
                    dense
                    placeholder="(optional)"
                  />
                  <v-text-field
                    v-model="panickey"
                    label="Panic key"
                    color="secondary"
                    type="password"
                    style="max-width: 80%"
                    class="d-inline-block mr-2"
                    hint="Specifies the key (if any) that can trigger the canary simply by being signed by it. 
                    This is used when the party wishes to end the canary for whatever reason."
                    prepend-inner-icon="mdi-key-star"
                    dense
                    placeholder="(optional)"
                  />
                  <span style="max-width: 20%"
                    ><v-btn color="secondary" small>
                      <v-icon color="black">mdi-key-plus</v-icon>
                    </v-btn>
                  </span>
                  <v-text-field
                    v-model="newpanickey"
                    prepend-inner-icon="mdi-key-star"
                    label="New panic key"
                    type="password"
                    style="max-width: 80%"
                    class="d-inline-block mr-2"
                    color="secondary"
                    dense
                    hint="Specifies the replacement panic key (if any) tied to the entity for any future signatures."
                    placeholder="(optional)"
                  />
                  <span style="max-width: 20%"
                    ><v-btn color="secondary" small>
                      <v-icon color="black">mdi-key-plus</v-icon>
                    </v-btn>
                  </span>
                  <v-switch
                    v-model="triggered"
                    color="error"
                    class="py-0 my-0"
                    :label="triggered ? 'Triggered' : 'Not triggered'"
                  ></v-switch>
                  <transition name="fade">
                    <v-card v-if="triggered" outlined class="pa-2 my-2">
                      <p>Add the threat(s) you wish to trigger</p>
                      <v-autocomplete
                        class="mt-2"
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
                  </transition>
                </v-col>
              </v-row>
              <p style="font-size: 0.9em">
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
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>

            <v-btn color="primary" @click="step = 3"> Continue </v-btn>

            <v-btn text @click="step--"> Back </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>

            <v-btn color="primary" @click="step = 1"> Continue </v-btn>

            <v-btn text> Cancel </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-form>
  </div>
</template>

<script>
import * as ed from 'noble-ed25519'

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
        { text: 'Compromised credentials', value: 'seize' },
        { text: 'Compromised operations', value: 'xopers' },
      ],
      dateMenu: false,
      triggered: false,
      signKey: '',
      newSignKey: '',
      privatePanicKey: '',
      privateNewPanicKey: '',
    }
  },
  methods: {
    sign() {
      this.step = 2
    },
    remove(item) {
      this.codes = this.codes.filter((c) => c !== item.value)
    },
  },
  mounted() {},
}
</script>

<style scoped></style>
