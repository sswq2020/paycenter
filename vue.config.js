console.log('环境--------' + process.env.NODE_ENV)
const path = require('path')
const Time = new Date().getTime();
function resolve(dir){
    return path.resolve(__dirname,dir)
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : (process.env.NODE_ENV === 'test' ? '/' : '/'), // 打包输入的时候index.html前面加上了链接/
    devServer: {
        proxy: {
            '/api': {
                // target: 'https://beidou.hletong.com/',
                target: 'http://192.168.4.16:25097/', // 仲栋平 不需要跟payacc
                // target: 'http://10.1.15.106:8445/',//田间波主机
                // target:'http://10.1.15.119:8202/',
                // target:'http://192.168.4.16:25083/',//liudongcai serve
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                },
                headers: {
                    // "Cookie": "__sid=623B92BA9CB54433A288E39FF0C3A0F6", // 超级管理员
                    // "Authorization":'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiV0VCUyJdLCJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE1NDIyODcxNDcsImF1dGhvcml0aWVzIjpbInN1cGVyIiwiYWRtaW4iXSwianRpIjoiYzJkOGRkYTAtZjAwNy00NDdjLTg4Y2EtMTgwMjRhOWJlZGI2IiwiY2xpZW50X2lkIjoiemhlbmctdXBtcy1zZXJ2ZXIifQ.cqfCHUn8zCcTpVK-BOBNnZE5mgaczaQhAXE3Kb2Mcss'
                }
            }
        }
    },
    configureWebpack: {
		externals: {
			hlet: 'hlet'
		}
	},    
    lintOnSave: false,
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'test') {
            config.output.filename(`[name].${Time}.[hash].js`).end();
        }
        config.resolve.alias.set("@", resolve("src"));
        config.resolve.alias.set("components", resolve("src/components"));
        config.resolve.alias.set("common", resolve("src/common"));
        config.resolve.alias.set("views", resolve("src/views"));
        config.resolve.alias.set("api", resolve("src/api"))
        config.resolve.alias.set("util", resolve("src/util"))
    },
}
