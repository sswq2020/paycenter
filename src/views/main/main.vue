<template>
	<HletongLayout v-on:loginOut="loginOut" :systemId="systemId">
		<router-view></router-view>
	</HletongLayout>
</template>

<script>
    import {SystemId} from "common/env.js"
	export default {
		name:'Main',
		data(){
			return {
				systemId:SystemId
			}
		},
		watch: {
			$route(to,from){
				// console.log(to);
				this.$refs.hlLayout.getUrl()
			}
		},
		methods:{
			loginOut(){
				if(process.env.NODE_ENV == 'development'){
                    this.$router.push({name:'login'})
                }
                else{
                    this.$api.goLogin();
                }
			}
		}
	}
</script>