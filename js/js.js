(function () {
    window.onload = function (){
        const whiteArr = ['src', 'title', 'placeholder', 'class']
        // 消息格式type: open\close\msg
        //注入的 页面接收消息
        chrome.extension.onConnect.addListener(function (cab) {
            cab.onMessage.addListener(function (msg) {
                console.log(msg);
                console.log('view 收到')
            })
        })
        // 通过插件触发这个事件。
        startObserve()
        /*
         *@method startObserve
         * 开启元素修改监听
        */
        function startObserve() {
            var targetNode = document.body;
            // childList: true, subtree: true
            var config = { attributes: true, childList: true, subtree: true, characterData: true };
            var callback = function (mutationsList, observer) {
                // 数据处理
                console.log(mutationsList)
                let keyValArr = formateKeyVal(mutationsList)
                // 通知插件，做json 更新
                sendHashKey(keyValArr)
            };
            // 创建一个observer示例与回调函数相关联
            var observer = new MutationObserver(callback);
            //使用配置文件对目标节点进行观测
            observer.observe(targetNode, config);
        }
        /*
        *@method formateList
        * 事件触发数据处理，提出修改的值与key
        */
        function formateKeyVal(list = []) {
            let keyValArr = []
            if (list && list.length > 0) {
                list.forEach((item) => {
                    console.log(item)
                    switch (item.type) {
                        case 'characterData':
                            // 元素修改 查找父集dom
                            keyValArr.push(_findKeyVal(item)); break;
                        case 'attributes':
                            // 白名单属性才找 改动
                            if (item && item.attributeName && whiteArr.includes(item.attributeName)) {
                                console.log(item.attributeName)
                                keyValArr.push(_findKeyVal(item))
                            }
                            ; break;
                        case '': ; break;
                        default: ;
                    }
                })
                console.log(keyValArr)
                console.log('-----------')
                return keyValArr
            }
            function _findKeyVal(item) {
                // 1 元素 2、属性 、3文本
                let baseObj = {
                    type: 'msg'
                }
                switch (item.target.nodeType) {
                    case 1:
                        if (item.attributeName === 'src') {
                            baseObj.value = item.target.currentSrc.replace(/https\/\/|http:\/\//g, '')
                            baseObj.key = findDataLe(item.target)
                        }
                        ; break;
                    case 2:
                        ; break;
                    case 3:
                        baseObj.value = item.target.nodeValue
                        baseObj.key = findDataLe(item.target.parentNode)
                            ; break;
                }
                console.log(baseObj)
                return baseObj
                function findDataLe(parentNode) {
                    if (parentNode) {
                        return parentNode.attributes["data-le"].nodeValue
                    }
                    return ''
                }
            }
        }
        // setInterval(() => {
        //     console.log('send key 123')
        //     sendHashKey([{ key: '123', value: 'qwe' }])
        // }, 5000)
        /*
        *@method sendHashKey
        * 通知插件
        */
        function sendHashKey(arr) {
            //向插件 发消息  todo 采用回调形式？
            arr.forEach((item) => {
                let bac = chrome.extension.connect({ name: "bgAndCon" });
                bac.postMessage({ key: item.key, value: item.value });
            })
        }
        Toast('qwe123')
        /*
        *@method Toast
        * 简易toast
        */
        function Toast(msg, duration) {
            duration = isNaN(duration) ? 3000 : duration;
            var m = document.createElement('div');
            m.innerHTML = msg;
            m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 6%;left: 50%;transform: translate(-50%, 0);z-index: 9999;background: rgba(0, 0, 0,.7);font-size: 16px;";
            document.body.appendChild(m);
            setTimeout(function () {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(function () { document.body.removeChild(m) }, d * 1000);
            }, duration);
        }
    }
    // 回调的保证
    // if (!state.popTimeInterval) {
    //     state.popTimeInterval = setInterval(function () {
})();