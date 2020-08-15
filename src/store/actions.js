import {
    ADD_COUNTER,
    ADD_TO_CARTS
} from './mutation-types'

export default {
    addToCart(context, payload) {
        // 1.查找之前的数组是否有该商品   find()
        let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

        //2.判断oldProduct
        if (oldProduct) {
            // oldProduct.count += 1
            context.commit('ADD_COUNTER', oldProduct)
        } else {
            payload.count = 1
                // state.cartList.push(payload)
            context.commit('ADD_TO_CARTS', payload)

        }
    }
}