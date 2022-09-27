// miniprogram/pages/index/knowledge/queryResult/queryResult.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList:[
      { title: "照片识别的可能结果都展现在下方了哦~" },
      { title: "点击青色卡片可查看相关物品及其垃圾分类情况！" },
      { title: "不同类型的垃圾显示颜色不同哦~" }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.queryWay=='word'){
      const newQueryResultList=[]
      app.globalData.garbageQueryResult.forEach((element, index, array) => {
        var categoryName = ''
        var color = ''
        var bgColor = ''
        if (element.category === '湿垃圾') {
            categoryName = '厨余垃圾'
            color = '#d7f0db'
            bgColor='bg-green'
        } else if (element.category === '干垃圾') {
            categoryName = '其他垃圾'
            color = '#e7ebed'
            bgColor='bg-gray'
        } else if (element.category === '有害垃圾') {
            categoryName = '有害垃圾'
            color = '#fadbd9'
            bgColor='bg-red'
        } else if (element.category === '可回收垃圾') {
            categoryName = '可回收垃圾'
            color = '#cce6ff'
            bgColor='bg-blue'
        }
  
        newQueryResultList.push({
          name:element.name,
          category:categoryName,
          color:color,
          bgColor:bgColor
        })
      })
      this.setData({
        queryWay:options.queryWay,
        name:options.name,
        queryResult:newQueryResultList
      })
    }else if(options.queryWay=='pic'){
      app.globalData.garbageQueryResult.forEach((element, index, array) => {
        element.score=parseInt(element.score*100)
        element.show=0
        if(element.list){
          const newList=[]
          element.list.forEach((element, index, array) => {
        var categoryName = ''
        var color = ''
        var bgColor = ''
        if (element.category === '湿垃圾') {
            categoryName = '厨余垃圾'
            color = '#d7f0db'
            bgColor='bg-green'
        } else if (element.category === '干垃圾') {
            categoryName = '其他垃圾'
            color = '#e7ebed'
            bgColor='bg-gray'
        } else if (element.category === '有害垃圾') {
            categoryName = '有害垃圾'
            color = '#fadbd9'
            bgColor='bg-red'
        } else if (element.category === '可回收垃圾') {
            categoryName = '可回收垃圾'
            color = '#cce6ff'
            bgColor='bg-blue'
        }
  
        newList.push({
          name:element.name,
          category:categoryName,
          color:color,
          bgColor:bgColor
        })
        
      })
      element.list=newList
        }
        
      })
      this.setData({
        queryWay:options.queryWay,
        name:options.name,
        queryResult:app.globalData.garbageQueryResult
      })
    }
    
  

  },
  showDetail:function(e){
    console.log(e)
    console.log(this.data.queryResult[e.currentTarget.id].show)
    if(this.data.queryResult[e.currentTarget.id].show==0){
      //this.data.queryResult[e.currentTarget.id].show=1
      this.setData({
        [`queryResult[${e.currentTarget.id}].show`]:1 //es6语法拼接这样index可以为动态的值
      })
    }else{
      //this.data.queryResult[e.currentTarget.id].show=0
      this.setData({
        [`queryResult[${e.currentTarget.id}].show`]:0 //es6语法拼接这样index可以为动态的值
      })
    }


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