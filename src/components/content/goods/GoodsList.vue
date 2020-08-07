<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :key="item.index" :goodsItem="item"></goods-list-item>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem'
 export default {
   name: 'GoodsList',
   components: {
     GoodsListItem
   },
   props: {
     goods: {
       type: Array,
       defualt() {
         return []
       }
     }
   }

}

</script>
<style>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    padding: 2px;
  }

</style>