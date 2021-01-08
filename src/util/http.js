import axios from 'axios'
import qs from 'qs'



axios.timeout = 60000
axios.defaults.withCredentials=true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = '/api';
}

/**
 * 封装get方法
 */
export function get(url, params = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
            headers: headers
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 下载文件get方法
 */
export function getFile(url, params = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
            headers: headers,
            responseType: "blob"
        })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err)
            })
    })
}
/**
 * 封装post方法
 */
export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data))
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 表单带有文件时调用post方法
 */
export function postForm(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }})
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}