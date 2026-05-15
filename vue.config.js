const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:7001",
        changeOrigin: true
      },
      "/adminapi": {
        target: "http://localhost:7001",
        changeOrigin: true
      }
    },
    client: {
      overlay: {
        runtimeErrors: (error) => {
          const ignoreErrors = [
            'ResizeObserver',
            'hydration'
          ]
          return !ignoreErrors.some(pattern => error.message.includes(pattern))
        }
      }
    }
  }
})
