<template>
    <div class="showbanner">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:'showbanner',
    props: {

    }
}
</script>


<style scoped lang="less">
.showbanner {
  display: flex;
  height:85px;
  font-size:12px;
  color: #333333;
  flex-wrap: wrap;
}
</style>