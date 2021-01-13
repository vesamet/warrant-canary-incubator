export const state = () => ({
    passingCanary: {} // user to pass a canary from validate to sign view.
  })
  
  export const mutations = {
    setPassingCanary(state, canary) {
      state.passingCanary = canary
    }
  }
  