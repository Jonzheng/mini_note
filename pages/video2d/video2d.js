// 定义常量，棋盘宽度50，高度50，每个方块的宽高为10
const WIDTH = 32
const HEIGHT = 32
const ITEM_WIDTH = 2
const w = 300
let h = 200
const frameQueue = [];
Page({

  data: {
      cvHeight: 200,
      cvWidth: 300,
      h
    },

    onLoad: function (options) {
      this._round = 0
      wx.createSelectorQuery().select('#canvas2d2').fields({ node: true, size: true }).exec(this.init2.bind(this))
      wx.createSelectorQuery().select('#canvas2d').fields({ node: true, size: true }).exec(this.init.bind(this))
      this._dpr = wx.getSystemInfoSync().pixelRatio;
    },

    onReady() {
      this.setData({ src: 'https://systems-1256378396.cos.ap-guangzhou.myqcloud.com/badapple10.mp4' });
      // wx.showLoading({
      //   title: '加载中',
      // })
      // wx.downloadFile({
      //   url: 'https://systems-1256378396.cos.ap-guangzhou.myqcloud.com/badapple10.mp4',
      //   success: (e) => {
      //     this.setData({src: e.tempFilePath})
      //   },
      //   fail(e) {
      //     console.log('download fail', e)
      //   },
      //   complete() {
      //     wx.hideLoading()
      //   }
      // })
      let frameQueue = wx.getStorageSync('frameQueue') || '[]';
      console.log('frameQueue', frameQueue);
      frameQueue = JSON.parse(frameQueue);
      console.log(frameQueue);
    },

    onShow: function () {

    },

    onShareAppMessage: function () {

    },

    init(res) {
      console.log(res)
      let { cvWidth, cvHeight } = this.data;
      const width = res[0].width
      const height = res[0].height
      const canvas = res[0].node
      this._ctx = canvas.getContext('2d');
      const ctx = this._ctx;
      const dpr = this._dpr;
      canvas.width = width * dpr
      canvas.height = height * dpr
      // this._ctx.scale(dpr, dpr)
      this._ctx.strokeStyle = '#CFEFEF';
      this._ctx.fillStyle = '#CFEFEC';
      console.log('canvas2d:', canvas.width, canvas.height);
      this._ctx.fillRect(0, 0, canvas.width, canvas.height);
      const imgItem = canvas.createImage();
      imgItem.src = 'https://pub.pm.qq.com/minigood_beta/22d3d1e535bf820aee0b6e9afcdc7b3a/58b56e4aa220f12e03a9dec86536dbda.jpg';
      imgItem.src = '/images/mine-on.png';
      imgItem.src = 'https://webcdn.m.qq.com/mini/tmp/badapple6.png';
      imgItem.onload = ()=>{
        // let h = imgItem.height;
        // let w = imgItem.width;
        // let setHeight = 250, //默认源图截取的区域
        //   setWidth = 320; //默认源图截取的区域
        // if (w / h > 320 / 410) {
        //   setHeight = h;
        //   setWidth = parseInt(320 / 410 * h);
        // } else {
        //   setWidth = w;
        //   setHeight = parseInt(410 / 320 * w);
        // }

        console.log('imgItem==', imgItem.width, 'x', imgItem.height)
        // this._ctx.drawImage(imgItem, 0, 0, imgItem.width, imgItem.height,0,0, imgItem.width, imgItem.height);
        // this._ctx.drawImage(imgItem, 0, 0, imgItem.width, imgItem.height,0,0, canvas.width, canvas.height);
        // this._ctx.drawImage(imgItem, 0, 0, imgItem.width, imgItem.height);
        this._ctx.drawImage(imgItem, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData);
        const particles = this.calculate(imageData);
        console.log('particles', particles);
        this.drawItem(particles);
    }

    },

    init2(res){
      const width = res[0].width
      const height = res[0].height
      const canvas = res[0].node
      this._ctx2 = canvas.getContext('2d');
      const dpr = this._dpr;
      canvas.width = width * dpr
      canvas.height = height * dpr
      // this._ctx2.scale(1, 1)
      this._ctx2.fillStyle = '#FFFFFF';
      this._ctx2.fillRect(0, 0, canvas.width, canvas.height);

      // this._ctx2.fillStyle = '#088088';
      // console.log('canvas2d2:', canvas.width, canvas.height, 'dpr:', dpr);
      // for (let x =0;x<canvas.width;x++){
      //   for (let y =0;y<canvas.height;y++){
      //     if ( x == 1.5*y ) {
      //       this._ctx2.fillRect(x, y, 1, 1);
      //     }
      //   }
      // }
      // this._ctx2.fillRect(50, 100, 22, 22);

  },

    //计算并保存坐标
    calculate(imageData) {
        let particles = [];
        let s_width = imageData.width
        let s_height = imageData.height
        let pos = 0; //数组中的位置
        let data = imageData.data;  //像素值数组
        for(let j = 0; j < s_height; j+=3) {
            for(let i = 0; i < s_width; i+=3) {
                //计算(i,j)在数组中的R的坐标值
                // pos = [(j - 1)*imageData.width + (i - 1)]*4 + 1;
                // i = x * width + y
                pos = 4 * (j * s_width + i) + 1;
                // console.log(pos, data[pos]);
                //判断R值是否符合要求
                // if(!!(data[pos] < 200 && data[pos-1] < 200 && data[pos-2] < 200))	{
                if(data[pos] < 250)	{
                  const fillStyle  = data[pos] < 100 ? '#000000' : '#CC0000';
                  // const fillStyle  = data[pos] < 100 ? 0 : 1;
                  let particle = {
                      //偏移，x,y值都随机一下
                      // x: i*s_width + (Math.random() - 0.5)*20,
                      // y: j*s_height + (Math.random() - 0.5)*20,
                      x: i,
                      y: j,
                      fillStyle
                  }
                  //符合要求的粒子保存到数组里
                  // let particle = `${i},${j},${fillStyle};`
                  particles.push(particle);
                }
            }
        }
        return particles;
    },
    
    drawItem(particles, ctx = this._ctx2) {
        // 把保存的粒子全部绘制到画布里
        this._ctx2.fillStyle = '#FFFFFF';
        this._ctx2.fillRect(0, 0, 900, 600);
        let minX = 999, minY = 999, maxX = 0,maxY = 0;
        particles.forEach((cur, idx)=>{
            ctx.fillStyle = cur.fillStyle;
            ctx.fillRect(cur.x,cur.y,1,1);
            minX = cur.x < minX ? cur.x : minX;
            minY = cur.y < minY ? cur.y : minY;
            maxX = cur.x > maxX ? cur.x : maxX;
            maxY = cur.y > maxY ? cur.y : maxY;
        })
    },

    async saveImg() {
      const query = wx.createSelectorQuery();
      const canvasObj = await new Promise((resolve, reject) => {
        query.select('#cvs1').fields({ node: true, size: true }).exec(async (res) => {
            resolve(res[0].node);
          })
      });
      wx.canvasToTempFilePath({
        canvas: canvasObj,
        success: (res) => {
          console.log(res.tempFilePath);
          this.setData({ tempSrc: res.tempFilePath});

          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res => {
              console.log(res);
            },
            fail: e => {
              console.log('save fail', e);
              wx.showToast({
                title: '图片未保存',
                icon: 'none'
              });
            }
          });

        },
        fail(res) {
          console.log(res);
        }
      }, this)
    },

    loadedmetadata(e) {
      h = w / e.detail.width * e.detail.height;
      // return console.log('loadedmetadata', e)
      this.setData({
        h,
      }, () => {
        this.drawVideo()
      })
    },
    drawVideo() {
      const dpr = wx.getSystemInfoSync().pixelRatio
      wx.createSelectorQuery().select('#video').context(res => {
        console.log('select video', res)
        const video = this.video = res.context
        wx.createSelectorQuery().selectAll('#cvs2').node(res => {
          const ctx2 = res[0].node.getContext('2d')
          res[0].node.width = w * dpr
          res[0].node.height = h * dpr
          wx.createSelectorQuery().selectAll('#cvs1').node(res => {
            const ctx1 = res[0].node.getContext('2d')
            res[0].node.width = w * dpr
            res[0].node.height = h * dpr
            let dua = 0;
            let gap = 200;
            this._st = setInterval(() => {
              ctx1.drawImage(video, 0, 0, w * dpr, h * dpr);
              const imageData = ctx1.getImageData(0, 0, w * dpr, h * dpr);
              const particles = this.calculate(imageData);
              // frameQueue.push(imageData.data);
              this.drawItem(particles);
              dua += gap;
              console.log(dua)
              if (dua > 9000) {
                clearInterval(this._st);
                // let data = frameQueue;
                // let data = JSON.stringify(frameQueue);
                // // wx.setStorageSync('frameQueue', data);
                // console.log(frameQueue.length, data);
                // wx.setStorage({
                //   key: 'frameQueue',
                //   data,
                //   complete: (res)=>{
                //     console.log(res);
                //   }
                // })
              }
            }, gap)
          }).exec()


        }).exec()

      }).exec()
    },

})