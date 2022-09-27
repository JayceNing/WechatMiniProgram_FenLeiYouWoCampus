// miniprogram/pages/faceConfirm/faceConfirm.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adminInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  faceConfirmAdmin:function(){
    this.loadModal()
    var that=this
    this.ctx = wx.createCameraContext()
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res)
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log(res.data)
            wx.cloud.callFunction({
              name: 'faceConfirmAdmin',
              data: { 
                "Image":res.data
              },
              success: res => {
                this.hideLoadModal()
                console.log('[云函数] [picAnalyse] : ', res.result)
                if(res.result==null){
                  wx.showToast({
                    icon: 'error',
                    title: '未识别人脸',
                  })
                }else if(res.result.Results[0].Candidates[0].Score<90){
                  that.setData({
                    accessDenied:1
                  })
                  wx.showToast({
                    icon: 'error',
                    title: '无权限',
                  })
                  setTimeout( 
                    that.navigateBack
                   ,2000);
                }else{
                  that.setData({
                    adminInfo:res.result.Results[0].Candidates[0]
                  })
                  app.globalData.isAdmin=1 //设置全局变量确认管理员权限
                  app.globalData.adminName=res.result.Results[0].Candidates[0].PersonName
                  wx.setStorage({
                    key:"isAdmin",
                    data:1
                  })
                  wx.setStorage({
                    key:"adminName",
                    data:res.result.Results[0].Candidates[0].PersonName
                  })
                  wx.showToast({
                    icon: 'none',
                    title: '验证成功',
                  })
                  setTimeout( 
                    that.navigateBack
                   ,3000);
                }
              },
              fail: err => {
                console.error('[云函数] [picAnalyse] 调用失败', err)
              }
            })
          }
        })
      }
    })
  },

  navigateBack:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  loadModal:function() {
    this.setData({
      loadModal: true
    })
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