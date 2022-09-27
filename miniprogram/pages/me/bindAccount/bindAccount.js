// miniprogram/pages/me/bindAccount/bindAccount.js
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
  bindAccount:function(){
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
        if(res.statusCode==401){
          wx.showToast({
            title: '该用户不存在',
            icon:'error'
          })
        }else if(res.statusCode==200){
          if(res.data.token!=app.globalData.token){
            app.globalData.token=res.data.token
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //获取到上一页面
            prevPage.showMyRecord();
            wx.setStorage({
              key:"token",
              data:res.data.token
            })
            wx.showToast({
              title: '绑定成功',
            })
            wx.navigateBack({
              delta: 0,
            })
          }

        }
      }
    })
  },
  toRegister:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  testAccount:function(){
    this.setData({
      stunum: 2018210769,
      mima: '123456',
      isChecked: true
    })
    wx.showToast({
      title: '账号密码已填入,请点击登录',
      icon: 'none',
      duration: 2000
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