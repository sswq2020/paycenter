<template>
  <el-dialog
    width="600px"
    :visible.sync="bankdetaildialog"
    :center="true"
    :title="title"
  >
       <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  name: "bankdetaildialog",
  props: {
    title: {
      type: String,
      default: "对话框"
    }
  },
  data() {
    return {
      bankdetaildialog: false
    };
  },
  methods: {
    open() {
      this.bankdetaildialog = true;
    },
    cancle() {
      this.bankdetaildialog = false;
    },
    confirm() {
      this.bankdetaildialog = false;
    }
  }
};
</script>
<style scoped lang="less">

</style>
