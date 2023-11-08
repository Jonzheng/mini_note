const Size = 70
const MaxX = 9
const MaxY = 9
const Paths = [
  // '13',
  // '370',
  // '384',
  // '721',
  // '43',
  // '220',
  // '233',
  // '661',
  // '671',
  // '764',
  '77',
  '78',
  '79'
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
    if (this._stc) clearTimeout(this._stc);
    if (this._sta) clearTimeout(this._sta);
    if (this._stb) clearTimeout(this._stb);
  },

  onUnload() {
    if (this._stc) clearTimeout(this._stc);
    if (this._sta) clearTimeout(this._sta);
    if (this._stb) clearTimeout(this._stb);
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
        on: true,
        value: ~~(it),
        path: `../../images/${it}.jpg`,
        x: ix * Size + (ix + 1) * 6,
        y: iy * Size + (iy + 1) * 6
      });
    });
    this.setData({
      items
    });
  },

  clickItem(e) {
    if (this._lock) return;
    const { pos } = e.currentTarget.dataset;
    const idx = this._itemsIdx[pos]
    const { items } = this.data
    const isNear = this.nearBy(pos, this._prePos);
    if (!isNear) {
      this._preIdx = idx
      this._prePos = pos
      return this.setData({
        curIdx: idx
      });
    }
    if (isNear) {
      // this.makeMatrix(items);
      const preItem = Object.assign({}, items[this._preIdx]);
      const item = Object.assign({}, items[idx])

      items[this._preIdx].x = item.x
      items[this._preIdx].y = item.y
      items[this._preIdx].pos = item.pos
      items[idx].x = preItem.x
      items[idx].y = preItem.y
      items[idx].pos = preItem.pos

      const tmp = this._itemsIdx[pos];
      this._itemsIdx[pos] = this._itemsIdx[this._prePos];
      this._itemsIdx[this._prePos] = tmp;
      this.setData({
        items,
        curIdx: -1
      }, ()=>{
        const idxs = this.getHorizontalIdx().concat(this.getVerticalIdx());
        if (idxs.length > 0) {
          this._preIdx = undefined
          this._prePos = undefined
          this.updateItems(idxs);
        } else {
          this.stRe = setTimeout(()=>{
            items[this._preIdx] = preItem
            items[idx] = item
      
            const rePos = this._itemsIdx[pos]
            this._itemsIdx[pos] = tmp;
            this._itemsIdx[this._prePos] = rePos;
            this._lock = ''
            this._preIdx = undefined
            this._prePos = undefined
            return this.setData({
              items
            });
          }, 300)
        }
      });
    }
  },

  makeMatrix(items){
    this._matrix = Array(MaxY).fill().map(() => Array(MaxX).fill(0));
    this._idxArr = []
    items.forEach((it, idx) => {
      this._matrix[~~(idx / MaxX)][idx % MaxX] = idx;
      this._idxArr.push(idx);
    });
  },

  updateItems(idxs){
    if (idxs.length === 0 || this._stc) return;
    this._lock = true
    this._stc = setTimeout(() => {
      this._stc = ''
      const {items: itemsOri} = this.data;
      for(let i of idxs) {
        const oi = this._itemsIdx[i]
        if (oi > itemsOri.length) continue;
        this._itemsIdx[i] = oi + 1000;
        itemsOri[oi].clips = this.randomClip(itemsOri[oi])
        itemsOri[oi].on = false;
        itemsOri[oi].y = itemsOri[oi].y - 700;
        itemsOri[oi].noAni = true;
      };

      // 剩余方块下落的逻辑
      const size = this._itemsIdx.length
      let i = size - 1
      while (i > -1) {
        let upIdx = i
        while (this._itemsIdx[i] > size && upIdx > -1) {
          upIdx -= MaxX
          if (this._itemsIdx[upIdx] < size) {
            let tmp = this._itemsIdx[upIdx]
            this._itemsIdx[upIdx] = this._itemsIdx[i]
            this._itemsIdx[i] = tmp
          }
        }
        i--
      }

      this._itemsIdx.forEach((it, idx)=>{
        const ix = ~~(idx % MaxX)
        const iy = ~~(idx / MaxX)
        if (it < size) {
          if (itemsOri[it].pos !== idx) {
            itemsOri[it].x = ix * Size + (ix + 1) * 6
            itemsOri[it].y = iy * Size + (iy + 1) * 6
            itemsOri[it].pos = idx
          }
        }
      })
      this.setData({
        items: itemsOri
      })
      this._stb = setTimeout(()=>{
        this._stb = ''
        this._itemsIdx.forEach((it, idx)=>{
          const ix = ~~(idx % MaxX)
          const iy = ~~(idx / MaxX)
          if (it > size) {
            const name = [].concat(Paths).shuffle().pop()
            const dx = it - 1000
            itemsOri[dx].noAni = false
            itemsOri[dx].x = ix * Size + (ix + 1) * 6
            itemsOri[dx].y = iy * Size + (iy + 1) * 6
            itemsOri[dx].pos = idx
            itemsOri[dx].on = true
            itemsOri[dx].value = ~~name
            itemsOri[dx].path = `../../images/${name}.jpg`
            this._itemsIdx[idx] = dx
          }
        })
        this.setData({
          items: itemsOri
        })
        
        if (this._sta) clearTimeout(this._sta);
        this._sta = setTimeout(()=>{
          this._sta = ''
          this._lock = ''
          const idxs = this.getHorizontalIdx().concat(this.getVerticalIdx());
          if (idxs.length > 0) {
            this.updateItems(idxs);
          } else {
            itemsOri.forEach(it=>{
              delete it.clips
            });
            console.log(...itemsOri)
            this.setData({
              items: itemsOri
            })
          }
        }, 300)

      }, 200)

    }, 200)
  },

  getHorizontalIdx(){
    const {items} = this.data;
    let idxs = []
    let tmp = []
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
    return idxs;
  },

  getVerticalIdx() {
    const {items} = this.data;
    let idxs = [];
    for (let i=0; i < MaxX; i++) {
      let tmp = []
      let vi = i
      let it = this._itemsIdx[i]
      let prePos = 0
      while(vi < items.length) {
        if (vi < MaxX) {
          tmp = [vi]
          prePos = it
        } else if (items[it] !== undefined && items[prePos] !== undefined && items[it].value === items[prePos].value) {
          tmp.push(vi)
        } else {
          if (tmp.length > 2) {
            idxs = idxs.concat(tmp)
          }
          tmp = [vi]
          prePos = it
        }
        vi += MaxX;
        it = this._itemsIdx[vi]
      }
      if (vi > this._itemsIdx.length - 1) {
        if (tmp.length > 2) {
          idxs = idxs.concat(tmp)
        }
      }
    }
    return idxs;
  },

  checkCrush() {

  },

  nearBy(posA, posB){
    if (posA === undefined || posB === undefined) return false;
    return Math.abs(posA - posB) === 1 || Math.abs(posB - posA) === MaxX;
  },

  randomClip(item){
    return this.randomTri(0, 0, Size, item)
  },

  randomTri(a, b, s, item){
    const {path, x, y} = item;
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
    // return [
    //     {path,x,y, cp: `polygon(${p1}, ${p2}, ${p4})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    //     {path,x,y, cp: `polygon(${p2}, ${p3}, ${p5})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    //     {path,x,y, cp: `polygon(${p4}, ${p6}, ${p7})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    //     {path,x,y, cp: `polygon(${p7}, ${p8}, ${p5})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    //     {path,x,y, cp: `polygon(${pc}, ${p2}, ${p4})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    //     {path,x,y, cp: `polygon(${pc}, ${p2}, ${p5})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    //     {path,x,y, cp: `polygon(${pc}, ${p5}, ${p7})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    //     {path,x,y, cp: `polygon(${pc}, ${p4}, ${p7})`, ani: `bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.6}s ease-in`},
    // ]
    return [
        {path, css: `clip-path:polygon(${p1}, ${p2}, ${p4});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
        {path, css: `clip-path:polygon(${p2}, ${p3}, ${p5});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
        {path, css: `clip-path:polygon(${p4}, ${p6}, ${p7});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
        {path, css: `clip-path:polygon(${p7}, ${p8}, ${p5});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
        {path, css: `clip-path:polygon(${pc}, ${p2}, ${p4});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
        {path, css: `clip-path:polygon(${pc}, ${p2}, ${p5});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
        {path, css: `clip-path:polygon(${pc}, ${p5}, ${p7});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
        {path, css: `clip-path:polygon(${pc}, ${p4}, ${p7});left:${x}rpx;top:${y}rpx;animation: bout-${~~(Math.random() * 2)} ${0.2+Math.random() * 0.3}s ease-in;animation-fill-mode: forwards;`},
    ]
  },

})