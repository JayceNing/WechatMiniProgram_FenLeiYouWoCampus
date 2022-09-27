// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const tencentcloud = require("tencentcloud-sdk-nodejs");
const IaiClient = tencentcloud.iai.v20200303.Client;
const clientConfig = {
  credential: {
    secretId: "AKID36vDIFLVdXjgNr4AxCDYfJ4cXhcKN8od",
    secretKey: "kU00ucItzqSqTaTjjNmmWynNgjvmWzCC",
  },
  region: "ap-beijing",
  profile: {
    httpProfile: {
      endpoint: "iai.tencentcloudapi.com",
    },
  },
};
const client = new IaiClient(clientConfig);
// 云函数入口函数
exports.main = async (event, context) => {
  const params = {
    "GroupIds": [
        "fenleiyouwoAdmin"
    ],
    "Image": event.Image,
    "NeedPersonInfo": 1
};
  console.log('faceConfirmAdmin函数调用成功',params)
  return new Promise((resolve, reject) => {
    client.SearchFaces(params).then(
      (data) => {
        console.log(data);
        resolve(data)
      },
      (err) => {
        console.error("error", err);
      }
    )
  })
}