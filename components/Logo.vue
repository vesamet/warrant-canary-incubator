<template>
  <div class="logo-box" @click="$router.push({path: '/'})">
    <img src="@/assets/img/logo.png" alt="" class="logo" />
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.logo-box {
  position: absolute;
  top: -60px;
  left: -80px;
  width: 200px;
  height: 200px;
  background-color: var(--v-info-base);
  padding: 40px;
  padding-top: 30px;
  border-radius: 50%;
  transition: all .2s ease;
}
.logo-box:hover {
    transform: scale(1.1);
    cursor: pointer;
}
.logo {
  max-width: 100%;
}

@media only screen and (max-width: 924px) {
  .logo-box {
  position: initial;
  padding: 10px;
  padding-top: 23px;
  padding-bottom: 15px;
  text-align: center;
  margin: auto;
  }
  .logo {
    max-width: 70%;
  }
}
</style>
