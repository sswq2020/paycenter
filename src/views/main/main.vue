<template>
	<HletongLayout v-on:loginOut="loginOut" systemId="153907405736902656">
		<router-view></router-view>
	</HletongLayout>
</template>

<script>
	export default {
		name:'Main',
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