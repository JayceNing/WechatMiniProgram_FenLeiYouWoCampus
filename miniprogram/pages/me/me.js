// miniprogram/pages/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    canIUseGetUserProfile: false,
    hasUserInfo: false,
    registered:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
  
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo=res.userInfo
        this.setData({
          userInfo: res.userInfo,
          avatarUrl: res.userInfo.avatarUrl,
          hasUserInfo: true
        })
        this.onGetOpenid()
      }
    })
    //var that=this
    wx.getStorage({
      key: 'token',
      success (res) {
        console.log(res.data)
        app.globalData.token=res.data
      }
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
        app.globalData.openid = res.result.openid
        this.showMyRecord()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  showMyRecord: function(){
    console.log(app.globalData.openid)
    var that=this
    if(app.globalData.token){
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
          wx.request({
            url: app.globalData.severAddress+'/api/v1/users/me/credit',
            method: 'GET',
            header:{
              'Authorization':'Bearer '+app.globalData.token,
              'content-type':'application/json'
            },
            data: {
            },
            success: (res) => {
              console.log('获取积分信息:',res)
              that.setData({
                credit:res.data
              })
              wx.request({
                url: app.globalData.severAddress+'/api/v1/users/me/ranking',
                method: 'GET',
                header:{
                  'Authorization':'Bearer '+app.globalData.token,
                  'content-type':'application/json'
                },
                data: {
                },
                success: (res) => {
                  console.log('获取排名信息:',res)
                  that.setData({
                    schoolStudentCount:res.data.schoolStudentCount,
                    collegeStudentCount:res.data.collegeStudentCount,
                    schoolRanking:res.data.schoolRanking,
                    collegeRanking:res.data.collegeRanking,               
                  })
                }
              })
         
            }
          })
          if(res.statusCode==200){
            that.setData({
              queryResult:res.data,
              registered:1,
            })
            var result=res.data
      app.globalData.realName=result.realName,
      //app.globalData.sex=result.sex,
      app.globalData.stunum=result.username,
      app.globalData.institute=result.school.name,
      app.globalData.yearOfEnrollment=result.timeOfEnrollment
          }
        }
      })
    }
    const db = wx.cloud.database()
    //  db.collection('user').where({_openid:app.globalData.openid}).get({
    //    success: res => {
    //     console.log(res)
    //     if(res.data.length!=0){
    //       this.setData({
    //         queryResult:res.data,
    //         registered:1
    //       })
    //     }
    //   },
    //    fail: err => {
    //      wx.showToast({
    //        icon: 'none',
    //        title: '查询记录失败'
    //      })
    //      console.error('[数据库] [查询记录] 失败：', err)
    //    }
    //  })
  },
  toBindAccount:function(){
    wx.navigateTo({
      url: '../me/bindAccount/bindAccount',
    })
  },
  
  unbindAccount:function(){
    var that=this
    wx.removeStorage({
      key: 'token',
      success (res) {
        console.log(res)
        app.globalData.token=''
        that.setData({
          registered:0
        })
        wx.showToast({
          title: '解绑成功',
        })
      }
    })

  },
  myInforTap:function(){
    var that=this
    if(this.data.registered==0){
      wx.showModal({
        title: '用户尚未绑定',
        content: '点击前往分类邮我账号绑定页面',
        success (res) {
          if (res.confirm) {
            that.toBindAccount()
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      // var result=this.data.queryResult
      // app.globalData.realName=result.realName,
      // //app.globalData.sex=result.sex,
      // app.globalData.stunum=result.username,
      // app.globalData.institute=result.school.name,
      // app.globalData.yearOfEnrollment=result.timeOfEnrollment,
      wx.navigateTo({
        url: './myInfo/myInfo',
      })
    }
  },

  directToShop:function(){
    wx.navigateTo({
      url: '../shop/shop',
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取组件
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 3
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