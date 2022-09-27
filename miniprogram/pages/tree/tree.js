// miniprogram/pages/tree/tree.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tree:0,
    loading: true,
    progress:1,
    progressAnimation: '',
    waterRes:10,
    fertilizerRes:10,
    medicineRes:10,
    water:0,
    fertilizer:0,
    medicine:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.launchStuNum)
    if(options.launchStuNum&&options.launchStuNum!=app.globalData.stunum){
      // wx.showToast({
      //   title:options.launchStuNum,
      // })
      wx.showModal({
        title: '欢迎来到分类邮我',
        content: '您的好友'+options.launchStuNum+'邀请您来一起种树啦~',
        showCancel:'false',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } 
        }
      })
      wx.request({
        url: app.globalData.severAddress+'/api/v1/users/'+options.launchStuNum+'/credit/offset',
        method: 'PUT',
        header:{
          'Authorization':'Bearer '+app.globalData.token,
          'content-type':'application/x-www-form-urlencoded; charset=utf-8',
        },
        data: {
          offset:1
        },
        success: (res) => {
          if(res.data.statusCode==200){
            console.log('积分已加一:',res)
          }
        }
      })
    }else if(options.launchStuNum&&options.launchStuNum==app.globalData.stunum){
      wx.showModal({
        title: '注意',
        content: '不能自己邀请自己哦~',
        showCancel:'false',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } 
        }
      })
    }
  
    this.showModal()
    this.loadModal()
    this.setData({
      ScreenHeight:app.globalData.WindowHeight,
      StatusBar:app.globalData.StatusBar,
      ScreenHeight10Percent:app.globalData.WindowHeight*0.1,
      ScreenHeight16Percent:app.globalData.WindowHeight*0.16,
      ScreenHeight20Percent:app.globalData.WindowHeight*0.2,
      ScreenHeight30Percent:app.globalData.WindowHeight*0.3,
      ScreenHeight60Percent:app.globalData.WindowHeight*0.5,
      ScreenHeight70Percent:app.globalData.WindowHeight*0.6,
      ScreenHeight80Percent:app.globalData.WindowHeight*0.7,
    })
 
    var that=this
    setTimeout(function() {
      that.hideLoadModal()
    }, 1000)

  },
  toggle(e) {
    console.log(e);
    var anmiaton = e.currentTarget.dataset.class;
    var that = this;
    that.setData({
      animation: anmiaton
    })
    setTimeout(function() {
      that.setData({
        animation: ''
      })
    }, 1000)
  },
  judgeLevelUp:function(){
    console.log('判定升级条件触发')
    if(this.data.water==100&this.data.fertilizer==100&this.data.medicine==100){
      console.log('升级条件已满足')
      if(this.data.tree==0){
        this.setData({
          tree:2,
          water:0,
          fertilizer:0,
          medicine:0
        })
        wx.showToast({
          title: '小树长大了哦~',
        })
      }else if(this.data.tree==2){
        this.setData({
          tree:4,
          water:0,
          fertilizer:0,
          medicine:0
        })
        wx.showToast({
          title: '小树长大了哦~',
        })
      }else if(this.data.tree==4){
        this.setData({
          tree:6,
          water:0,
          fertilizer:0,
          medicine:0
        })
        wx.showToast({
          title: '小树长大了哦~',
        })
      }else if(this.data.tree==6){
        wx.showToast({
          title: '您已满级',
        })
      }
    }

  },
  shop:function(){
    this.setData({
      modalName:'Shop'
    })
  },
  creditDecreseOne:function(){
    wx.request({
      url: app.globalData.severAddress+'/api/v1/users/'+app.globalData.stunum+'/credit/offset',
      method: 'PUT',
      header:{
        'Authorization':'Bearer '+app.globalData.token,
        'content-type':'application/x-www-form-urlencoded; charset=utf-8',
      },
      data: {
        offset:-1
      },
      success: (res) => {
        if(res.data.statusCode==200){
          console.log('积分已减一:',res)
        }
      }
    })
  },
  // set99:function(){
  //   var that=this
  //   wx.request({
  //     url: app.globalData.severAddress+'/api/v1/users/me/tree',
  //     method: 'PUT',
  //     header:{
  //       'Authorization':'Bearer '+app.globalData.token,
  //       'content-type':'application/json',
  //     },
  //     data: {
  //       remainingWater:99,
  //           water:50,
  //           remainingFertilizer:99,
  //           fertilizer:50,
  //           remainingMedicine:99,
  //           medicine:50,
  //           level:0,
  //     },
  //     success: (res) => {
  //         console.log('积分已减一:',res) 
  //         that.setData({
  //           credit:that.data.credit-1,
  //           waterRes:that.data.waterRes+1
  //         })
  //     }
  //   })
  // },
  changeWater:function(){
    var that=this;
    if(app.globalData.stunum){
      if(this.data.credit>=1){
        
        wx.request({
          url: app.globalData.severAddress+'/api/v1/users/me/tree',
          method: 'PUT',
          header:{
            'Authorization':'Bearer '+app.globalData.token,
            'content-type':'application/json',
          },
          data: {
            remainingWater:that.data.waterRes+1,
            water:that.data.water,
            remainingFertilizer:that.data.fertilizerRes,
            fertilizer:that.data.fertilizer,
            remainingMedicine:that.data.medicineRes,
            medicine:that.data.medicine,
            level:that.data.tree/2,
          },
          success: (res) => {
            that.creditDecreseOne()
              console.log('积分已减一:',res) 
              that.setData({
                credit:that.data.credit-1,
                waterRes:that.data.waterRes+1
              })
          }
        })
      }else{
        wx.showModal({
          title: '没有积分啦',
          content: '转发本页面给好友，好友点击后获取积分哦~',
          showCancel:'false',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
  },
  changeFertilizer:function(){
    var that=this;
    if(app.globalData.stunum){
      if(this.data.credit>=1){
        
        wx.request({
          url: app.globalData.severAddress+'/api/v1/users/me/tree',
          method: 'PUT',
          header:{
            'Authorization':'Bearer '+app.globalData.token,
            'content-type':'application/json',
          },
          data: {
            remainingWater:that.data.waterRes,
            water:that.data.water,
            remainingFertilizer:that.data.fertilizerRes+1,
            fertilizer:that.data.fertilizer,
            remainingMedicine:that.data.medicineRes,
            medicine:that.data.medicine,
            level:that.data.tree/2,
          },
          success: (res) => {
            that.creditDecreseOne()
              console.log('积分已减一:',res) 
              that.setData({
                credit:that.data.credit-1,
                fertilizerRes:that.data.fertilizerRes+1
              })
          }
        })
      }else{
        wx.showModal({
          title: '没有积分啦',
          content: '转发本页面给好友，好友点击后获取积分哦~',
          showCancel:'false',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
  },
  changeMedicine:function(){
    var that=this;
    if(app.globalData.stunum){
      if(this.data.credit>=1){
        
        wx.request({
          url: app.globalData.severAddress+'/api/v1/users/me/tree',
          method: 'PUT',
          header:{
            'Authorization':'Bearer '+app.globalData.token,
            'content-type':'application/json',
          },
          data: {
            remainingWater:that.data.waterRes,
            water:that.data.water,
            remainingFertilizer:that.data.fertilizerRes,
            fertilizer:that.data.fertilizer,
            remainingMedicine:that.data.medicineRes+1,
            medicine:that.data.medicine,
            level:that.data.tree/2,
          },
          success: (res) => {
            that.creditDecreseOne()
              console.log('积分已减一:',res) 
              that.setData({
                credit:that.data.credit-1,
                medicineRes:that.data.medicineRes+1
              })
          }
        })
      }else{
        wx.showModal({
          title: '没有积分啦',
          content: '转发本页面给好友，好友点击后获取积分哦~',
          showCancel:'false',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
  },


  button1animation:function(){
    var that = this;
    if(this.data.waterRes>0){
      if(this.data.tree==0){
        if(this.data.water<100){
          this.setData({
            water:this.data.water+50,
            waterRes:that.data.waterRes-1
          })
        }
        that.setData({
          tree:1,
        })
        setTimeout(function() {
          that.setData({
            tree:0
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==2){
        if(this.data.water<100){
          this.setData({
            water:this.data.water+25,
            waterRes:that.data.waterRes-1
          })
        }
        that.setData({
          tree:3,
        })
        setTimeout(function() {
          that.setData({
            tree:2
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==4){
        if(this.data.water<100){
          this.setData({
            water:this.data.water+10,
            waterRes:that.data.waterRes-1
          })
        }
        that.setData({
          tree:5,
        })
        setTimeout(function() {
          that.setData({
            tree:4
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==6){
        if(this.data.water<100){
          this.setData({
            water:this.data.water+5,
            waterRes:that.data.waterRes-1
          })
        }
        that.setData({
          tree:7,
        })
        setTimeout(function() {
          that.setData({
            tree:6
          })
          that.judgeLevelUp()
        }, 1000)
      }
      that.setData({
        button1animation: 'scale-down',
      })
      setTimeout(function() {
        that.setData({
          button1animation: '',
        })
      }, 1000)
    }else{
      wx.showToast({
        title: '资源不足',
        icon:'error'
      })
    }

  },
  button2animation:function(){
    var that = this;
    if(this.data.fertilizerRes>0){
      if(this.data.tree==0){
        if(this.data.fertilizer<100){
          this.setData({
            fertilizer:this.data.fertilizer+50,
            fertilizerRes:that.data.fertilizerRes-1
          })
        }
        that.setData({
          tree:1,
        })
        setTimeout(function() {
          that.setData({
            tree:0
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==2){
        if(this.data.fertilizer<100){
          this.setData({
            fertilizer:this.data.fertilizer+25,
            fertilizerRes:that.data.fertilizerRes-1
          })
        }
        that.setData({
          tree:3,
        })
        setTimeout(function() {
          that.setData({
            tree:2
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==4){
        if(this.data.fertilizer<100){
          this.setData({
            fertilizer:this.data.fertilizer+10,
            fertilizerRes:that.data.fertilizerRes-1
          })
        }
        that.setData({
          tree:5,
        })
        setTimeout(function() {
          that.setData({
            tree:4
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==6){
        if(this.data.fertilizer<100){
          this.setData({
            fertilizer:this.data.fertilizer+5,
            fertilizerRes:that.data.fertilizerRes-1
          })
        }
        that.setData({
          tree:7,
        })
        setTimeout(function() {
          that.setData({
            tree:6
          })
          that.judgeLevelUp()
        }, 1000)
      }
      that.setData({
        button2animation: 'scale-down',
      })
      setTimeout(function() {
        that.setData({
          button2animation: '',
        })
      }, 1000)
    }else{
      wx.showToast({
        title: '资源不足',
        icon:'error'
      })
    }

    this.judgeLevelUp()
    
  },
  button3animation:function(){
    var that = this;
    if(this.data.medicineRes>0){
      if(this.data.tree==0){
        if(this.data.medicine<100){
          this.setData({
            medicine:this.data.medicine+50,
            medicineRes:that.data.medicineRes-1
          })
        }
        that.setData({
          tree:1,
        })
        setTimeout(function() {
          that.setData({
            tree:0
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==2){
        if(this.data.medicine<100){
          this.setData({
            medicine:this.data.medicine+25,
            medicineRes:that.data.medicineRes-1
          })
        }
        that.setData({
          tree:3,
        })
        setTimeout(function() {
          that.setData({
            tree:2
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==4){
        if(this.data.medicine<100){
          this.setData({
            medicine:this.data.medicine+10,
            medicineRes:that.data.medicineRes-1
          })
        }
        that.setData({
          tree:5,
        })
        setTimeout(function() {
          that.setData({
            tree:4
          })
          that.judgeLevelUp()
        }, 1000)
      }else if(this.data.tree==6){
        if(this.data.medicine<100){
          this.setData({
            medicine:this.data.medicine+5,
            medicineRes:that.data.medicineRes-1
          })
        }
        that.setData({
          tree:7,
        })
        setTimeout(function() {
          that.setData({
            tree:6
          })
          that.judgeLevelUp()
        }, 1000)
      }
      that.setData({
        button3animation: 'scale-down',
      })
      setTimeout(function() {
        that.setData({
          button3animation: '',
        })
      }, 1000)
    }else{
      wx.showToast({
        title: '资源不足',
        icon:'error'
      })
    }

    this.judgeLevelUp()
    
  },
  showProgress:function(){
    var that=this
    if(this.data.progress==1&this.data.progressAnimation==''){
      this.setData({
        progressAnimation:'slide-right',
        loading:false
      })
      setTimeout(function() {
        that.setData({
          progress:0,
          progressAnimation: '',
        })
      }, 1000)
    }else if(this.data.progress==0&this.data.progressAnimation==''){
      this.setData({
        progress:1,
        progressAnimation:'slide-right',
        loading:true
      })
      setTimeout(function() {
        that.setData({
          progressAnimation: '',
        })
      }, 1000)
    }

  },
  showModal() {
    this.setData({
      modalName: 'Image'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
    if(app.globalData.stunum==null){
      wx.showToast({
        title: '还未登录哦~',
        icon:'none'
      })
    }
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
    var that=this;
    this.getTabBar().setData({
      selected: 2
    })
    if(app.globalData.stunum==null){
      wx.showToast({
        title: '请先登录哦~',
        icon:'none'
      })
      this.setData({
        fertilizerRes:10,
        fertilizer:0,
        waterRes:10,
        water:0,
        medicineRes:10,
        medicine:0,
        tree:0
      })
    }else{
        wx.request({
        url: app.globalData.severAddress+'/api/v1/users/'+app.globalData.stunum+'/credit',
        method: 'GET',
        header:{
          'Authorization':'Bearer '+app.globalData.token,
          'content-type':'application/json',
        },
        data: {
        },
        success: (res) => {
          if(res.statusCode==200){
            console.log('获取积分信息:',res)
            that.setData({
              credit:res.data
            })
          }
          
        }
      })
      wx.request({
        url: app.globalData.severAddress+'/api/v1/users/me/tree',
        method: 'GET',
        header:{
          'Authorization':'Bearer '+app.globalData.token,
          'content-type':'application/json'
        },
        data: {
        },
        success: (res) => {
          console.log('获取树信息:',res)
          if(res.data.level!=null){
            that.setData({
                 fertilizerRes:res.data.remainingFertilizer,
                 fertilizer:res.data.fertilizer,
                 waterRes:res.data.remainingWater,
                 water:res.data.water,
                 medicineRes:res.data.remainingMedicine,
                 medicine:res.data.medicine,
                 tree:res.data.level*2

            })
          }
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    var that=this
    if(app.globalData.stunum){
        wx.request({
          url: app.globalData.severAddress+'/api/v1/users/me/tree',
          method: 'PUT',
          header:{
            'Authorization':'Bearer '+app.globalData.token,
            'content-type':'application/json',
          },
          data: {
            remainingWater:that.data.waterRes,
            water:that.data.water,
            remainingFertilizer:that.data.fertilizerRes,
            fertilizer:that.data.fertilizer,
            remainingMedicine:that.data.medicineRes,
            medicine:that.data.medicine,
            level:that.data.tree/2,
          },
          success: (res) => {
              console.log('树苗状态已保存:',res) 
          }
        })
      }

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
    return {
      title: '😊卫生委员 '+app.globalData.userInfo.nickName+' 喊你一起来种树哦~',
      path: '/pages/tree/tree?launchStuNum='+app.globalData.stunum,
      imageUrl:'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE1O04IH/45NBuzDIW489QBoVep5mccoB4lWxGo.G3zaEKQ17fZkKxPsPERAik3giyFICMfq9.VhKhmXyChGGh50iddGkLKtxfIa*pG9cjznIuWrmquk!/b&bo=6AOuAugDrgIDGTw!&rf=viewer_4&t=5'
    }
  },
  onShareTimeline: function () {
    return {
      title: '😊卫生委员 '+app.globalData.userInfo.nickName+' 喊你一起来种树哦~',
      path: '/pages/tree/tree?launchStuNum='+app.globalData.stunum,
      imageUrl:'http://m.qpic.cn/psc?/V51o6AfO138S3m3lNdc10hOSZE1O04IH/45NBuzDIW489QBoVep5mccoB4lWxGo.G3zaEKQ17fZkKxPsPERAik3giyFICMfq9.VhKhmXyChGGh50iddGkLKtxfIa*pG9cjznIuWrmquk!/b&bo=6AOuAugDrgIDGTw!&rf=viewer_4&t=5'
    }
  },
})