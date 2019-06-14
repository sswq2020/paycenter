<template>
    <div class="container">
        <el-pagination
                background
                class="page"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination
                background>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {
            total: {
                default: 0
            },
            pageSizes: {
                default: ()=>[10, 20, 50, 100]
            },
            pageSize: {
                default: 10,
            },
            currentPage: {
                default: 1,
            }

        },
        methods:{
            handleSizeChange(size){
                this.$emit('sizeChange',size)
            },
            handleCurrentChange(page){
                this.$emit('pageChange',page)
            }
        }
    }
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
        .page{
            display: block;
            position: absolute;
            top:10px;
            right:10px;
        }
    }
</style>
