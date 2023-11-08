// pages/clip/clip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  setA() {
      const clip1 = this.randomTri(0, 0, 400)
      const clip2 = this.randomTri(20, 80, 200)
      console.log(...clip1)
      console.log(...clip2)
      this.setData({
          clip1,
          clip2
      })
  },

  randomTri(a, b, s){
    const d3 = s / 3
    const pu1 = d3 + Math.random() * d3
    const pu2 = d3 + Math.random() * d3
    const pu3 = d3 + Math.random() * d3
    const pu4 = d3 + Math.random() * d3
    const p1 = `${a}rpx ${b}rpx`
    const p2 = `${a+pu1}rpx ${b}rpx`
    const p3 = `${a+s}rpx ${b}rpx`
    const p4 = `${a}rpx ${b+s-pu2}rpx`
    const p5 = `${a+s}rpx ${b+pu3}rpx`
    const p6 = `${a}rpx ${b+s}rpx`
    const p7 = `${a+s-pu4}rpx ${b+s}rpx`
    const p8 = `${a+s}rpx ${b+s}rpx`
    const pc = `${a+s/2}rpx ${b+s/2}rpx`
    return [
        `polygon(${p1}, ${p2}, ${p4});background:#152695`,
        `polygon(${p2}, ${p3}, ${p5});background:#526950`,
        `polygon(${p4}, ${p6}, ${p7});background:#269515`,
        `polygon(${p7}, ${p8}, ${p5});background:#695152`,
        `polygon(${pc}, ${p2}, ${p4});background:#959026`,
        `polygon(${pc}, ${p2}, ${p5});background:#951526`,
        `polygon(${pc}, ${p5}, ${p7});background:#515269`,
        `polygon(${pc}, ${p4}, ${p7});background:#255169`,
    ]
  },
})