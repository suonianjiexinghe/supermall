<template>
  <div class="home wrapper" >
    <nav-bar class="home-nav"><slot slot="center">购物街</slot></nav-bar>

    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" />
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBacktop"/>
  </div>
</template>

<script>
// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

//公共组件
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backtop/BackTop'

import {getHomeMultidata, getHomeGoods} from 'network/home'




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
     }
   },
   computed: {
     showGoods() {
       return this.goods[this.currentType].list
     },

   },
   created() {
    //  1. 请求多个数据
      this.getHomeMultidata(),
     // 2.请求商品数据
      this.getHomeGoods('pop'),
      this.getHomeGoods('new'),
      this.getHomeGoods('sell')
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
     },
     backClick() {
       this.$refs.scroll.scroll.scrollTo(0, 0, 500)
     },
     contentScroll(position) {
      this.isShowBacktop = -position.y > 1000
     },
     loadMore() { 
       // 监听图片什么时候加载完
      this.getHomeGoods(this.currentType)

      // 从新计数图片高度
      this.$refs.scroll.scroll.refresh()
     },
     
      /** 
     网络请求相关的方法
      */
     getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
     },
     getHomeGoods(type) {
       const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
         this.goods[type].list.push(...res.data.list) //...res.data.list就是把res.data.list的数据遍历出来和 for..in效果一样
         this.goods[type].page += 1   //请求完成后页码 +1

         this.$refs.scroll.finishPullUp()
     })
     }
   },
}

</script>

<style scoped>
  .home {    
    height: 100vh;   /* vh 视图高度 vw视图宽度 */
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    width: 100%;

    top: 0;
    z-index: 9;
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