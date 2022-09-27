// miniprogram/pages/activity/activity.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,
    activity: [{
      id: 0,
      type: 'image',
      url: 'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE4VGVwk/45NBuzDIW489QBoVep5mcWZNvbByeauNY*34l.pm7A1WKT3axiRTs3gl95GzJtq1U.lEo2ZMUlv8i87oVY*YrPFXElrYU5fPujl1Ze*43Js!/b&bo=2wOaAdsDmgEBGT4!&rf=viewer_4&t=5'
    }, {
      id: 1,
        type: 'image',
        url: 'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE4VGVwk/45NBuzDIW489QBoVep5mcfq3Ccr78BEp.hylOXrdVarMTC9NdFGpMqussiWzk1yc4aXceXkIWLVZcRv0wFMSNCCYY3maGhNK3RGtlAL6zg4!/b&bo=1gOkAdYDpAEBGT4!&rf=viewer_4&t=5',
    }, {
      id: 2,
      type: 'image',
      url: 'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE4VGVwk/45NBuzDIW489QBoVep5mcfq3Ccr78BEp.hylOXrdVarJNtlDDy.MIK7meqvK4hMyYqRu0IbR8pe14oKBs*PZGZcSRLQRdwjOC2Af9Tt5lXk!/b&bo=zAOhAcwDoQEBGT4!&rf=viewer_4&t=5'
    }, ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'isAdmin',
      success (res) {
        console.log(res.data)
        if(res.data==1){
          app.globalData.isAdmin=1
          that.setData({
            isAdmin:1
          })
          wx.getStorage({
            key: 'adminName',
            success (res) {
              console.log(res.data)
              that.setData({
                adminName:res.data
              })
            }
          })
        }
      }
    })

    this.setData({
      StatusBar:app.globalData.StatusBar
    })
    this.onPullDownRefresh()

  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  passImgUrl:function(e){
    console.log(e)
    app.globalData.activityImgUrl=e.currentTarget.dataset.id
  },
  toFaceConfirmAdmin:function(){
    wx.navigateTo({
      url: '../faceConfirm/faceConfirm',
    })
  },
  adminLogout:function(){
    var that=this
    app.globalData.isAdmin=0,
    wx.removeStorage({
      key: 'isAdmin',
      success (res) {
        console.log(res)
        wx.removeStorage({
          key: 'adminName',
          success (res) {
            console.log(res)
            wx.showToast({
              title: '注销成功',
            })
            that.setData({
              isAdmin:'',
              adminName:''
            })
            app.globalData.isAdmin=0
          }
        })
      }
    })
   
  },
  loadModal:function() {
    this.setData({
      loadModal: true
    })
    var that=this
    setTimeout(function() {
      if(that.data.loadModal==true){
        that.hideLoadModal()
      wx.showToast({
        title: '网络出错',
        icon:'error'
      })
      }
    }, 10000)
  },
  hideLoadModal:function(){
    this.setData({
      loadModal: false
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
    if(app.globalData.isAdmin){
      this.setData({
        isAdmin:1,
        adminName:app.globalData.adminName
      })
    }
    this.getTabBar().setData({
      selected: 1
    })
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
    this.loadModal()
    wx.showNavigationBarLoading();
    const db = wx.cloud.database()
      //查询活动
     db.collection('activity').orderBy('time', 'desc').get({
       success: res => {
        // for(var i=0;i<res.data.length;i++){
        //   var date = new Date(res.data[i].time)
        //   var mm = date.getMinutes(); 
        //   if (mm < 10) mm = '0'+mm;
        //   res.data[i].time=date.getFullYear() +'-' +(date.getMonth() + 1) +'-' + date.getDate()+' '+date.getHours()+':'+mm
        // }
         this.setData({
          //  queryResult: JSON.stringify(res.data, null, 2)
          queryResult:res.data,     
         })

        console.log('[数据库] [查询记录] 成功: ', res)
        this.hideLoadModal()
        
      },
       fail: err => {
         wx.showToast({
           icon: 'none',
           title: '查询记录失败'
         })
         console.error('[数据库] [查询记录] 失败：', err)
       }
     })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
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