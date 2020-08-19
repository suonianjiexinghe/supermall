// 配置文件目录别名
module.exports = {
  configureWebpack: {
    resolve: { // 解决路径想关问题
      alias: { // 别名
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}
