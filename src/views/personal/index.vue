<template>
	<HletongSelf v-on:passLoginOut="passLoginOut"/>
</template>

<script>
    export default {
        name:'UserInfo',
        methods:{
            passLoginOut(){
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
