<template>
  <div id="home" class="wrapper" >
    <nav-bar class="home-nav"><slot slot="center">购物街</slot></nav-bar>
    <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1"  v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl" ></tab-control>
      <goods-list :goods="showGoods" ref="goodsList"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBacktop"/><!--click.native(直接监听组件的原生点击)-->
  </div>
</template>

<script>
// 子组件
import HomeSwiper from './childComps/HomeSwiper'         //--------------------第三步 轮播图
import RecommendView from './childComps/RecommendView'   // -----------------第四步  介绍
import FeatureView from './childComps/FeatureView'       //---------------第五步 本周流行

//公共组件
import NavBar from 'components/common/navbar/NavBar'     // --------第二步 导航栏
import TabControl from 'components/content/tabControl/TabControl'    // -----------第六步  导航控制
import GoodsList from 'components/content/goods/GoodsList'    // --------------第七步 商品数据
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backtop/BackTop'

import {getHomeMultidata, getHomeGoods} from 'network/home'  // ------------网络请求
import {debounce} from 'common/utils'                        //--------------防抖函数
import {imgListenerMixin,backTopMixin} from 'common/mixin'



 export default {
   name: 'Home',
   components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,    //滚动
      BackTop
   },
   data() {
     return {
       banners: [],
       recommends: [],
       goods: {
         'pop':  {page: 0, list: []},  //page页码
         'new': {page: 0, list: []},
         'sell': {page: 0, list: []},
       },
       currentType: 'pop',
       isShowBacktop: false,
       tabOffsetTop: 0,
       goodsOffsetTop: 0,
       saveY: 0,
       isTabFixed: false,
     }
   },
   mixins: [imgListenerMixin,backTopMixin],
   computed: {
     showGoods() {
       return this.goods[this.currentType].list
     },

   },
    activated() {
      //进入该页面时的回调函数
      //回到离开前保存的Y值的位置 
      this.$refs.scroll.refresh()
      this.$refs.scroll.scrollTo(0, this.saveY, 0)

    },
    deactivated() {
      //离开该页面时的回调函数
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()
      
      //2.取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.imgListener)
    },
    // 生命周期函数 页面被创建后执行的请求数据
   created() {
      //将网络请求getHomeData()封装到methods中再调用methods中的getHomeData()（之所以要在created中调用是因为网络请求需要在组件创建好的时候发送）
    //  1. 请求多个数据
      this.getHomeMultidata(),
     // 2.请求商品数据
      this.getHomeGoods('pop'),
      this.getHomeGoods('new'),
      this.getHomeGoods('sell')
   },
   mounted() {
     // debounce 防抖 
     const refresh = debounce(this.$refs.scroll.refresh, 200)
      // 3. 监听item中图片加载完成
      this.$bus.$on('itemImgLoad', () => {
        refresh()
      })
   },  
   methods: {
      /* 
        事件监听相关方法
      */
     tabClick(index) {
       switch(index) {
         case 0:
           this.currentType = 'pop'
           break
         case 1:
           this.currentType = 'new'
           break
         case 2: 
           this.currentType = 'sell'
           break
       }
       this.$refs.tabControl1.currentIndex = index;
       this.$refs.tabControl.currentIndex = index;
       this.goodsOffset()
      //  console.log(this.$refs.scroll.scroll.y);
     },
     backClick() {
       this.$refs.scroll.scroll.scrollTo(0, 0, 500)
     },
     contentScroll(position) {
       // 1.判断BackTop是否显示
      this.isShowBacktop = -position.y > 1000

      // 2.决定tabControl是否吸顶（position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
     },
     loadMore() { 
       // 监听图片什么时候加载完
      this.getHomeGoods(this.currentType)

      // 从新计数图片高度
      this.$refs.scroll.scroll.refresh()
     },
     swiperImageLoad() {
        // 获取tabControl的offsetTop
        // 所有的组件都有一个属性$el：用于获取组件中的元素
       this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
     },
     goodsOffset() {
      this.goodsOffsetTop = this.$refs.goodsList.$el.offsetTop
      if(-this.goodsOffsetTop > parseInt(this.$refs.scroll.scroll.y) ) {
        this.$refs.scroll.scroll.scrollTo(0, -this.goodsOffsetTop, 500)
      }
     },
     
      /** 
     网络请求相关的方法
      */
     getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list  // 这里拿到的是轮播图点击图片的数据
        this.recommends = res.data.recommend.list  // recommend点击的数据
      })
     },
     getHomeGoods(type) {
       const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
         this.goods[type].list.push(...res.data.list) //...res.data.list就是把res.data.list的数据遍历出来和 for..in效果一样
         this.goods[type].page += 1   //请求完成后页码 +1

          // 完成下拉加载更多
         this.$refs.scroll.finishPullUp()
     })
     }
   },
}

</script>

<style scoped>
  #home {    
    height: 100vh;   /* vh 视图高度 vw视图宽度 */
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* position: fixed;
    width: 100%;

    top: 0;
    z-index: 9; */
  }
  .tab-control {
    position: sticky;
    top: 44px;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content {
    height: calc(100% - 94px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>