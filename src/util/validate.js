/*
* option:{
* number: 验证位数 array [x,y]
* email：是否邮箱
* phone:是否手机
* } by wzd
* */
export const numberCheck = (arr)=>{
    let min = arr[0]===undefined?0:arr[0];
    let max = arr[1]===undefined?256:arr[1];
    return function(str){
        return str.length>=min && str.length<=max;
    }
}
export const emailCheck = (str)=>{
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    return reg.test(str)
}

export const phoneCheck = (str)=>{
    let reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
    return reg.test(str)

}

export const initValidate = (options)=>{
    let checkFn = Object.create(null);

    if(options.number!==undefined){
        checkFn.numberCheck = numberCheck(options.number)
    }
    if(options.email!== undefined && options.email==true){
        checkFn.emailCheck = emailCheck
    }
    if(options.phone!== undefined && options.phone ==true){
        checkFn.phoneCheck = phoneCheck
    }
    let process = true

    return  checkFn
}
export default  {
    initValidate
}