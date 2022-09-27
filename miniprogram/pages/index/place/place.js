// miniprogram/pages/index/place/place.js
const app=getApp();
// 引入SDK核心类
var QQMapWX = require('../../../components/qqmap-wx-jssdk.js');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'MH2BZ-UFWWD-C7K4M-PQJM2-4ZQIS-NIFHH' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showScan:1,
    setting: { // 使用setting配置，方便统一还原
			rotate: 0,
			skew: 0,
			enableRotate: false,
    },
    location: {
			latitude: 39.96125,
			longitude: 116.358094,
    },
    // markers: [
		// 	{
		// 		customCallout: {
    //       anchorY: 0,
    //       anchorX: 0,
		// 			display: 'BYCLICK'
		// 		},
		// 		id:0,
		// 		latitude: 39.96225,
		// 		longitude: 116.360594,
		// 		iconPath: '/pages/index/place/trashBin.png',
		// 		width: '26px',
		// 		height: '34px',
		// 		rotate: 0,
    //     alpha: 1,
    //     content: '东门',
        
		// 	},
		// 	{
		// 		customCallout: {
		// 			anchorY: 0,
    //       anchorX: 0,
		// 			display: 'BYCLICK'
		// 		},
		// 		id:1,
		// 		latitude: 39.95985,
		// 		longitude: 116.357394,
		// 		iconPath: '/pages/index/place/trashBin.png',
		// 		width: '26px',
		// 		height: '34px',
		// 		rotate: 0,
    //     alpha: 1,
    //     content: '南门',
        
		// 	},
		// 	{
		// 		customCallout: {
		// 			anchorY: 0,
    //       anchorX: 0,
		// 			display: 'BYCLICK'
		// 		},
		// 		id:2,
		// 		latitude: 39.96100,
		// 		longitude: 116.355594,
		// 		iconPath: '/pages/index/place/trashBin.png',
		// 		width: '26px',
		// 		height: '34px',
		// 		rotate: 0,
    //     alpha: 1,
    //     content: '西门',
		// 	},
		// ],
		scale: 16,
		isOverLooking: false,
		is3D: true,
		isShowScale: true,
		isShowCompass: true,
		minScale: 3,
    maxScale: 20,
    screenHeight:app.globalData.WindowHeight,
    ScreenHeight80Percent:app.globalData.WindowHeight*0.8

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.token){
      this.getMarkers()
    }else{
      wx.showToast({
        title: '请先绑定账号',
        icon:'error'
      })
      setTimeout(function() {
        wx.navigateBack({
          delta: 0,
        })
      }, 2000)
    }

  },
  formSubmit(e) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      //from: e.detail.value.start,
      to: e, 
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          'location.latitude':pl[0].latitude,
          'location.longitude':pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#39b54a',
            width: 6
          }]
        })
        wx.showToast({
          icon: 'none',
          title: '路径已显示',
        })
        _this.hideModal()
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      showScan:0
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      showScan:1
    })
  },
  onTapMarker(e){

    console.log(e)
    console.log('e.detail.markerId',e.detail.markerId)
    this.data.markers.forEach((element, index, array) => {
      if(element.id==e.detail.markerId){
        this.setData({
          modalName: 'bottomModal',
          modalContent:element.title,
          // grayRemain:'10%',
          // greenRemain:'30%',
          // blueRemain:'20%',
          full:element.full?'已满':'未满',
          location: {
            latitude: element.latitude,
            longitude: element.longitude,
          },
          scale: 17,
        })
      }
    })
  },

  directToTrashBin:function(){
    
    var destination=this.data.location
    this.formSubmit(destination)
  },
  getMarkers() {
    wx.request({
        url: app.globalData.severAddress + '/api/v1/dustbins',
        method: 'GET',
        header:{
          'Authorization':'Bearer '+app.globalData.token,
          'content-type':'application/json'
        },
        data: {},
        dataType: 'json',
        success: (res) => {
            console.log('get-dustbin-list succeeded')
            console.log(res.data)
            const newMarkerList = []
            res.data._embedded.dustbinList.forEach((element, index, array) => {

                newMarkerList.push({
                  customCallout: {
                    anchorY: 0,
                    anchorX: 0,
                    display: 'BYCLICK'
                  },
                    id: element.id,
                    longitude: element.longitude,
                    latitude: element.latitude,
                    title: element.name,
                    full:element.full,
                    alpha: element.full ? 0.5 : 1,
                    iconPath: '/pages/index/place/trashBin.png',
                    width: '26px',
                    height: '34px',                   
                })
            })

            this.setData({
              markers:newMarkerList
            })

            // this.setState((state) => ({
            //     markers: newMarkerList
            // }))

            // this.getDistances()
        },
        fail: (res) => {
            console.log('request failed')
            console.log(res)
            wx.showToast({
              title: '获取出错',
              icon: 'error',
            })
        }
    })
},
scanQRCode() {
  console.log(app.globalData.severAddress)
  var that = this;
  that.setData({
    scanCodeAnimation: 'scale-down'
  })
  setTimeout(function() {
    that.setData({
      scanCodeAnimation: ''
    })
  }, 1000)
  wx.scanCode({
      success: (scres) => {
          console.log('scan result:')
          console.log(scres)
          //this.setToast(true)
         wx.request({
              url:app.globalData.severAddress + '/api/v1/dustbins/' + scres.result + '/requests',
              method: 'POST',
              header:{
                'Authorization':'Bearer '+app.globalData.token,
                'content-type':'application/json'
              },
              data: {
                  
              },
              success: (res) => {
                  if (res.statusCode === 201) {
                      console.log('ready to check result')

                      let round = -1
                      const ROUND_LIMIT = 4
                      let interval = setInterval(() => {
                          if (++round >= 1) {
                              console.log('checking result, round=' + round)

                              if (round >= ROUND_LIMIT) {
                                  console.log('checking done, result=failed')
                                  wx.showToast({
                                    title: '开盖失败，垃圾桶未及时响应',
                                    icon: 'error',
                                  })
                                  //this.setToast(false)
                                  clearInterval(interval)
                              }

                              wx.request({
                                  url: app.globalData.severAddress + '/api/v1/dustbins/' + scres.result + '/requests/' + res.data.requestId,
                                  method: 'GET',
                                  header:{
                                    'Authorization':'Bearer '+app.globalData.token,
                                    'content-type':'application/json'
                                  },
                                  success: (res_) => {
                                      console.log(res_)
                                      if (res_.statusCode === 200 && res_.data.type === 0) {
                                          console.log('checking done, result=succeed')
                                          wx.showToast({
                                            title: '开盖成功',
                                          })
                                          //this.setToast(false)
                                          clearInterval(interval)
                                      }
                                  }
                              })
                          }
                      }, 2000)


                  } else {
                      console.log('error: return code not 201')
                      //this.setToast(false)
                      if(res.statusCode==401){
                        wx.showToast({
                          title: '未绑定账号',
                          icon: 'error',
                        })
                      }else if(res.statusCode==404){
                        wx.showToast({
                          title: '垃圾桶不存在',
                          icon: 'error',
                        })
                      }else if(res.statusCode==500){
                        wx.showToast({
                          title: '二维码错误',
                          icon: 'error',
                        })
                      }
                    
                  }
              },
              fail: () => {
                  //this.setToast(false)
                  wx.showToast({
                    title: '网络错误',
                    icon: 'error',
                  })

              },
              complete: (res) => {
                  console.log('completed')
                  console.log(res)
              }
          })


      },
      fail: () => {
          wx.showToast({
            title: '终止扫码',
            icon: 'none',
          })
      }
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})