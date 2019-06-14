<template>
	<div class="breadcrumb-container">
		<div class="title" v-show="data.length > 0">
			<span v-for="(item,index) in data" :key="index">{{item}}<i v-if="index != (data.length - 1)">/</i></span>
		</div>
		<div class="btns">
			<slot></slot>
		</div>
	</div>
</template>

<script>
    export default {
        name:'hl-breadcrumb',
        props:{
            data:{
                default:()=>[],
            }
        }
    }
</script>

<style lang="less" scoped>
	.breadcrumb-container{
		background-color: white;
		border-bottom:1px solid rgba(233, 233, 233, 1);
		height:50px;
		line-height: 50px;
		display:flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 15px;
		font-size: 14px;
		font-family: 'Microsoft YaHei';
		.title{
			color:#ccc;
			span{
				margin:0 4px;
				i{
					margin-left: 8px;
				}
			}
			span:last-child{
				color:#333;
			}
		}
		.btns{
			float: right;
		}
	}
</style>
