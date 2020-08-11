import { request } from './request'

// export default 导出 import {} 才可以不要大括号
export function getHomeMultidata() {
    return request({
        url: '/home/multidata'
    })
}

// 封装了首页商品的网络请求  第七步
export function getHomeGoods(type, page) {
    return request({
        url: 'http://152.136.185.210:8000/api/z8/home/data',
        params: {
            type,
            page
        }
    })
}