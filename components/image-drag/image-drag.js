const itemHeight = 230;
const columns = 3;
const iconAdd = '/images/bicon-add.png';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    uploading: {
      type: Boolean,
      value: false
    },
    maxLength: {
      type: Number,
      value: 9,
    },
    chooseImgList: {
      type: Array,
      value: [],
      observer(newList) {
        if (newList.includes(iconAdd)) return;
        if (newList.length == 0) {
          return this.init([]);
        }
        if ((newList[0] && !newList[0].path) || this.data.uploading) return;
        const paths = [];
        newList.forEach((item) => {
          paths.push(item.path);
        });
        if (paths.length > 0) {
          this.init(paths);
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    boxHeight: 230,
    bottomY: 50,
    showAs: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 长按触发移动排序
     */
    longPress(e) {
      this.startX = e.changedTouches[0].pageX;
      this.startY = e.changedTouches[0].pageY;
      const { index, fixed } = e.currentTarget.dataset;
      if (fixed) return;
      this.setData({
        touch: true,
        itemTransition: true
      });
      if (columns === 1) { // 单列时候X轴初始不做位移
        this.tranX = 0;
      } else {  // 多列的时候计算X轴初始位移, 使 item 水平中心移动到点击处
        this.tranX = this.startX - (this.item.width / 2) - this.itemWrap.left;
      }

      // 计算Y轴初始位移, 使 item 垂直中心移动到点击处
      this.tranY = this.startY - (this.item.height / 2) - this.itemWrap.top;
      console.log(this.startY, this.tranY, this.itemWrap.top);
      this.setData({
        itemHover: true,
        cur: index,
        curZ: index,
        tranX: this.tranX,
        tranY: this.tranY,
      });

      wx.vibrateShort();
    },

    touchMove(e) {
      if (!this.data.touch) return;
      const tranX = e.touches[0].pageX - this.startX + this.tranX;
      const tranY = e.touches[0].pageY - this.startY + this.tranY;

      // 拖到删除区域
      const ipxFix = this.data.isIpx ? 50 : 0;
      const itemReach = (this.windowHeight - e.touches[0].clientY + ipxFix < 130);

      this.setData({ tranX, tranY, itemReach });

      const originKey = e.currentTarget.dataset.key;
      const endKey = this.calculateMoving(tranX, tranY);
      // 遇到固定项和超出范围则返回
      if (this.isFixed(endKey)) return;

      // 防止拖拽过程中发生乱序问题
      if (originKey == endKey || this.originKey == originKey) return;

      this.originKey = originKey;
      this.insert(originKey, endKey);
    },

    /**
     * 根据当前的手指偏移量计算目标key
     */
    calculateMoving(tranX, tranY) {
      const rows = Math.ceil(this._itemCount / columns) - 1;
      let i = Math.round(tranX / this.item.width);
      let j = Math.round(tranY / this.item.height);

      i = i > (columns - 1) ? (columns - 1) : i;
      i = i < 0 ? 0 : i;

      j = j < 0 ? 0 : j;
      j = j > rows ? rows : j;

      let endKey = i + (columns * j);

      endKey = endKey >= this._itemCount ? this._itemCount - 1 : endKey;

      return endKey;
    },

    /**
     * 根据起始key和目标key去重新计算每一项的新的key
     *
     */
    insert(origin, end) {
      let list;
      if (origin < end) {
        list = this.data.list.map((item) => {
          if (item.key > -1 && item.key > origin && item.key <= end) {
            item.key = item.key - 1;
          } else if (item.key > -1 && item.key == origin) {
            item.key = end;
          }
          return item;
        });
        this.setPosition(list);
      } else if (origin > end) {
        list = this.data.list.map((item) => {
          if (item.key > -1 && item.key >= end && item.key < origin) {
            item.key = item.key + 1;
          } else if (item.key > -1 && item.key == origin) {
            item.key = end;
          }
          return item;
        });
        this.setPosition(list);
      }
    },

    /**
     * 根据排序后 list 数据进行位移计算
     */
    setPosition(data, vibrate = true, delKey = undefined) {
      const list = data.map(item => {
        if (delKey > -1 && item.key > delKey) item.key -= 1;
        if (item.key > -1) {
          item.tranX = this.item.width * (item.key % columns);
          item.tranY = Math.floor(item.key / columns) * this.item.height;
        }
        return item;
      });
      this.setData({
        list
      });
      console.log('update:', list);
      if (!vibrate) return;

      this.setData({
        itemTransition: true
      });

      wx.vibrateShort();
      // let listData = [];
      // list.forEach((item) => {
      //   listData[item.key] = item.src
      // });
      // console.log('change', listData );
    },

    touchEnd() {
      if (!this.data.touch) return;
      console.log('删除此图：', this.data.itemReach);
      if (this.data.itemReach) {
        this.deleteItem(this.data.cur);
      }
      this.clearData();
      this.setFilePaths();
    },

    deleteItem(idx) {
      idx = (!idx.currentTarget) ? idx : idx.currentTarget.dataset.index;
      const list = this.data.list;
      const delKey = list[idx].key;
      this._itemCount -= 1;
      let boxHeight = this.data.boxHeight;
      list[idx].key = -1;
      boxHeight = Math.ceil(this._itemCount / columns) * itemHeight;
      this.setData({
        list,
        itemTransition: true,
        boxHeight
      });
      this.setPosition(list, true, delKey);
      this.setFilePaths();
    },

    /**
     * 清除参数
     */
    clearData() {
      this.originKey = -1;

      this.setData({
        itemHover: false,
        itemReach: false,
        touch: false,
        cur: -1,
        tranX: 0,
        tranY: 0
      });

      // 延迟清空
      setTimeout(() => {
        this.setData({
          curZ: -1,
        });
      }, 300);
    },

    /**
     * 判断是否是固定的 item
     */
    isFixed(key) {
      const target = this.data.list.find((item) => item.key == key);
      return target.fixed;
      // return (index >= this._itemCount - 1);
    },

    init(listData = []) {
      // 遍历数据源增加扩展项, 以用作排序使用
      const maxLength = this.data.maxLength;
      listData.push(iconAdd);
      // 实际有效的照片
      let count = 0;
      const list = listData.map((item, index) => {
        count = item.includes(iconAdd) ? count : count += 1;
        const data = {
          key: index,
          fixed: item.includes(iconAdd),
          tranX: 0,
          tranY: 0,
          src: item,
          uploadStatus: item.uploadStatus ? item.uploadStatus : -2,
        };
        return data;
      });
      this.windowHeight = wx.getSystemInfoSync().windowHeight;
      // 显示的格子数--用于计算box高度
      this._itemCount = list.length;
      // 添加时剩余可选数量
      this._leftCount = maxLength - count;
      const boxHeight = Math.ceil((this._itemCount > maxLength ? maxLength : this._itemCount) / columns) * itemHeight;

      this.setData({
        list,
        boxHeight,
        itemTransition: false
      });
      this.setFilePaths();

      // 获取每一项的宽高等属性
      this.createSelectorQuery().select('.item-out')
        .boundingClientRect((res) => {
          if (!res) return;
          const rows = Math.ceil(this._itemCount / columns);
          this.item = res;

          this.setPosition(this.data.list, false);

          const itemWrapHeight = rows * res.height;

          this.setData({
            itemWrapHeight
          });

          this.createSelectorQuery().select('.item-wrap')
            .boundingClientRect((res) => {
              if (!this.itemWrap) this.itemWrap = res;
            })
            .exec();
        })
        .exec();
    },

    // 添加照片时重设list
    resetList(paths) {
      let listData = [];
      this.data.list.sort((a, b) => a.key - b.key);
      this.data.list.forEach((item) => {
        if (item.key == -1 || item.fixed) {

        } else {
          listData.push(item.src);
        }
      });
      listData = listData.concat(paths);
      this.init(listData);
    },

    // 添加照片
    addImage() {
      if (this.data.uploading) return;
      wx.chooseImage({
        count: this._leftCount,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          let paths = res.tempFilePaths;
          this.resetList(paths);
        },
      });
    },

    setFilePaths() {
      const tempFilePaths = [];
      const list = [].concat(this.data.list);
      list.sort((a, b) => a.key - b.key);
      list.forEach((item) => {
        if (item.fixed || item.key == -1) {

        } else {
          tempFilePaths.push({ path: item.src, uploadStatus: item.uploadStatus });
        }
      });
      this._leftCount = this.data.maxLength - tempFilePaths.length;
      this.triggerEvent('setFilePaths', { tempFilePaths });
    },
  },

  lifetimes: {
    attached() {
      console.log('在组件实例进入页面节点树时执行:', this.data.chooseImgList, this.data.list);
    }
  },
})