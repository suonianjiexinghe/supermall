<template>
  <div>
    <swiper>
      <swiper-item v-for="item in banners" :key="item.index">
        <a :href="item.link"> 
          <img :src="item.image" @load="imageLoad">
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
// 引入轮播图组件
import {Swiper, SwiperItem} from 'components/common/swiper'

 export default {
   name: 'HomeSwiper',
   props: {
     banners: {
       type: Array,
       define() {
         return []
       }
     }
   },
   data() {
     return {
       isLoad: false
     }
   },
   methods: {
     imageLoad() {
       if(!this.isLoad) {
         this.$emit('swiperImageLoad')
         this.isLoad = true
       }
     }
   },
   components: {
     Swiper,
     SwiperItem
   },
}

</script>
<style>
</style>