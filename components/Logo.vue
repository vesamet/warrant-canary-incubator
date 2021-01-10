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

/**
position: absolute;
top: 12px;
left: 7px;
width: 120px;
height: 120px;
background-color: var(--v-info-base);
padding: 22px;
    padding-top: 22px;
padding-top: 17px;
*/
</style>
