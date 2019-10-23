<template>
  <div class="hltable">
    <el-table
      id="HLtableList"
      :data="data"
      :border="border"
      :size="size"
      :show-overflow-tooltip="showOverflowTooltip"
      :show-summary="showSummary"
      :tooltip-effect="tooltipEffect"
      :height='autoHeigit === true ? computedHeight : height'
      :search="search"
      :header-cell-style="tableHeaderColor"
      :stripe="stripe"
      @selection-change="selectChange"
      @select="select"
      @select-all="selectAll"
      @row-click="rowClick"
      v-loading="loading"
      style="width: 98%;margin: 20px auto 0 20px;border: 1px solid rgba(233, 233, 233, 1)"
    >
      <el-table-column v-if="multiple" type="selection" width="40" align="center"></el-table-column>
      <el-table-column
        v-if="serialize"
        type="index"
        fixed="left"
        label="序号"
        width="55"
        align="center"
      ></el-table-column>

      <slot></slot>
    </el-table>
    <div class="container">
      <el-pagination
        class="page"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import _ from 'lodash'
import { setTimeout } from 'timers';
export default {
  name: "hl-table",
  props: {
    data: {
      default: () => []
    },
    size: {
      default: "medium"
    },
    border: {
      default: true
    },
    showOverflowTooltip: {
      default: false
    },
    multiple: {
      default: false
    },
    serialize: {
      default: true
    },
    showSummary: {
      default: false
    },
    tooltipEffect: {
      default: "dark"
    },
    loading: {
      default: false
    },
    stripe: {
      default: true
    },
    search: {
      default: false
    },
    total: {
      default: 0
    },
    pageSizes: {
      default: () => [10, 20, 50, 100]
    },
    pageSize: {
      default: 10
    },
    currentPage: {
      default: 1
    },
    layout: {
      default: "total, prev, pager, next,sizes, jumper"
    },
    autoHeigit: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      computedHeight: 0
    };
  },
  computed: {},
  methods: {
    // 修改table header的背景色
    tableHeaderColor({rowIndex}) {
      if (rowIndex === 0) {
        return "background-color: #F6F8FA;color: #262626;font-weight: 500;";
      }
    },
    selectChange(selection) {
      this.$emit("selection-change", selection);
    },
    selectAll(selection){
      console.log("selectAll="+selection)
    },
    select(selection, row){      
      console.log(selection)      
    },
    rowClick(row, event, column) {
      let data = {
        row: row,
        event: event,
        column: column
      };
      this.$emit("row-click", data);
    },
    handleSizeChange(size) {
      this.$emit("sizeChange", size);
    },
    handleCurrentChange(page) {
      this.$emit("pageChange", page);
    },
    computedTableHeight() {
      if (this.autoHeigit === true) {
        this.computedHeight = this.getHlTableListHeight();
      }
    },
    getHlTableListHeight() {
      const $HLtableList = $("#HLtableList");
      return window.innerHeight - $HLtableList.offset().top - 70;
    }
  },
  mounted() {
    setTimeout(()=>{
       this.computedTableHeight();
    },100)

    $(window).bind("resize", _.throttle(() => {
      this.computedTableHeight();
    }, 400));
  },
  destroyed () {
    $(window).off("resize");
  }
};
</script>

<style scoped lang="less">
.container {
  width: 98%;
  margin-left: 20px;
  height: 50px;
  background-color: #f6f8fa;
  position: relative;
  /*margin-top: 15px;*/
  margin-bottom: 20px;
  .page {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>
