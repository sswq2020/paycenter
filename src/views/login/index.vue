<template>
    <div class="container">
        <div class="box">
            <div id="paper"></div>
        </div>
        <div class="box">

            <div class="box-card">
                <span>username:</span><el-input v-model="username" placeholder="please set login name" class="login-name"></el-input>
                <span>password:</span><el-input v-model="password" placeholder="please set password" class="login-password" type="password"></el-input>
                <div style="text-align: center"><el-button type="primary" class="btn-submit" @click="login">submit</el-button></div>
            </div>
        </div>

    </div>
</template>
<script>
    // import spritejs from 'spritejs'
    export default {
        name: 'login',
        data(){
            return {
                username:'admin',
                password:'123456',
                grant_type:'password',
                client_id:'zheng-upms-server',
                client_secret:'123456'
            }
        },
        computed:{
            loginParams(){
                return {
                    username :this.username,
                    password:this.password,
                    grant_type:this.grant_type,
                    client_id:this.client_id,
                    client_secret:this.client_secret
                }
            }
        },
        methods:{
            login(){
                this.$api.login(this.loginParams).then(res=>{
                    this.$router.push({name:'main',params:this.loginParams})
                })
            }
        },
        mounted(){
        }
    }

</script>

<style lang="less" scoped>
    .container {
        width:100%;
        height:100%;
        position: relative;
        .box{
            position: absolute;
            width:100%;
            height:100%;
            top:0;
            left:0;
            #paper{
                width:500px;
                height:500px;
                margin: 60px auto 0 auto;
            }
            .box-card {
            width: 260px;
            margin: 230px auto 0 auto;
            .login-password{
            margin-bottom: 20px;
            }
            .login-name{
            margin-bottom: 10px;
            }
            }
        }
        .router-view{
            width: 100%;
        }
    }
</style>
