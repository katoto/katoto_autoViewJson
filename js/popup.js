
$(document).ready(function () {
    $('#startEdit').click(function () {
        console.log($('#inpJson').val())
        // 检测json 格式
        $('#inpJson').val('123')
        // 发给bg
        sendBgInpJson()
    })
    function sendBgInpJson() {
        var bg = chrome.extension.getBackgroundPage();//获取background页面,popup与background通信
        console.log(bg)
        if (bg) {
            console.log('bg')
            bg.testVal = getInpJson()
        }

    }
})
function getInpJson() {
    return {
        a: 123
    }
}