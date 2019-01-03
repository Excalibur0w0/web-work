;
(() => {
  let domWap = document.getElementById('character-wap')
  let domBg = domWap.children[1]
  let domContent = domWap.children[0]
  let domName = domContent.children[0]
  let domText = domContent.children[1]

  let getParamValue = (url, key) => {
    let regex = new RegExp(key + "=([^&]*)", "i");
    return url.match(regex)[1];
  }
  
  let name = getParamValue(window.location.href, "name")
  let path = getParamValue(window.location.href, "bg")

  // wap.style.height = "100vh"
  domBg.style.background = "url(../../public/character/" + path + ") 50% 50% / cover"

  app.defineModule('config.character', '../../config/char-msg.js', (err, charConfig) => {
    if (err) {
      console.error(err)
      return
    }
    domName.innerHTML = charConfig[name].title
    domText.innerHTML = charConfig[name].msg
  })
})()