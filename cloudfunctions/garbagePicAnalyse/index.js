// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = 'https://recover.market.alicloudapi.com/recover';
  let img=encodeURIComponent(event.imgbase64)
  return await rp({
    url: url,
    method: "POST",
    json: true,
    form: {
      img:img
    },
    headers: {
      //"content-type": "application/json",
      'Authorization':'APPCODE 850d4015461548eeb7b24cafa9be5acf',
      "content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then(function (res) {
      console.log(res)
      return res
    })
    .catch(function (err) {
      return err
    });
  
}