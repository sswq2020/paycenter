<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    :title="title"
  >
    <slot name="tip"></slot>
    <el-table stylestripe border :data="data">
      <el-table-column
        show-overflow-tooltip
        align="center"
        :prop="item.prop"
        :label="item.label"
        :key="index"
        v-for="(item,index) in tableHeader"
      >
        <template slot-scope="scope">
          <span v-if="item.prop !='status' && item.prop !='appCode'">{{data[scope.$index][item.prop]}}</span>
          <span v-if="item.prop == 'status'">{{DICT.PAY_STATUS[data[scope.$index].status]}}</span>
          <span v-if="item.prop == 'appCode'">{{DICT.APP_INFO[data[scope.$index].appCode]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:20px 0px">
      <el-form :model="form" v-if="hasremark">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <slot name="count"></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DICT from "@/util/dict.js";
export default {
  name: "financedialog",
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tableHeader: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: ""
    },
    hasremark: {
      type: Boolean,
      default: false
    },
    loading:{
      type: Boolean,
      default: false      
    },
    visible:{
      type: Boolean,
      default: false      
    },
    confirmCb:{
      type: Function,
      default: ()=>{}      
    },
    cancelCb:{
      type: Function,
      default: ()=>{}     
    }
  },
  data() {
    return {
      showClose:false,
      DICT: DICT,
      form: {
        remark: null
      }
    };
  },
  methods: {
    cancle() {
      this.cancelCb();
    },
    confirm() {
      this.confirmCb(this.form.remark)
    }
  },
  watch:{
    visible(newV){
      if(!newV){
      this.form.remark = null;
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
