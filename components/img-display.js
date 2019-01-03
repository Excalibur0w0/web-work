// 得到一个目标节点，然后在目标节点下进行img展示块的分配
module.exports = (() => {
  const setImgBox = (rootDom, blockConfig) => {
    rootDom.className = 'img-box'
    let bg = document.createElement('div')
    let charBox = document.createElement('div')

    bg.className = 'bg'
    bg.style = `background: url('${blockConfig.url}') ${blockConfig.showArea[0] * 100}% ${blockConfig.showArea[1] * 100}% / cover`
    charBox.className = 'char-box'
    for (let i = 0; i < blockConfig.msg.length; i++) {
      let a = document.createElement('a')
      a.innerText = blockConfig.msg[i].name
      a.href = blockConfig.msg[i].url
      charBox.appendChild(a)
    }

    rootDom.appendChild(bg)
    rootDom.appendChild(charBox)
  }

  return (tarDom, config) => {
    for (const key in config) {
      let blockConfig = config[key]
      let block = document.createElement('div')
      let childsConfig = blockConfig['childrens']

      block.style.width = blockConfig.width

      if (childsConfig) {
        // 如果block有child，说明该block是复合的块
        // 如果子img-box数量为4， 采用第一种排列方式
        if (childsConfig.length === 4) {
          block.className = 'img-boxes-ftype'
        }
        // 对子层每一个img-box进行设置信息
        for (const childKey in childsConfig) {
          let childConfig = childsConfig[childKey]
          let dom = document.createElement('div')
          setImgBox(dom, childConfig)
          block.appendChild(dom)
        }
      } else {
        setImgBox(block, blockConfig)
      }

      tarDom.appendChild(block)
    }
  }
})()