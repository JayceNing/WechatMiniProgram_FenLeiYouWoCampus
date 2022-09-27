// miniprogram/pages/activity/adminScanCode/adminScanCode.js
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
    console.log(options)
    this.setData({
      name:options.name,
      collectionName:options.collectionName
    })
    this.onPullDownRefresh()
    
  },
  scanCode:function(){
    var that = this
    const db = wx.cloud.database()
    wx.scanCode({
      success: function(res){
        // success
        console.log(res)
        that.setData({
          recognizeMsg: res.result
        })
        db.collection(that.data.collectionName).where({
          stuNum: res.result,
        })
        .get({
          success: function(res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log('数据库查询成功',res)
            if(res.data[0].convertAward==1){
              wx.showToast({
                title: '用户已领奖',
                icon:'error'
              })
            }else{
              db.collection(that.data.collectionName).doc(res.data[0]._id).update({
                data: {
                  convertAward: 1
                },
                success: function(res) {
                  console.log(res)
                  wx.showToast({
                    title: '兑奖成功'
                  })
                }
              })
            }

          }
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
    wx.showNavigationBarLoading();
    var that=this
    const db = wx.cloud.database()
    db.collection(that.data.collectionName).where({
      qualify:1,
      convertAward:0
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res)
        that.setData({
          qualifyNoConvertUser:res.data
        })
      }
    })
    db.collection(that.data.collectionName).where({
      qualify:1,
      convertAward:1
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res)
        that.setData({
          convertAwardUser:res.data
        })
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