const app=getApp()
Component({
  data: {
    selected:0,
    color: "#ffffff",
    selectedColor: "#cce6ff",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "首页",
      "iconPath": "/images/tabbar/index.png",
      "selectedIconPath": "/images/tabbar/index_cur.png"
    },
    {
      "pagePath": "/pages/activity/activity",
      "text": "活动",
      "iconPath": "/images/tabbar/shop.png",
      "selectedIconPath": "/images/tabbar/shop_cur.png"
    },
    {
      "pagePath": "/pages/tree/tree",
      "text": "种树",
      "iconPath": "/images/tabbar/tree.png",
      "selectedIconPath": "/images/tabbar/tree_cur.png"
    },
    {
      "pagePath": "/pages/me/me",
      "text": "我的",
      "iconPath": "/images/tabbar/me.png",
      "selectedIconPath": "/images/tabbar/me_cur.png"
    }]
  },
  attached() {
  },
  
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})

    },
  }
})