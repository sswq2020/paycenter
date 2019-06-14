<template>
    <el-table class="hltable"
            :data="data"
            style="width: 98%;margin: 20px auto 0 20px;border: 1px solid rgba(233, 233, 233, 1)"
            :border="border"
            :show-overflow-tooltip="showOverflowTooltip"
            :tooltip-effect="tooltipEffect"
            :height="height"
            :search="search"
            v-loading="loading"
            @selection-change="selectChange"
            :header-cell-style="tableHeaderColor"
            @row-click="rowClick"
            :stripe="stripe"
    >
        <slot></slot>
    </el-table>
</template>

<script>
    export default {
        name: "hl-table",
        props:{
            data:{
                default:()=>[],
            },
            border:{
                default:false
            },
            showOverflowTooltip:{
                default:false
            },
            tooltipEffect:{
              default:"dark"
            },
            loading:{
                default:false
            },
            stripe:{
                default:true
            },
            search:{
                default:false
            },
            height: {
                type: Number,
                default () {
                    return 0;
                }
            }
        },
        computed:{
            // height(){
            //     return window.screen.availHeight - (window.outerHeight-window.innerHeight) - 270
            // },
            // maxHeight(){
            //     return window.screen.availHeight - (window.outerHeight-window.innerHeight) - 190
            // }
        },
        methods:{
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #F6F8FA;color: #262626;font-weight: 500;'
                }
            },
            selectChange(selection){
                this.$emit('selection-change',selection)
            },
            rowClick(row,event,column){
                let data = {
                    row:row,
                    event:event,
                    column:column
                }
                this.$emit('row-click',data);
            }
        }
    }
</script>

<style scoped>
</style>
