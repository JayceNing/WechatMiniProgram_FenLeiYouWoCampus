// miniprogram/pages/me/record/record.js
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
    this.onPullDownRefresh()
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
    wx.request({
      url: app.globalData.severAddress+'/api/v1/users/me/wastes',
      method: 'GET',
      header:{
        'Authorization':'Bearer '+app.globalData.token,
      },
      data: {
      },
      success: (res) => {
        console.log(res)
        if(res.statusCode==401){
          wx.showToast({
            title: '请先绑定账号',
            icon:'error'
          })
        }else{
          const newWasteListItem=[]
        res.data._embedded.wasteList.forEach((element, index, array) => {
          var categoryNameChs = ''
          var wasteImage = ''
          if (element.category === 'HAZARDOUS_WASTE') {
              categoryNameChs = '有害垃圾'
              wasteImage = 'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE00ekuq/45NBuzDIW489QBoVep5mcd8PZLdadSydBUg1hmjHjw7aDYJDNymUTQDnSQS2H7TCCNZ*HmgrrRWrbdUmQ0mGPnQ8MJy3jG*bD3Wyn2HApLM!/b&bo=CAIIAggCCAIDGTw!&rf=viewer_4&t=5'
          } else if (element.category === 'RESIDUAL_WASTE') {
              categoryNameChs = '其他垃圾'
              wasteImage = 'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE00ekuq/45NBuzDIW489QBoVep5mcT.z0In0q9zP3XQPhMu7gqZdCoZFgCEkRrHP6juCkAH1UQRReQ23*wZrWMYnwG4OfuaWo0OWvteURi0BzLjxZFc!/b&bo=sAGwAbABsAEDGTw!&rf=viewer_4&t=5'
          } else if (element.category === 'RECYCLABLE_WASTE') {
              categoryNameChs = '可回收垃圾'
              wasteImage = 'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE00ekuq/45NBuzDIW489QBoVep5mcd8PZLdadSydBUg1hmjHjw7V2jWhRhU9cdW87*oVU7mjV091*waHkUw7MnDx8mL855BoD74rYEnuik2hcPqJmTM!/b&bo=CAIIAggCCAIDGTw!&rf=viewer_4&t=5'
          } else if (element.category === 'FOOD_WASTE') {
              categoryNameChs = '厨余垃圾'
              wasteImage = 'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE00ekuq/45NBuzDIW489QBoVep5mcd8PZLdadSydBUg1hmjHjw4eiavsuF97NsjOwyz.w6lV2wlpRQ0rWYgsEzkE7FaQRQj2bmdQAOxgmdJQxs1J00g!/b&bo=CAIIAggCCAIDGTw!&rf=viewer_4&t=5'
          }

          var dateFormatted = ''
          dateFormatted = element.time.substring(0, 19).replace('T', ' ')
          newWasteListItem.push({
              id: element.id,
              title:
                  dateFormatted.substring(5, 7) + '月' + dateFormatted.substring(8, 10) + '日 ' + categoryNameChs + ' ' + element.weight + 'kg',
              brief: dateFormatted + ', ' + element.dustbin.name,
              imageUrl: wasteImage,
              mode: ['circle']
          })
          
      })
      this.setData({
        record:newWasteListItem
      })

        }
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