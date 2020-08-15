<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
        message: '哈哈哈',
      }
    },
    mounted() {
      // 1.创建BScroll对象
      //probe 侦测  
      // 0,1 都是不侦测实时位置
      // 2 在手指滚动的过程中侦测，手指离开后的惯性滚动过程中不侦测
      // 3 只要是滚动，都侦测
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,  
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // console.log(position);
          this.$emit('scroll', position)
        })
      }

      // 3.监听scroll滚动到底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      //封装 this.scroll.scrollTo()方法让父组件调用
      // this.scroll.scrollTo(0,0)  返回页面顶部(有3个参数 x:返回到x轴的位置 ，y:返回到y轴的位置 ，time:返回过程所需的时间)
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      //this.scroll &&  判段是否有scroll对象，没有则不执行后面的代码
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
