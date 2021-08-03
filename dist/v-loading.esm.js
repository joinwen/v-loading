const setStyle = (ele, obj) => {
  for (const key of Object.keys(obj)) {
    let value = `${obj[key]}`,
      type = "style";
    if(key === "text")
      type = "innerText";
    if(key === "html")
      type = "innerHTML";
    if(typeof ele[type] === "object")
      ele[type][key] = value;
    else
      ele[type] = value;
  }
};

const clearBorder = (ele, data, duration = 600) => {
  setStyle(ele, {
    "borderBottom": "0 solid transparent",
    "transition": `border-bottom ${duration}ms`
  });
  setTimeout(() => {
    setStyle(ele, {
      "transition": "none"
    });
    (data) && (data.phase = -1);
  }, duration);
};

const clearHeight = (ele, data, duration = 600) => {
  setStyle(ele, {
    height: "0",
    transition: `height ${duration}ms`
  });
  setTimeout(() => {
    setStyle(ele, {
      "transition": "none"
    });
    (data) && (data.phase = -1);
  }, duration);
};

const setBorder = (ele, obj, color = "#f0f0f0") => {
  let { y, bg } = obj;
  bg = bg || color;
  setStyle(ele, {
    "borderBottom": `${y}px solid ${bg}`,
    transition: "none",
  });
};

const setHeight = (ele, obj, color ="#f0f0f0") => {
  let { y, bg } = obj;
  bg = bg || color;
  setStyle(ele, {
    height: `${y}px`,
    background: bg,
    transition: "none"
  });
};

const defaultOptions = {
  time: 300,
  max: 80,
  bottomHeight: 32,
  bg: "#f0f0f0",
  t_cb: () => {},
  b_cb: () => {},
  t_stage1Begin: (ele, obj) => {
    // eslint-disable-next-line no-unused-vars
    let { y, bg } = obj;
    setStyle(ele, {
      text: "下拉刷新",
      color: "#67c23a",
      textAlign: "center",
      lineHeight: `${y}px`
    });
  },
  // eslint-disable-next-line no-unused-vars
  t_stage2Begin: (ele, obj) => {
    setStyle(ele, {
      text: "松开刷新"
    });
  },
  t_stage1End: (ele, flag) => {
    if(flag) {
      setStyle(ele, {
        text: "刷新成功"
      });
    } else {
      setStyle(ele,{
        text: "刷新失败",
        color: "#f56c6c"
      });
    }
  },
  t_stage1QuickEnd: (ele) => {},
  t_stage2End: (ele) => {
    setStyle(ele, {
      text: "刷新中..."
    });
  },
  b_stage1Begin: (ele, y) => {
    setStyle(ele, {
      lineHeight: `${y}px`,
      height: `${y}px`,
      textAlign: "center",
      visibility: "hidden",
    });
  },
  b_stage2Begin: (ele) => {
    setStyle(ele, {
      text: "上拉加载",
      visibility: "visible"
    });
  },
  b_stage1End: (ele) => {
    setStyle(ele, {
      text: "加载中..."
    });
  },
  b_stage2End: (ele, flag) => {
    if(flag) {
      setStyle(ele, {
        text: "加载成功",
      });
    } else {
      setStyle(ele, {
        text: "加载失败"
      });
    }
  },
  duration: 250,
};

const updateDataInStart = (data, e, options) => {
  let ele = options.ele,
    bottomHeight = options.bottomHeight,
    [top, bottom] = topAndBottom(ele, bottomHeight);
  if(data.phase === -1 && (top || bottom)) {
    data.start = e.touches[0].pageY;
    data.phase = 0;
    data.top = top;
    data.bottom = bottom;
  }
};
const updateDataInMove = (data, e, options) => {
  let move = e.touches[0].pageY,
    start = data.start,
    ele = options.ele,
    bottomHeight = options.bottomHeight,
    [top, bottom] = topAndBottom(ele, bottomHeight),
    y = move - start,
    positive = y >= 0,
    negative = y <= 0;
  if(data.phase === 0 || data.phase === 1) {
    if(top && positive || bottom && negative) {
      data.phase = 1;
      data.y = y;
      data.positive = positive;
      data.negative = negative;
      data.top = top;
      data.bottom = bottom;
    }
  }
};

const updateDataInCancel = (data, e, options) => {
  let ele = options.ele,
    bottomHeight = options.bottomHeight,
    [top, bottom ] = topAndBottom(ele, bottomHeight);
  data.top = top;
  data.bottom = bottom;
};

