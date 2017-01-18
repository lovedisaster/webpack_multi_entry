module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('postcss-url')(),
    require('postcss-cssnext'),
    require('precss')({ /* ...options */ })
  ]
}