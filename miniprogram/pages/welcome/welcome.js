// miniprogram/pages/welcome/welcome.js
const app=getApp()
Page({
  data:{
      imgs:[
          // "/images/welcome1.jpg",
          // "/images/welcome2.jpg",
          "/images/LOGO.jpg"
     ],
     num:5,
     pageChange:0
  },

  onLoad(){
    var that=this
    this.setData({
      ScreenHeight:app.globalData.WindowHeight,
      ScreenHeight70Percent:app.globalData.WindowHeight*0.6,
    })
    that.data.setInter = setInterval(
      function () {
          var numVal = that.data.num - 1;
          that.setData({ num: numVal });
          console.log('setInterval==' + that.data.num);
          if(that.data.num<=0){
            if(that.data.pageChange!=1){
              that.start()
            }
            clearInterval(that.data.setInter)
          }
      }
, 1000);   
    // setTimeout(function() {
    //   that.start()
    // }, 3000)
  },
  start(){
    this.setData({
      pageChange:1
    })
       wx.switchTab({
         url: '../index/index',
       })
  },
  

})