import axios from "axios";


// 初始化axios实例
const instance = axios.create();
// instance.defaults.baseURL = 'http://localhost:8088/api';
instance.defaults.baseURL = '/api';
instance.defaults.timeout = 20000;

// get方法
export const $get = async (url, params) => {
    try {
        // console.log(url);
        let { data } = await instance.get(url, { params })
        return data
    } catch (error) {
        console.log(error);
    }
}

// post方法
export const $post = async (url, params) => {
    try {
        let { data } = await instance.post(url, params)
        return data
    } catch (error) {
        console.log(error);
    }

}

// put方法
export const $put = async (url, params) => {
    try {
        let { data } = await instance.put(url, params)
        return data
    } catch (error) {
        console.log(error);
    }

}

// delete方法
export const $delete = async (url, params) => {
    try {
        let { data } = await instance.delete(url, { params })
        return data
    } catch (error) {
        console.log(error);
    }
}
