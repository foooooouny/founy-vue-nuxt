module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'founy-vue-nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'vue nuxt demo' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    // script: [
    //   {
    //     type: 'text/javascript',
    //     src: 'http://cdn.jsdelivr.net/editor/0.1.0/editor.js'
    //   },
    //   {
    //     type: 'text/javascript',
    //     src: 'http://cdn.jsdelivr.net/editor/0.1.0/marked.js'
    //   }
    // ],
    noscript: [
      { innerHTML: 'This website requires JavaScript.' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#3B8070'
  },
  // loading: '~/components/loading.vue',
  css: [
    'element-ui/lib/theme-default/index.css',
    // '//cdn.jsdelivr.net/medium-editor/latest/css/medium-editor.min.css',
    { src: 'bulma/bulma.sass', lang: 'sass' }
  ],
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'axios',
      'element-ui'
    ],
    /*
    ** Run ESLINT on save
    */
    babel: {
      plugins: [['component', [
        {
          libraryName: 'element-ui',
          styleLibraryName: 'theme-default'
        },
        'transform-async-to-generator',
        'transform-runtime'
      ]]],
      comments: true
    },
    // loaders: [
    //   {
    //     test: /\.css$/,
    //     loader: 'vue-style-loader!css-loader'
    //   }
    // ],
    // plugins: [
    //   'transform-runtime',
    //   ['component', [{
    //     libraryName: 'element-ui'
    //   }]]
    // ],
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/mock'
    // '~/plugins/mediumEditor'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  axios: {
    credentials: false
  },
  // 设置反向代理
  proxy: [
    ['/api',
      {
        target: 'http://m.maoyan.com',
        pathRewrite: { '^/api': '' }
        // changeOrigin: true,
        // secure: false
      }]
  ]
}
