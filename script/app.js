const module = {}

const app = (() => {
  const simEvent = (() => {
    const SimpleEvent = (() => {
      const SimpleEvent = function () {
        this.eventList = {
          // 第三次发现事件应该用链式来实现
          // "demoEvent": {
          //   next: {
          //     value: func,
          //     type: 'once',
          //     next: action,
          //   },
          //   currentAction: action, // 保存当前所处的action位置
          //   actionCount: 0
          // }
        }
      }
  
      SimpleEvent.prototype = {
        constructor: SimpleEvent,
        on(eName, eAction) {
          let action = {
            value: eAction,
            type: 'on',
            next: null
          }
  
          if (this.eventList[eName]) {
            let currentAction = this.eventList[eName].currentAction
            currentAction.next = action
            this.eventList[eName].currentAction = action
            this.eventList[eName].actionCount++
          } else {
            // 否则初始化
            this.eventList[eName] = {
              next: action,
              currentAction: action,
              actionCount: 1
            }
          }
        },
  
        once(eName, eAction) {
          let action = {
            value: eAction,
            type: 'once',
            next: null
          }
  
          if (this.eventList[eName] && this.eventList[eName].next && this.eventList[eName].currentAction) {
            let currentAction = this.eventList[eName].currentAction
            currentAction.next = action
            this.eventList[eName].currentAction = action
            this.eventList[eName].actionCount++
          } else {
            // 否则初始化
            this.eventList[eName] = {
              next: action,
              currentAction: action,
              actionCount: 1
            }
          }
        },

        onceTriggerOne(eName, eAction) {
          let action = {
            value: eAction,
            type: 'once-trigger-one',
            next: null
          }
  
          if (this.eventList[eName] && this.eventList[eName].next && this.eventList[eName].currentAction) {
            let currentAction = this.eventList[eName].currentAction
            currentAction.next = action
            this.eventList[eName].currentAction = action
            this.eventList[eName].actionCount++
          } else {
            // 否则初始化
            this.eventList[eName] = {
              next: action,
              currentAction: action,
              actionCount: 1
            }
          }
        },
  
        emit(eName, ...args) {
          let eventActs = this.eventList[eName]
  
          if (!eventActs) {
            return
          }
  
          let onceAndOne = 0
          let prevAction = eventActs
          for (let action = eventActs.next, count = 0, depth = eventActs.actionCount; action && count < depth; action = action.next, count++) {
            if (action.type === 'once-trigger-one' && onceAndOne > 0) {
              // once-trigger-one的场景，应该能继续触发其他类型的事件， 但是o&o只能被触发一次
              continue
            }

            if (action.value) {
              action.value(...args)
            }

            if (action.type === 'once' || (action.type === 'once-trigger-one' && ++onceAndOne) ) {
              // 如果action的下一位为空，则代表当前action为currentAction
              // 则需要把currentAction置为上一位
              if (!action.next) {
                eventActs.currentAction = count === 0 ? undefined : prevAction
              }
              eventActs.actionCount--
              prevAction.next = action.next
            } else if (action.type === 'on') {
              prevAction = prevAction.next
            }
          }
        }
      }
  
      return SimpleEvent
    })()

    let simEvent = new SimpleEvent()

    // 设置export值
    ;
    (() => {
      Object.defineProperty(module, 'exports', {
        get() {
          return data
        },
        set(newValue) {
          data = newValue
          //事件监听
          simEvent.emit('updateExport', data)
        }
      })
    })()

    return simEvent
  })()

  const _require = importPath => {
    if (typeof importPath === 'string' && importPath.match(/.*\.js/)) {
      const newscript = document.createElement('script')

      newscript.setAttribute('type', 'text/javascript')
      newscript.setAttribute('src', importPath)
      document.body.appendChild(newscript)
    }
  }

  const App = (() => {
    const privateMap = new WeakMap()

    const App = function () {
      privateMap.set(this, {
        configs: {
          // this.require('')
        },
        modules: {}
      })
    }

    App.prototype = {
      constructor: App,
      require(importPath, callback) {
        // 注册require的回掉函数
        simEvent.onceTriggerOne('updateExport', newValue => {
          let _export = newValue
          if (!_export) {
            callback(`update Export Error: the newValue is ${_export}`, _export)
          } else {
            callback(null, _export)
          }
        })
        _require(importPath)
      },
      defineModule(moduleName, importPath, callback) {
        let modules = privateMap.get(this).modules

        // 如果模块已经存在，抛出错误
        for (const key in modules) {
          // 当exports存在的时候，才进行是否存在的判断
          if (modules[key].exports) {
            if (key === moduleName) {
              throw new ReferenceError(
                `the module: ${moduleName} also has exist!`
              )
            }

            if (modules[key] && modules[key].path === importPath) {
              throw new ReferenceError(
                `the importPath: ${importPath} also has exist!`
              )
            }
          }
        }

        let module = (modules[moduleName] = {
          path: importPath,
          exports: null
        })

        // 否则引入模块
        this.require(importPath, (err, data) => {
          if (err) {
            console.log('err is ', err)
          }
          module['exports'] = data
          callback(err, data)
        })
      },
      getModule(moduleName) {
        let modules = privateMap.get(this).modules

        return modules && modules[moduleName]
      },
      // test () {
      //   return privateMap.get(this)
      // },
      createEvent() {
        return new SimpleEvent()
      }
    }

    return App
  })()

  return new App()
})()

// 为HTMLCollection注入forEach方法，便于我们对DOM数的遍历
;(() => {
  HTMLCollection.prototype.forEach = function (action) {
    for (let i = 0, len = this.length; i < len; i++) {
      // i作为index传入
      action(this[i], i)
    }
  }

  HTMLCollection.prototype.map = function (action) {
    let result = []
    
    for (let i = 0, len = this.length; i < len; i++) {
      // i作为index传入
      result.push(action(this[i], i))
    }

    return result
  }

  HTMLCollection.prototype.filter = function (action) {
    let result = []
    for (let i = 0, len = this.length; i < len; i++) {
      // i作为index传入
      if (action(this[i], i)) {
        result.push(this[i])
      }
    }

    return result
  }
})()