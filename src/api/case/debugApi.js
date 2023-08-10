import { $get } from '../../utils/request'
import { $post } from '../../utils/request'


//调试的接口
export const $debugApi = async (params) => {
    const debugResult = await $post('/testDebug', params);
    const dataString = JSON.stringify(debugResult)
    console.log("jiekou canshu:" + JSON.stringify(params))
    return debugResult;
}


export const $saveApiInfo = async (params) => {
    const saveResult = await $post('/saveApiInfo', params);
    const dataString = JSON.stringify(saveResult)
    console.log("jiekou canshu:" + JSON.stringify(params))
    return saveResult;
}