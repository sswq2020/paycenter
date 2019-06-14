<template>
  <el-table-column 
     :prop="col.prop" 
     :label="col.label">
    <template v-if="col.children">
      <multicolumn v-for="(item, index) in col.children" :key="index" :col="item"></multicolumn>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "multicolumn",
  props: {
    col: {
      type: Object
    }
  }
};
</script>
<style scoped>
</style>
