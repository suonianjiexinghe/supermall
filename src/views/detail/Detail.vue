<template>
  <div id="detail">
    <detail-nav-bar class="detail-navbar" @titleClick="titleClick" ref="navbar"/>
    <scroll class="detail-scroll" ref="scroll" :probe-type="3" @probeScroll="probeScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop :shop="shop"/>
      <detail-img-show :detail-info="detailInfo" @imgListLoad="imgListLoad"/>
      <detail-params :item-params="itemParams" ref="params"/>
      <detail-comment :comment="comment" ref="comment"/>
      <goods-list :goods="recommend" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backTop" v-show="isShow"/>
    <div class="gwc" v-show="carsShow">{{cars}}</div>
    <!-- <toast :message="message" :toast-show="toastShow"/> -->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShop from './childComps/DetailShop'
import DetailImgShow from './childComps/DetailImgShow'
import DetailParams from './childComps/DetailParams'
import DetailComment from './childComps/DetailComment'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import DetailBottomBar from './childComps/DetailBottomBar'
// import Toast from 'components/common/toast/Toast'

import {getDetail,Goods,Shop,getRecommend} from 'network/detail'
import {imgListenerMixin,backTopMixin} from 'common/mixin'
import {debounce} from 'common/utils'
//  import {TOP_DISTANCE} from 'common/const'

//  import { mapActions } from 'vuex'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShop,
    DetailImgShow,
    DetailParams,
    DetailComment,
    GoodsList,
    Scroll,
    DetailBottomBar,
    // Toast
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      itemParams: {},
      comment: {},
      recommend: [],
      themeTopY: [],
      getThemeTopY: null,
      currentIndex: 0,
      cars: null,
      carsShow: false
      // toastShow: false,
      // message: ''
    }
  },
  mixins: [imgListenerMixin,backTopMixin],
  created() {
    // 1.获取商品id
    this.iid = this.$route.query.iid
    /* 2.根据id请求数据 */
    getDetail(this.iid).then(res => {
      // console.log(res);
      const data = res.result
      this.topImages = data.itemInfo.topImages
      // 3.创建商品对象并传入数据
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 4.创建店铺对象并传入数据
      this.shop = new Shop(data.shopInfo)
      // 5.获取详细信息
      this.detailInfo = data.detailInfo
      // 6.获取参数信息
      this.itemParams = data.itemParams
      if(data.rate.cRate!==0) {
        this.comment = data.rate.list[0]
      }
      //this.$nextTick()当DOM渲染完后回调(不包含图片)
      // this.$nextTick(() => {}
    })

    // 7.获取详情页推荐商品数据
    getRecommend().then(res => {
       this.recommend = res.data.list
    })
    // 8.给themeTopY赋值
    this.getThemeTopY = debounce(() => {
        this.themeTopY = []
        this.themeTopY.push(0)
        this.themeTopY.push(this.$refs.params.$el.offsetTop)
        this.themeTopY.push(this.$refs.comment.$el.offsetTop)
        this.themeTopY.push(this.$refs.recommend.$el.offsetTop)
      })
  },
  mounted() {
    
  },
  destroyed() {
    this.$bus.$off('itemImgLoad',this.imgListener)
  },
  methods: {
    // ...mapActions(['addToCart']),
    imgListLoad() {
      this.newRefresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0 , -this.themeTopY[index], 200)
    },
    probeScroll(position) {

      const positionY = -position.y

      let length = this.themeTopY.length
      for(let i = 0; i<length-1; i++) {
        if(this.currentIndex !== i && positionY >= this.themeTopY[i] && positionY < this.themeTopY[i+1]) {
          this.currentIndex  = i
          this.$refs.navbar.currentIndex = this.currentIndex
        }
      }

      
        //2)、监听BackTop是否显示
        this.isShow = -position.y > 1000;
    },

    //加入购物车
    addToCart() {
      // 1.获取购物车需要展示的信息
      const cartData = {}
      cartData.image = this.topImages[0]
      cartData.title = this.goods.title
      cartData.desc = this.goods.desc
      cartData.price = this.goods.realPrice
      cartData.iid = this.iid
      // 2.将商品添加到购物车里
      this.$store.dispatch('addToCart', cartData).then(res => {
        this.toastShow = true;
        this.message = res

        setTimeout(() => {
          this.toastShow = false
          this.message = ''
          
        },1000)
        this.carsShow = true
        this.cars = res
        if(this.carsShow == true) {
          setTimeout(() => {
            this.carsShow = false
          }, 1000);
        }
        
      })
      // this.$store.dispatch('addToCart', cartData).then(res =>{
      //   console.log(res);
      // })

      // this.addToCarts(cartData).then(res => {
      //   console.log(res);
      // })
      // this.$store.dispatch('addToCart', cartData).then(res => {
      //   this.toastShow = true;
      //   this.message = res

      //   setTimeout(() => {
      //     this.toastShow = false
      //     this.message = ''
      //   },1000)
      // })
    },
  }
}
</script>

<style>
  #detail {
    position: relative;
    z-index: 9;
    background: #fff;
    height: 100vh;
  }

  .detail-navbar {
    position: relative;
    z-index: 9;
    background: #fff;
  }

  .detail-scroll {
    position: relative;
    height: calc(100% - 44px - 49px);
  }
  .gwc {
    position: fixed;
    flex: 1;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: black;
    color: white;
    font-size: 18px;
    transform: translate(-50%,-50%);
  }
</style>