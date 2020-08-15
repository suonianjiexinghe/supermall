import { debounce } from './utils'
import BackTop from 'components/content/backtop/BackTop'

export const imgListenerMixin = {
    data() {
        return {
            imgListener: null,
            newRefresh: null
        }
    },
    mounted() {
        this.newRefresh = debounce(this.$refs.scroll.refresh, 200)
        this.imgListener = () => {
            this.newRefresh()
        }
        this.$bus.$on('itemImgLoad', this.imgListener)
    }
}

export const backTopMixin = {
    data() {
        return {
            isShow: false
        }
    },
    components: {
        BackTop
    },
    methods: {
        backTop() {
            //this.$refs.scroll拿到子组件的scroll对象
            this.$refs.scroll.scrollTo(0, 0, 200)
        },
        BackTopShow(position) {
            this.isShow = (-position.y) > 1000
        }
    }
}