import { MessageBox  } from 'element-ui';
import _ from 'lodash'

export const _toArray_ = obj =>{
    let arr = []
    for(let key in obj){
        arr.push({
            value:key,
            label:obj[key]
        })
    }
    return arr
}

export function _debounce(func, delay) {
    let timer
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

export function requestParamsByTimeRange(Params,timeRange=[],s,e){
    let obj =_.cloneDeep(Params);
    if (timeRange && timeRange.length === 2) {
        obj[s] = timeRange[0].getTime();
        obj[e] = timeRange[1].getTime();
    }else{
        obj[s] = null;
        obj[e] = null;
    }
    return obj    
}

export function requestParamsByStatus(Params,arr=[],key='status'){
    let obj =_.cloneDeep(Params);
    obj[key] = arr.map((item)=>{return Number(item)})
    return obj
}

export function failHtml(obj){
    let values = Object.values(obj);
    return values.map((item)=>{
          return `<div>${item}</div>`
     }).join("")
 }
 
export function Message_fail(fn,data=[]){
    MessageBox ({
         title:"系统错误",
         dangerouslyUseHTMLString: true,
         message: fn(data),
         duration: 0,
         showClose:false,
         closeOnClickModal:false
     });
 } 
 