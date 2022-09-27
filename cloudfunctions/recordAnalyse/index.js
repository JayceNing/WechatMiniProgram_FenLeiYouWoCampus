// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");

const AsrClient = tencentcloud.asr.v20190614.Client;

const clientConfig = {
  credential: {
    secretId: "AKID36vDIFLVdXjgNr4AxCDYfJ4cXhcKN8od",//请填写自己的secretID和Key
    secretKey: "kU00ucItzqSqTaTjjNmmWynNgjvmWzCC",
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "asr.tencentcloudapi.com",
    },
  },
};

exports.main = async (event, context) => {
const client = new AsrClient(clientConfig);
const params = {
    "ProjectId": 0,
    "SubServiceType": 2,
    "EngSerViceType": "16k_zh",
    "SourceType": 1,
    "VoiceFormat": "mp3",
    "UsrAudioKey": "123",
    "Data": event.recordBase64,
    "FilterPunc": 1,
    "HotwordId": "6e2dd95c87c811eb80b3446a2eb5fd98"
};
return new Promise((resolve, reject) => {
client.SentenceRecognition(params).then(
  (data) => {
    console.log(data);
    resolve(data)
  },
  (err) => {
    console.error("error", err);
  }
);
})
}