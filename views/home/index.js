;
() => {
  const menus = document.getElementById('menus')

  const productMenuItems = txtValue => {
    let targetDom = document.createElement('span')
    let text = document.createElement('span')

    text.innerHTML = txtValue
    text.className = 'menu-item-text'
    targetDom.appendChild(text)
    targetDom.className = 'menu-item'

    return targetDom
  }

  let titles = [{
      text: '百度',
      url: 'http://www.baidu.com'
    },
    {
      text: '百度',
      url: 'http://www.baidu.com'
    }
  ]

  for (let i = 0, len = titles.length; i < len; i++) {
    menus.appendChild(productMenuItems(titles[i].text))
  }
} // 可以调用此匿名函数来装载menu的配置
;
(() => {
  const imgDisplay = document.getElementById('img-display')
  // app已经由 script 中的 app.js 注入全局
  app.defineModule('config.imgDisplay', '../../config/img-display.js', (err, imgDisplayConfig) => {
    app.defineModule('generator.imgDisplay', '../../components/img-display.js', (err, action) => {
      action(imgDisplay, imgDisplayConfig.type1)
    })
  })
})()
// 轮播事件组 后续组件化
;
(() => {
  const contentFormalVisual = document.getElementById('series-formal-content')
  const contentRecreVisual = document.getElementById('series-recreate-content')
  const contentAnimeVisual = document.getElementById('series-anime-content')
  const sliderFormalWap = document.getElementById('slider-formal-game')
  const sliderRecreWap = document.getElementById('slider-recreate-game')
  const sliderAnimeWap = document.getElementById('slider-anime')


  // 有时间进行Promise化
  app.defineModule('generator.carousel', '../../components/carousel.js', (err, actions) => {
    app.defineModule('config.carousel-formal', '../../config/carousel-fomal.js', (err, config) => {
      let contentFormalActual = actions.genContentActual(contentFormalVisual, config)
      actions.genCalAnime(contentFormalVisual, contentFormalActual, sliderFormalWap)
      let contentRecreActual = actions.genContentActual(contentRecreVisual, config)
      actions.genCalAnime(contentRecreVisual, contentRecreActual, sliderRecreWap)
      let contentAnimeActual = actions.genContentActual(contentAnimeVisual, config)
      actions.genCalAnime(contentAnimeVisual, contentAnimeActual, sliderAnimeWap)
    })
  })
})()
// 为第二层注册一个点击时间
;(() => {
  let block = document.getElementById('go-to-demo')
  block.onclick = () => {
    window.location.href = "../demo"
  }
  
})()