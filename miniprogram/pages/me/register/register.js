// miniprogram/pages/me/register/register.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    picker: ['男', '女'],
    index1: null,
    picker1: ['信息与通信工程学院', '其他'],
    index2: null,
    picker2: ['2010', '2011','2012', '2013','2014','2015', '2016','2017', '2018','2019', '2020','2021', '其他'],
    imgList: [],
    realName:'',
    stunum:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSchools()
  
    // wx.showToast({
    //   title: '暂未开放',
    //   icon:'error'
    // })
    // setTimeout(function() {
    //   wx.navigateBack({
    //     delta: 0,
    //   })
    // }, 2000)

  },
  getSchools:function(){
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
        const newSchools=[]
        res.data._embedded.schoolList.forEach((element, index, array) => {
  
          newSchools.push(
            element.name
          )
      })
      this.setData({
        picker1:newSchools
      })
      }
    })
  },
  // 学号
  stunumInput: function(e) {
    this.setData({
      stunum: e.detail.value
    });
  },
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    });
  },
  codeInputAgain: function(e) {
    this.setData({
      codeAgain: e.detail.value
    });
  },
  // 真实姓名
  nameInput: function(e) {
    this.setData({
      realName: e.detail.value
    });
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  PickerChange1(e) {
    console.log(e);
    this.setData({
      index1: e.detail.value
    })
  },
  PickerChange2(e) {
    console.log(e);
    this.setData({
      index2: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '您好',
      content: '确定删除这张图片？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  submit:function(){
    const db = wx.cloud.database();
    var stunumreg = /^20(\d{8})+$/;
    var namereg = /^[\u4E00-\u9FA5]+$/;
    if (this.data.realName === '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    } 
    // else if (this.data.index==null) {
    //     wx.showToast({
    //       title: '请选择性别',
    //       icon: 'none',
    //       duration: 2000,
    //       mask: true
    //     })
    //   }
      else if (!stunumreg.test(this.data.stunum)) {
      wx.showToast({
        title: '请输入正确的学号',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    } else if (!namereg.test(this.data.realName)) {
      wx.showToast({
        title: '请输入正确的名字',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }else if (this.data.code!=this.data.codeAgain) {
      wx.showToast({
        title: '密码输入不一致',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }else if(this.data.index1==null){
      wx.showToast({
        title: '请选择学院',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }else if(this.data.index2==null){
      wx.showToast({
        title: '请选择入学年份',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }else{
      this.register()
      // db.collection('user').add({
      //   // data 字段表示需新增的 JSON 数据
      //   data: {
      //     realName: this.data.realName,
      //     stunum: this.data.stunum,
      //     sex: this.data.picker[this.data.index],
      //     institute: this.data.picker1[this.data.index1],
      //     yearOfEnrollment: this.data.picker2[this.data.index2],
      //     identification:0
      //   },
      //   success: function(res) {
      //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      //     var pages = getCurrentPages();
      //     //获取上一个页面的所有的方法和data中的数据
      //     var lastpage = pages[pages.length - 2]
      //     lastpage.showMyRecord()
      //     console.log(res);
      //     wx.showToast({
      //       title: '提交成功',
      //       icon: 'none',
      //       duration: 2000,
      //       mask: true
      //     })
      //     wx.navigateBack({
      //       delta: 0,
      //     })
      //   }
      // })
    }

  },
  register:function(){
    console.log('点击')
    wx.request({
      url: app.globalData.severAddress+'/api/v1/users',
      method: 'POST',
      data: {
        username:this.data.stunum,
        password:this.data.code,
        realName:this.data.realName,
        openId:'',
        schoolId:this.data.index1,
        timeOfEnrollment:this.data.picker2[this.data.index2]
      },
      success: (res) => {
        console.log(res)
        if(res.statusCode==201){
          wx.showToast({
            title: '注册成功',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 0,
            })
          }, 2000)
        }else if(res.statusCode==409){
          wx.showToast({
            title: '该用户已注册',
            icon: 'error',
            duration: 2000,
            mask: true
          })
        }else{
          wx.showToast({
            title: '网络出错',
            icon: 'error',
            duration: 2000,
            mask: true
          })
        }
 
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