// miniprogram/pages/activity/activityDetail/activityDetail.js
const app=getApp()
var QR = require("../../../utils/qrcode.js");
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
      imgUrl:app.globalData.activityImgUrl,
      aEndTime:options.aEndTime,
      aStartTime:options.aStartTime,
      award:options.award,
      detail:options.detail,
      name:options.name,
      organization:options.organization,
      place:options.place,
      sEndTime:options.sEndTime,
      sStartTime:options.sStartTime,
      on:options.on,
      isAdmin:app.globalData.isAdmin,
      _id:options._id,
      collectionName:options.collectionName
    })

  },

  disabledButton:function(){
    wx.showToast({
      title: '尚未开始',
      icon:'none'
    })
  },
  convertAwardOn:function(){
    const db = wx.cloud.database()
    var that=this 
    console.log(that.data._id)
    db.collection('activity').doc(that.data._id).update({
      data: {
        on: 1,
      },
      success: function(res) {
        console.log(res)
        console.log(res.stats.updated)
        if(res.stats.updated==0){
          wx.showToast({
            title: '活动不存在',
            icon:'error'
          })
        }else{
          that.setData({
            on:1
          })
          wx.showToast({
            title: '兑奖已开启',
          })
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2]; //获取到上一页面
          prevPage.onPullDownRefresh();
        }
      }
    })
  },
  convertAwardEnd:function(){
    const db = wx.cloud.database()
    var that=this 
    console.log(that.data._id)
    db.collection('activity').doc(that.data._id).update({
      data: {
        on: 0,
      },
      success: function(res) {
        console.log(res)
        console.log(res.stats.updated)
        if(res.stats.updated==0){
          wx.showToast({
            title: '活动不存在',
            icon:'error'
          })
        }else{
          that.setData({
            on:0
          })
          wx.showToast({
            title: '兑奖已结束',
          })
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2]; //获取到上一页面
          prevPage.onPullDownRefresh();
        }
      }
    })
  },
  userConvertAward:function(e){
    this.showModal(e)
  },
  bindUserConvertAward:function(){
    const db = wx.cloud.database()
    const _ = db.command
    var that=this
    if(this.data.isChecked){
      db.collection(this.data.collectionName).where({
        stuNum: this.data.stuNum
      })
      .get({
        success: function(res) {
          console.log('第一层获奖名单查询',res)
          if(res.data.length==0){
            wx.showToast({
              title: '用户未获奖',
              icon:'error'
            })
            that.hideModal()
          }else if(res.data[0].qualify==0){
            const prize=res.data[0].prize
            db.collection('activity').doc(that.data._id)
            .get({
              success: function(res) {
                console.log('第二层活动查询',res)
                console.log(res.data.prize[prize-1])
                if(res.data.prize[prize-1]==0){
                  wx.showToast({
                    title: '奖品已兑完',
                    icon:'error'
                  })
                  that.hideModal()
                }else{
                  db.collection('activity').doc(that.data._id).update({
                    data: {
                      // 表示指示数据库将字段减1
                      ['prize.'+[prize-1]]: res.data.prize[prize-1]-1
                    },
                    success: function(res) {
                      console.log('第三层奖品数量减一',res)
                      db.collection(that.data.collectionName).where({stuNum:that.data.stuNum}).update({
                        // data 传入需要局部更新的数据
                        data: {
                          // 表示将 done 字段置为 true
                          qualify: 1
                        },
                        success: function(res) {
                          console.log('第四层兑奖认证',res)
                          wx.showToast({
                            title: '恭喜获得'+prize+'等奖',
                          })
                          that.hideModal()
                          that.setData({
                            prize:prize,
                            showQRCode:1
                          })
                          QR.qrApi.draw(that.data.stuNum, 'mycanvas', 300, 300)
                        }
                      })
                    }
                  })
                }
              }
            })
          }else{
            const prize=res.data[0].prize
            wx.showToast({
              title: '用户已兑奖',
              icon:'error'
            })
            that.hideModal()
            that.setData({
              prize:res.data[0].prize,
              modalName: 'showQRCode'
            })
          }
        }
      })

    }else{
      wx.showToast({
        title: '请输入学号',
        icon:'error'
      })
    }

  },
  bindStuNumInput: function(e) {
    console.log(e.detail.value)
    this.setData({
      stuNum: e.detail.value
    })
    var that = this;
    if (that.data.stuNum.length !== 0) {
      this.setData({
        isChecked: true
      })
    } else if (that.data.stuNum.length === 0) {
      this.setData({
        isChecked: false
      })
    }
  },
  showQRCode:function(){
    var that=this
    that.setData({
      showQRCode:1
    })
    QR.qrApi.draw(that.data.stuNum, 'mycanvas', 300, 300)
    that.hideModal()
  },
  convertAward:function(){
    var that = this
    wx.navigateTo({
      url: '../adminScanCode/adminScanCode?collectionName=' + that.data.collectionName+'&name='+that.data.name,
      success: function(res){
        // success
      }
    })

  },
  showModal(e) {
    console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
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