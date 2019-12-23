let sendViewFlag = null;
let inpStatic = null;
let keyMd5Obj = "123123";

// 引入一个hash 处理函数
console.log("11111111111111111");
// 发送消息
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  sendViewFlag = chrome.tabs.connect(tabId);
  sendViewFlag.postMessage({ flag: "123132" });
});
//接收消息
chrome.extension.onConnect.addListener(function(bac) {
  bac.onMessage.addListener(function(msgObj) {
    console.log(keyMd5Obj);
    console.log(inpStatic);
    console.log("****&&***");
    // if (msgObj.type === "msg") {
    // }
    modifyJson(msgObj.key, msgObj.value);
    // 处理消息 并回复
    sendViewFlag.postMessage({ ...msgObj });
  });
});

function setkeyMd5Obj(val) {
  console.log(val);
  keyMd5Obj = val;
}
function getkeyMd5Obj() {
  return keyMd5Obj;
}
function setInpStatic(val) {
  inpStatic = val;
}
function getInpStatic() {
  return inpStatic;
}
function modifyJson(inpKey, val) {
  console.log("***");
  console.log(inpKey);
  console.log(val);
  console.log(keyMd5Obj);
  console.log(inpStatic);
  console.log("***");
  // 字符串转数值
  if (keyMd5Obj && inpKey) {
    if (!keyMd5Obj[inpKey]) {
      console.log("error at modifyJson", keyMd5Obj[inpKey]);
      return false;
    }
    let findKeyArr = keyMd5Obj[inpKey]
      .replace(/']/g, ",")
      .replace(/\['/g, "")
      .replace(/(.*),/, "$1")
      .split(",");

    let currVal = inpStatic;
    findKeyArr.forEach((item, index) => {
      currVal = currVal[findKeyArr[index]];
      if (findKeyArr.length >= 2 && index === findKeyArr.length - 2) {
        currVal[findKeyArr[index + 1]] = val;
      } else if (findKeyArr.length === 1) {
        inpStatic[findKeyArr[0]] = val;
      }
    });
    console.log(inpStatic);
    console.log("findKey======", currVal);
  }
}
