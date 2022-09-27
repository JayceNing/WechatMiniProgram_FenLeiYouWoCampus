// miniprogram/pages/me/login/login.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  stunumInput: function(e) {
    this.setData({
      stunum: e.detail.value
    });
  },
  mimaInput: function(e) {
    this.setData({
      mima: e.detail.value
    });
  },
  tijiao:function(){
    wx.request({
      // url: 'http://10.21.170.150:8080/api/v1/auth/signin',
      url: app.globalData.severAddress+'/api/v1/auth/login',
      method: 'POST',
      data: {
        username:this.data.stunum,
        password:this.data.mima
      },
      success: (res) => {
        console.log(res)
        if(res.data.token!=app.globalData.token){
          app.globalData.token=res.data.token
          wx.setStorage({
            key:"token",
            data:res.data.token
          })
        }
      }
    })
  },
  zhuce:function(){
    console.log('点击')
    wx.request({
      url: app.globalData.severAddress+'/api/v1/users',
      method: 'POST',
      data: {
        username:this.data.stunum,
        password:this.data.mima,
        realName:'宁欣宇',
        openId:'',
        schoolId:2,
        timeOfEnrollment:2018
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  xinxi:function(){
    wx.request({
      url: app.globalData.severAddress+'/api/v1/users/me',
      method: 'GET',
      header:{
        'Authorization':'Bearer '+app.globalData.token,
        'content-type':'application/json'
      },
      data: {
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  lishijilu:function(){
    wx.request({
      url: app.globalData.severAddress+'/api/v1/users/me/wastes',
      method: 'GET',
      header:{
        'Authorization':'Bearer '+app.globalData.token,
        'content-type':'application/json'
      },
      data: {
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  huoquxueyuan:function(){
    wx.request({
      url: app.globalData.severAddress+'/api/v1/schools',
      method: 'GET',
      header:{
        'Authorization':'Bearer '+app.globalData.token,
        'content-type':'application/json'
      },
      data: {
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
 garbageKey:function(){
    wx.request({
      url: 'https://recover2.market.alicloudapi.com/recover_word',
      method: 'GET',
      header:{
        'Authorization':'APPCODE 850d4015461548eeb7b24cafa9be5acf',
        'content-type':'application/json'
      },
      data: {
        'name':'西瓜',
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  garbageKeyCallfunc:function(){
    wx.cloud.callFunction({
      name: 'queryGarbageKeyWord',
      data: { 
        
      },
      success: res => {
        
        console.log('[云函数] [picAnalyse] : ', res.result)
      },
      fail: err => {
        console.error('[云函数] [picAnalyse] 调用失败', err)
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