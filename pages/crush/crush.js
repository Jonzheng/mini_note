const Size = 70
const MaxX = 9
const MaxY = 9
const Paths = [
  '13',
  // '43',
  // '220',
  // '233',
  '370',
  '384',
  // '661',
  // '671',
  '721',
  // '764',
]

Array.prototype.shuffle = function () {
  var array = this;
  var m = array.length,
    t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

Page({

  data: {
    curIdx: -1,
    items: []
  },

  onLoad() {
    this.initItems()
  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  },

  initItems(){
    let bucket = []
    let t = 0
    while(bucket.length < MaxX * MaxY && t < 66) {
      t += 1
      bucket = bucket.concat(Paths)
    }
    while(bucket.length > MaxX * MaxY) {
      bucket.pop();
    }
    bucket = bucket.shuffle();
    const items = [];
    this._itemsIdx = []
    // {idx: 35, on: true, value: 66, path: '../../images/66_1.png', x: Size * 2 + 18, y: Size * 2 + 18},
    bucket.forEach((it, idx) => {
      this._itemsIdx.push(idx);
      const ix = ~~(idx % MaxX)
      const iy = ~~(idx / MaxX)
      items.push({
        pos: idx,
        ori: idx,
        on: true,
        value: ~~(it),
        path: `../../images/${it}.png`,
        x: ix * Size + (ix + 1) * 6,
        y: iy * Size + (iy + 1) * 6
      });
    });
    console.log(items)
    this.setData({
      items
    });
  },

  clickItem(e) {
    const { idx } = e.currentTarget.dataset;
    const { items } = this.data
    const isNear = this.nearBy(idx, this._preIdx, items);
    console.log('---', isNear, this._preIdx, idx);
    if (!isNear) {
      this._preIdx = idx
      return this.setData({
        curIdx: idx
      });
    }
    if (isNear) {
      // this.makeMatrix(items);
      const preItem = Object.assign({}, items[this._preIdx]);
      const item = items[idx]

      const tmp = this._itemsIdx[preItem.pos];
      this._itemsIdx[preItem.pos] = this._itemsIdx[item.pos];
      this._itemsIdx[item.pos] = tmp;

      items[this._preIdx].x = item.x
      items[this._preIdx].y = item.y
      items[this._preIdx].pos = item.pos
      items[idx].x = preItem.x
      items[idx].y = preItem.y
      items[idx].pos = preItem.pos
      this._preIdx = undefined
      console.log('this._itemsIdx', this._itemsIdx)
      this.setData({
        items,
        curIdx: -1
      }, ()=>{
        // this.checkCrush(items);
        // const _items = Object.assign([], items);
        // _items.sort((a, b) => a.pos - b.pos);
        const idxs = this.getHorizontalIdx()//.concat(this.getVerticalArr(items));
        this.updateItems(idxs);
      });
    }
  },

  makeMatrix(items){
    this._matrix = Array(MaxY).fill().map(() => Array(MaxX).fill(0));
    this._idxArr = []
    items.forEach((it, idx) => {
      console.log(~~(idx / MaxX), idx % MaxX)
      this._matrix[~~(idx / MaxX)][idx % MaxX] = idx;
      this._idxArr.push(idx);
    });
    console.log(...this._matrix)
  },

  updateItems(idxs){
    this._stc = setTimeout(() => {
      this._stc = ''
      const {items: itemsOri} = this.data;
      for(let i of idxs) {
        const oi = this._itemsIdx[i]
        this._itemsIdx[i] = ~~(Math.random() * 1000000);
        itemsOri[oi].on = false;
        itemsOri[oi].y = -50;
      };
      // for (let i of relIdx) {
      //   let upIdx = i - MaxX;
      //   while(upIdx > -1) {
      //     this._itemsIdx[i+MaxX] = this._itemsIdx[upIdx];
      //     this._itemsIdx[i+MaxX] = '';
      //     let ori = this._itemsIdx[upIdx]
      //     if (itemsOri[ori].on) {
      //       itemsOri[ori].pos += MaxX
      //       itemsOri[ori].y += (Size + 6)
      //     }
      //     upIdx -= MaxX
      //   }
      // }

      this.setData({
        items: itemsOri
      })
    }, 300)
  },

  getHorizontalIdx(){
    const {items} = this.data;
    let idxs = []
    let tmp = [];
    let prePos = 0
    this._itemsIdx.forEach((it, idx) => {
      if (idx % MaxY === 0) {
        if (tmp.length > 2) {
          idxs = idxs.concat(tmp)
        }
        tmp = [idx]
        prePos = it
      } else if (items[it] !== undefined && items[prePos] !== undefined && items[it].value === items[prePos].value) {
        tmp.push(idx)
      } else {
        if (tmp.length > 2) {
          idxs = idxs.concat(tmp)
        }
        tmp = [idx]
        prePos = it
      }
      if (idx === this._itemsIdx.length - 1) {
        if (tmp.length > 2) {
          idxs = idxs.concat(tmp)
        }
      }
    })
    console.log('horizontalIdxs:', ...idxs);
    return idxs;
  },

  getHorizontalArr(items){
    let horizontalIdxs = []
    let tmp = []
    items.forEach((it, idx)=>{
      it.idx = idx;
      if (!tmp[0]) {
        tmp.unshift(it)
      } else if (idx % MaxX === 0) {
        if (tmp.length > 2) {
          // horizontalIdxs.push(tmp.map(it=>it.idx));
          horizontalIdxs = horizontalIdxs.concat(tmp.map(it=>it.ori))
          tmp = [it]
        } else {
          tmp = [it]
        }
      } else if (tmp[0].value === it.value) {
        tmp.unshift(it)
      } else if (tmp.length > 2) {
        // horizontalIdxs.push(tmp.map(it=>it.idx));
        horizontalIdxs = horizontalIdxs.concat(tmp.map(it=>it.ori))
        tmp = [it]
      } else {
        tmp = [it]
      }
      console.log('idx', idx)
      if (idx === items.length - 1) {
        console.log('idx', idx, tmp)
        if (tmp.length > 2) {
          // horizontalIdxs.push(tmp.map(it=>it.idx));
          horizontalIdxs = horizontalIdxs.concat(tmp.map(it=>it.ori))
          tmp = []
        }
      }
    });
    console.log('horizontalIdxs:', ...horizontalIdxs);
    return horizontalIdxs;
  },

  getVerticalArr(items) {
    items = Object.assign([], items);
    items.sort((a, b) => a.pos - b.pos);
    let verticalIdxs = [];
    for (let i=0; i < MaxX; i++) {
      let tmp = []
      let vi = i;
      while(vi < items.length) {
        // console.log('vi', vi, items[vi].value)
        if (!tmp[0]) {
          tmp = [items[vi]]
        } else if (tmp[0].value === items[vi].value) {
          tmp.unshift(items[vi])
        } else if (!items[vi]) {
          if (tmp.length > 2) {
            // verticalIdxs.push(tmp.map(it=>it.ori))
            verticalIdxs = verticalIdxs.concat(tmp.map(it=>it.ori))
          }
        } else {
          if (tmp.length > 2) {
            // verticalIdxs.push(tmp.map(it=>it.ori))
            verticalIdxs = verticalIdxs.concat(tmp.map(it=>it.ori))
            tmp = [items[vi]]
          } else {
            tmp = [items[vi]]
          }
        }
        if (vi + MaxX > items.length - 1 && tmp.length > 2) {
          // verticalIdxs.push(tmp.map(it=>it.ori))
          verticalIdxs = verticalIdxs.concat(tmp.map(it=>it.ori))
        }
        vi += MaxX;
      }
    }
    console.log('verticalIdxs:', verticalIdxs)
    return verticalIdxs;
  },

  checkCrush(items) {
    items = Object.assign([], items);
    this._checkEnd = false;
    // if (this._stc) return;
    this._stc = setTimeout(() => {
      this._stc = '';
      this._checkEnd = true;
      items.sort((a, b) => a.pos - b.pos);
      console.log(items)
      const {items: itemsOri} = this.data;
      // verticalIdxs.forEach(it=>{
      //   it.forEach(i=>{
      //     itemsOri[i].on = false
      //   })
      // });
      verticalIdxs.forEach(arr=>{
        arr.forEach(i=>{
          itemsOri[i].on = false
          itemsOri[i].pos = -1
          itemsOri[i].y = -50
        });
        // const size = arr.length;
        // let bi = arr[size - 1]
        // while(itemsOri[bi]) {
        //   if (itemsOri[bi].on) {
        //     itemsOri[bi].pos = bi + size * MaxX
        //     itemsOri[bi].y = itemsOri[bi].y + (Size + 6) * size;
        //   }
        //   bi -= MaxX
        // }
      })
      this.setData({ items: itemsOri });
    }, 300)
  },

  nearBy(idxA, idxB, items){
    if (idxA === undefined || idxB === undefined) return false;
    items = items || this.data.items;
    let near = Math.abs(items[idxA].pos - items[idxB].pos) === 1;
    if (!near) {
      near = items[idxB].pos - items[idxA].pos === MaxX
    }
    if (!near) {
      near = items[idxA].pos - items[idxB].pos === MaxX
    }
    return near;
  },
})