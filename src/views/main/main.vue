<template>
	<HletongLayout v-on:loginOut="loginOut" :systemId="systemId">
		<router-view></router-view>
	</HletongLayout>
</template>

<script>
	const SystemId = process.env.NODE_ENV === 'production' ? "166948708439556096": "153907405736902656"
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