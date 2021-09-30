module.exports = {
  devServer: {
    proxy: {
      '/api':{
        target: 'https://autumnfish.cn/',
        changeOrigin: true,
        ws:  true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}