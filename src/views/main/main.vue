<template>
	<HletongLayout v-on:loginOut="loginOut">
		<router-view></router-view>
	</HletongLayout>
</template>

<script>
	export default {
		name:'Main',
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