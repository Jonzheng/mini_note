const _cur = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['https://webcdn-75028.gzc.vod.tencent-cloud.com/mini/tmp/faraday0.jpg', 'https://webcdn-75028.gzc.vod.tencent-cloud.com/mini/tmp/shileimu0.jpg', 'https://webcdn-75028.gzc.vod.tencent-cloud.com/mini/tmp/peki.png'],
    list2: [],
    current: _cur
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._last = _cur;
    this._queue = ['aw', 'be', 'ch', 'de', 'ey', 'ff', 'gg', 'hu'];
    this._pageNo = 1;
    const srcList = ['https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/0c87d00770062d0f6fb74ee806070f4c.jpg', 'https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/3321f090ed3be9038563c660fac98776.jpg', 'https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/cf13f303d58c108d3265d16ddf0f6cc4.gif', 'https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/b4b803bb0813dc0047603104253205fd.jpg', 'https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/ef6e8e6f656a13c6e4f9db2e15301548.jpg', 'https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/483f227c3d1ac4c9d94951ade26bfcd5.jpg', 'https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/99c1a2ddca2f0c8d72b701d7ebf7725d.gif', 'https://webcdn.m.qq.com/mpmatrix_test/bqb/materia/58a561c90def699b484a7c14fbba7f6a.gif'];
    const queue = { list: srcList, curIdx: 1 };
    this.setData({ queue });
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

  navigateTo() {
    console.log('back');
    wx.navigateBack({
      delta: 1,
    });
  },

  nextPage() {
    this._pageNo += 1;
    console.log('this._pageNo', this._pageNo);
  },

  setCurrent(e) {
    console.log(e.detail);
  },

  clickItem(e) {
    console.log(e.detail);
  },

  _chage(e) {
    console.log(e.detail);
  },

  _trans(e) {
    console.log('_trans', e.detail);
  }
});
