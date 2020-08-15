import {
    ADD_COUNTER,
    ADD_TO_CARTS
} from './mutation-types'

export default {
    // mutations 唯一的目的就是修改state中的状态
    // mutations 中的每一个方法尽可能完成的事情比较单一一点
    ADD_COUNTER(state, payload) {
        payload.count++
    },
    ADD_TO_CARTS(state, payload) {
        state.cartList.push(payload)
    }
}