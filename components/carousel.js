module.exports = (() => {
  const genCalAnime = (contentVisual, contentActual, sliderWap) => {
    // 不好，应该改成index驱动视图
    // const contentVisual = document.getElementById('series-content')
    // const contentActual = document.getElementById('series-content-pos')
    // const sliderWap = document.getElementById('slider-formal-game')

    if (contentActual.children.length <= 0) {
      return
    }

    const freshSelect = (curIndex) => {
      // 改变图标选中状态
      sliderWap.children.forEach((other, index) => {
        if (curIndex !== index) {
          other.className = ""
        }
      })
      sliderWap.children[curIndex].className = "select"
    }
    const changeTranslate = (target, distance, totalPage, index) => {
      let offWidth = 0 // 本次需要进行的偏移量
      if (!target.style.transform) {
        target.style.transform = "translateX(0px)";
      }
      // 如果没传入index的策略 测评
      if (index === undefined) {
        let match = target.style.transform.match(/X\((-?\d+)/)
        let curTranslateX = match[1] - 0
        // 计算当前所在页
        index = Math.floor(Math.abs(curTranslateX) / distance)

        // 通过计算 当前偏移量是否小于 总共的偏移量 来判断是否抵达轮播尾部
        if (index + 1 < totalPage) {
          // 本次的偏移量为 当前偏移量 减去 指定距离（可视部分）
          offWidth = curTranslateX - distance
          index++
        } else {
          index = 0
        }
      } else {
        offWidth = -index * distance
      }
      target.style.transform = "translateX(" + offWidth + "px)";
      freshSelect(index)
    }
    let interval = null
    let visualWidth = contentVisual.offsetWidth
    let actualWidth = contentActual.offsetWidth
    let totalPage = actualWidth / visualWidth


    // 如果点击了轮播的切换， 则轮播对应进行唯一
    const createMoveInv = (() => {
      let interval = setInterval(() => {
        changeTranslate(contentActual, visualWidth, totalPage)
      }, 10000)

      return interval
    })

    interval = createMoveInv()

    // 为轮播按钮注册点击事件
    sliderWap.children.forEach((item, index) => {
      item.onclick = () => {
        // 清除定时器
        clearInterval(interval)
        // 进行切换动画
        changeTranslate(contentActual, visualWidth, totalPage, index)
        // 切换动画后 重置定时器
        interval = createMoveInv()

        currentIndex = index
      }
    })
  }

  // "Th06": {
  //   url: "../../public/formal-game/Th06.jpg",
  //   showArea: [0.5, 0.5], // x and y
  //   title: "东方红魔乡",
  //   desc: "Win正作第一发",
  //   msg: "2002-08-11"
  // },

  const genContentActual = (wapDom, config) => {
    const contentActual = document.createElement('div')
    contentActual.className = "series-content-pos"
    for (const key in config) {
      let item = config[key]
      let seriesWork = document.createElement('div')
      let workImg = document.createElement('div')
      let workImgMask = document.createElement('div')
      let workTitle = document.createElement('div')
      let workDesc = document.createElement('div')
  
      seriesWork.className = 'series-work'
      workImg.className = 'work-img'
      workImgMask.className = 'work-img-mask'
      workImg.style.background = `url('${item.url}') ${item.showArea[0] * 100}% ${item.showArea[1] * 100}% / cover`
      workImgMask.innerText = item.msg
      workTitle.innerText = item.title
      workDesc.innerText = item.desc

      workImg.appendChild(workImgMask)
      seriesWork.appendChild(workImg)
      seriesWork.appendChild(workTitle)
      seriesWork.appendChild(workDesc)
      contentActual.appendChild(seriesWork)
    }

    wapDom.appendChild(contentActual)
    return contentActual
  }

  return {
    genCalAnime,
    genContentActual
  }
})()