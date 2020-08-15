export function debounce(func, delay) {
    // debounce 防抖函数 当触发事件时，延迟一定时间再执行函数，如果在规定时间内频繁执行，则会从新开始计算时间，然后再执行，有效的减少请求次数
    // throttle 节流   减少一段时间内事件的触发频率，等时间到了再执行函数  
    let timer = null
    return function(...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

export function formatDate(date, fmt) {
    // 1.获取年份
    // y
    // y+ -> 1个或者多个y
    // y* -> 0个或者多个y
    // y? -> 0个或者1个y

    // 2019
    // yy  - 19
    // yyyy - 2019
    // y - 9
    // yyy - 019
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}