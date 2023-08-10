// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

module.exports = {
  transpileDependencies: true,
  lintOnSave: false,

  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    proxy: {
      '/api': {//表示拦截/api开头的请求路径
        target: 'http://localhost:8088',//产生跨域的地址    //代理目标服务器地址
        changeOrigin: true,  //是否开启跨域
        ws: false,
        pathRewrite: { //重写路径
          '^/api': ''  //替换路径中的/api为空字符
        }
      }
    },
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },

}