const topAndBottom = (ele, bottomHeight) => {
  return [
    ele.scrollTop === 0,
    ele.scrollTop + ele.clientHeight >= (ele.scrollHeight - bottomHeight)
  ];
};

class VLoading {
  constructor(ele, options) {
    this.ele = ele;
    this.options = Object.assign(defaultOptions, options, { ele });
    this.data = {
      top: false,     // 是否触顶
      bottom: false,  // 是否触底
      y: 0,           // 路程位移
      start: 0,       // 起点位移
      phase: -1,      // 0:touchstart, 1:touchmove, 2:touchend/cancel, -1, no events
    };
    this.insertTopLoading();
    this.insertBottomLoading();
    this.init();
  }
  insertTopLoading() {
    const loading = this.options.topLoading;
    if(loading)
      return;
    let firstNode = this.ele.firstElementChild,
      div = document.createElement("div");
    setStyle(div, {
      overflow: "hidden"
    });
    this.ele.insertBefore(div, firstNode);
    this.options.topLoading = div;
  }
  insertBottomLoading() {
    const bottomLoading = this.options.bottomLoading,
      bottomHeight = this.options.bottomHeight,
      b_stage1Begin = this.options.b_stage1Begin;
    if(bottomLoading)
      return;
    let lastNode = this.ele.lastElementChild,
      div = document.createElement("div");
    this.ele.insertBefore(div, lastNode.nextSibling);
    this.options.bottomLoading = div;
    b_stage1Begin(div, bottomHeight);
  }
  init() {
    let ele = this.ele,
      data = this.data,
      topLoading = this.options.topLoading,
      bottomLoading = this.options.bottomLoading,
      t_cb = this.options.t_cb,
      b_cb = this.options.b_cb,
      max = this.options.max,
      bg = this.options.bg,
      time = this.options.time,
      duration = this.options.duration,
      t_stage1Begin = this.options.t_stage1Begin,
      t_stage2Begin = this.options.t_stage2Begin,
      t_stage1End = this.options.t_stage1End,
      t_stage1QuickEnd = this.options.t_stage1QuickEnd,
      t_stage2End = this.options.t_stage2End,
      b_stage2Begin = this.options.b_stage2Begin,
      b_stage1End = this.options.b_stage1End,
      b_stage2End = this.options.b_stage2End;
    window.data = data;
    ele.addEventListener("touchstart", (e) => {
      updateDataInStart(data, e, this.options);
    });

    ele.addEventListener("touchmove", (e) => {
      updateDataInMove(data, e, this.options);
      if(data.phase === 0)
        return;
      if(data.phase === -1) {
        return;
      }
      if(data.phase === 2) {
        e.preventDefault();
        return;
      }
      if(data.top) {
        e.preventDefault();
        let y = data.y;

        if(y >= max) {
          y = (y - max) / 2;
          setBorder(topLoading, { y, bg });
          t_stage2Begin(topLoading, { y, bg });
        } else {
          setHeight(topLoading, { y, bg });
          t_stage1Begin(topLoading, { y, bg });
        }
      }
      if(data.bottom) {
        e.preventDefault();
        b_stage2Begin(bottomLoading);
      }
    }, {passive: false});
    ele.addEventListener("touchend", (e) => {
      updateDataInCancel(data, e, this.options);
      if(data.phase === 0) {
        data.phase = -1;
        return;
      }
      if(data.phase === 1) {
        data.phase = 2;
        if(data.top) {
          let y = data.y;
          if(y > max) {
            clearBorder(topLoading,null, duration);
            t_stage2End(topLoading);
            t_cb(
              (flag) => {
                t_stage1End(topLoading,flag);
                setTimeout(() => {
                  clearHeight(topLoading, data, duration);
                }, time);
              }
            );
          } else {
            t_stage1QuickEnd(topLoading);
            clearBorder(topLoading, data, duration);
            clearHeight(topLoading, data, duration);
          }
        }
        if(data.bottom) {
          b_stage1End(bottomLoading);
          b_cb((flag) => {
            b_stage2End(bottomLoading, flag);
            if(flag) {
              setTimeout(() => {
                setStyle(bottomLoading, {
                  visibility: "hidden"
                });
              }, time);
            }
            data.phase = -1;
          });
        }
      }
    });
    ele.addEventListener("touchcancel", (e) => {
    });
  }
}

export default VLoading;
