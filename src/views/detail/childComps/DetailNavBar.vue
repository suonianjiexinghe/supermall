<template>
  <div class="dnb">
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item, index) in title" 
             :key="item.index" 
             :class="{active: index === currentIndex}" 
             @click="titleClick(index)" 
             class="detail-nav-bar">
          {{ item }}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  export default {
    name: 'DatailNavBar',
    components: {
      NavBar
    },
    data() {
      return {
        title:['商品','评论','参数','推荐'],
        currentIndex: 0
      }
    },
    methods: {
      titleClick(index) {
        this.currentIndex = index
      },
      backClick()  {
        this.$router.back()
      }
    },

}

</script>
<style scoped>
  .dnb {
    box-shadow: 1px 1px 2px #a8a8a8;
  }
  .title {
    display: flex;
  }
  .detail-nav-bar {
    flex: 1;
  }
  .active {
    color: var(--color-high-text);
  }
  .back img {
    margin-top: 10px;
  }
</style>