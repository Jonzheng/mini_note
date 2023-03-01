Component({
  /**
   * 组件的属性列表
   */
  properties: {
    queue: {
      type: Object,
      value: {},
      observer(obj) {
        if (!obj) return;
        const { list = [], curIdx = 0 } = obj;
        if (!list || list.length == 0) return;
        this._queue = list;
        if (curIdx == this._idx) return; // 拉取下一页数据时
        this._idx = parseInt(curIdx);
        if (this._idx == this._queue.length - 1) {
          this.triggerEvent('nextPage');
        }
        if (this._idx != undefined && this._idx < this._queue.length) {
          this.initList(this._idx, this._queue);
        } else {
          this.initList(1, this._queue);
        }
      }
    },

    width: {
      type: String,
    },
    height: {
      type: String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    circular: true,
    srcList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initList(idx = 1, queue) {
      this._idx = idx;
      const pidx = (idx - 1) > -1 ? idx - 1 : queue.length - 1;
      const pre = queue[pidx];
      const cur = queue[idx];
      const next = queue[(idx + 1) % queue.length];
      const srcList = [pre, cur, next];
      this._set = new Set(srcList);
      this.setData({ srcList });
    },
    _change(e) {
      const current = e.detail.current;
      this._last = this._last == undefined ? 1 : this._last;
      const diff = current - this._last;
      // console.log(current, 'diff:', diff)
      const direction = diff === -1 || diff === 2 ? 'left' : 'right';
      // console.log('direction', direction)
      this._last = current;
      const srcList = this.data.srcList;
      this.triggerEvent('change', e);
      if (direction == 'right') {
        this._idx = (this._idx + 1) % this._queue.length;
        const next = (current + 1) % 3;
        const idx = (this._idx + 1) % this._queue.length;
        // console.log(next, idx)
        this.triggerEvent('setCurrent', { index: this._idx });
        if (idx == this._queue.length - 2) {
          this.triggerEvent('nextPage');
        }
        const item = this._queue[idx];
        if (srcList.findIndex(it => it == item) > -1) {
          // console.log('same')
        } else {
          srcList[next] = item;
          this.setData({ srcList });
        }
      } else if (direction == 'left') {
        this._idx = (this._idx - 1) > -1 ? this._idx - 1 : this._queue.length - 1;
        const next = current - 1 > -1 ? current - 1 : 2;
        const idx = (this._idx - 1) > -1 ? this._idx - 1 : this._queue.length - 1;
        // console.log(next, idx)
        this.triggerEvent('setCurrent', { index: this._idx });
        const item = this._queue[idx];
        if (srcList.findIndex(it => it == item) > -1) {
          // console.log('same')
        } else {
          srcList[next] = item;
          this.setData({ srcList });
        }
      }
    },

    _transition(e) {
      this.triggerEvent('transition', e);
    },
    _animationfinish(e) {
      this.triggerEvent('animationfinish', e);
    },

    clickItem(e) {
      const { src } = e.currentTarget.dataset;
      this.triggerEvent('clickItem', { index: this._idx, src });
    }

  },

  lifetimes: {
    attached() {

    },
    detached() {
      console.log('detached', this._idx);
    },

  },
});
