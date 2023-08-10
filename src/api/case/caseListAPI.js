import { $get } from '../../utils/request'
import { $post } from '../../utils/request'

//查询用例的接口
// 这个case指的是，请求URL中需要跟baseURL拼接的部分
export let $caseListAPI = async (params) => {
    const allCase = await $get('/caseList/getALLCase', params);
    const dataString = JSON.stringify(allCase)
    // console.log("allCaseObject：" + dataString)
    return allCase;
}


export let $executeHistory = async (params) => {
    console.log("start get CaseHistory")
    const data = await $post('/caseList/getCaseExecuteHistory', params);
    const dataString = JSON.stringify(data)
    console.log("正在调用服务端接口：" + JSON.stringify(params))
    return data;
}



export let $deleteCase = async (params) => {
    const data = await $post('/caseList/delectCaseById', params);
    const dataString = JSON.stringify(data);
    console.log("正在调用服务端【删除用例】接口：" + dataString)
    return data;
}


export let $addCase = async (params) => {
    const data = await $post('/addCase', params);
    const dataString = JSON.stringify(data);
    console.log("正在调用服务端【添加用例】接口：" + dataString)
    return data;
}

export let $executeCase = async (params) => {
    const data = await $post('/caseList/executeCase', params);
    const dataString = JSON.stringify(data);
    console.log("正在调用服务端【执行】接口：" + dataString)
    return data;
}