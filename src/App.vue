<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less">
  html,body{
    margin: 0;
    padding: 0;
    background-color: #252A2F;
    width:100%;
    height:100%;
    font-size: 14px;
    .config-message{
      margin-top: 100px;
    }
  }
  #app {
    font-family:'Microsoft YaHei';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #000;
    padding: 0;
    margin: 0;
    width:100%;
    height:100%;
    overflow-x: hidden;
    .single-page{
      display: block;
      background-color: white;
      /*padding:0 20px;*/
    }
  }

</style>
