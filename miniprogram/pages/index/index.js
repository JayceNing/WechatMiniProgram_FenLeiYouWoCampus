// miniprogram/pages/index/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onPullDownRefresh()
    this.setData({
      StatusBar:app.globalData.StatusBar
    })

  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  toPlace:function(){
    var that = this;
    that.setData({
      placeAnimation: 'slide-left'
    })
    setTimeout(function() {
      that.setData({
        placeAnimation: ''
      })
    }, 1000)
    wx.navigateTo({
      url: '../index/place/place',
    })

  },
  toKnowledge:function(){
    var that = this;
    that.setData({
      knowledgeAnimation: 'slide-left'
    })
    setTimeout(function() {
      that.setData({
        knowledgeAnimation: ''
      })
    }, 1000)
    wx.navigateTo({
      url: '../index/knowledge/knowledge',
    })
  },
  toArtical:function(e){
    console.log(e)
    app.globalData.articalUrl=e.currentTarget.dataset.id
    wx.navigateTo({
      url: './artical/artical',
    })
  },
  scanCode:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        console.log(res)
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
    this.getTabBar().setData({
      selected: 0
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
    wx.showNavigationBarLoading();
    this.loadModal()
    const db = wx.cloud.database()
      //查询文章
     db.collection('artical').orderBy('time', 'desc').get({
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
         this.hideLoadModal()

        console.log('[数据库] [查询记录] 成功: ', res)
        
      },
       fail: err => {
         wx.showToast({
           icon: 'none',
           title: '查询记录失败'
         })
         console.error('[数据库] [查询记录] 失败：', err)
       }
     })
     db.collection('activityArtical').orderBy('time', 'desc').get({
      success: res => {
        this.setData({
         queryResult1:res.data,     
        })
        this.hideLoadModal()
       console.log('[数据库] [查询记录] 成功: ', res)      
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