$(document).ready(function() {
  let bgZone = null;
  getZone();
  function getZone() {
    bgZone = chrome.extension.getBackgroundPage(); //获取background页面,popup与background通信
    console.log(bgZone);
    if (bgZone) {
      console.log("bgZone success");
    } else {
      setTimeout(() => {
        getZone();
      }, 1000);
    }
  }
  $("#startEdit").click(() => {
    let inpVal = $("#inpJson").val();
    let inpJson = null;
    // 检测json 格式
    try {
      inpJson = JSON.parse(inpVal);
    } catch (e) {
      Toast("静态配置不符合JSON格式");
      return false;
    }
    // 发给background.js
    try {
      sendBgInpJson(inpJson);
    } catch (e) {
      Toast("插件视乎有点问题");
      return false;
    }
  });
  $("#outBtn").click(() => {
    // 得到最新变量
    console.log(bgZone.inpStatic);
    $("#outJson").val(JSON.stringify({ a: 123 }));
  });
  function sendBgInpJson(inpJson) {
    if (bgZone) {
      try {
        bgZone.inpStatic = inpJson;
        bgZone.changeKey2Md5(inpJson);
        console.log("end end end");
      } catch (e) {
        Toast("JSON 导入成功");
      }
    } else {
      setTimeout(() => {
        getZone();
      }, 2000);
    }
  }
});

/*
 *@method Toast
 * 简易toast
 */
function Toast(msg, duration) {
  duration = isNaN(duration) ? 3000 : duration;
  var m = document.createElement("div");
  m.innerHTML = msg;
  m.style.cssText =
    "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 6%;left: 50%;transform: translate(-50%, 0);z-index: 9999;background: rgba(0, 0, 0,.7);font-size: 16px;";
  document.body.appendChild(m);
  setTimeout(function() {
    var d = 0.5;
    m.style.webkitTransition =
      "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
    m.style.opacity = "0";
    setTimeout(function() {
      document.body.removeChild(m);
    }, d * 1000);
  }, duration);
}
