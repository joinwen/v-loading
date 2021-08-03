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
  bg: "#f0f0f0",
  cb: () => {},
  stage1Begin: (ele, obj) => {
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
  stage2Begin: (ele, obj) => {
    setStyle(ele, {
      text: "松开刷新"
    });
  },
  stage1End: (ele, flag) => {
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
  stage2End: (ele) => {
    setStyle(ele, {
      text: "刷新中..."
    });
  },
  stage2: () => {},
  duration: 250,
};

const updateDataInStart = (data, e, options) => {
  let ele = options.ele,
  [top, bottom] = topAndBottom(ele);
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
    [top, bottom] = topAndBottom(ele),
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

  // (data.phase === 0) && (data.phase = 1);
  // if(data.phase === 1) {
  //   data.y = move - start;
  //   data.positive = data.y >= 0;
  //   data.negative = !data.positive;
  //   data.top = ele.scrollTop === 0;
  //   data.bottom = ele.scrollTop + ele.clientHeight === ele.scrollHeight;
  // }
};

const updateDataInCancel = (data, e, options) => {
  // if(data.top || data.bottom) {
  //   (data.phase === 1) && (data.phase = 2)
  // }
  let ele = options.ele,
    [top, bottom ] = topAndBottom(ele);
  data.top = top;
  data.bottom = bottom;
};

const topAndBottom = (ele) => {
  return [
    ele.scrollTop === 0,
    ele.scrollTop + ele.clientHeight >= ele.scrollHeight
  ]
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
    const bottomLoading = this.options.bottomLoading;
    if(bottomLoading)
      return;
    let lastNode = this.ele.lastElementChild,
      div = document.createElement("div");
    div.innerText = "上拉加载中...";
    setStyle(div, {
      lineHeight: 2,
      textAlign: "center",
      visibility: "hidden"
    });
    this.ele.insertBefore(div, lastNode.nextSibling);
    this.options.bottomLoading = div;
  }
  init() {
    let ele = this.ele,
      data = this.data,
      topLoading = this.options.topLoading,
      bottomLoading = this.options.bottomLoading,
      cb = this.options.cb,
      max = this.options.max,
      bg = this.options.bg,
      time = this.options.time,
      duration = this.options.duration,
      stage1Begin = this.options.stage1Begin,
      stage2Begin = this.options.stage2Begin,
      stage1End = this.options.stage1End,
      stage2End = this.options.stage2End;
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
          stage2Begin(topLoading, { y, bg });
        } else {
          setHeight(topLoading, { y, bg });
          stage1Begin(topLoading, { y, bg });
        }
      }
      if(data.bottom) {
        setStyle(bottomLoading, {
          visibility: "visible"
        });
      }

      // }
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
            stage2End(topLoading);
            cb(
              (flag) => {
                stage1End(topLoading,flag);
                setTimeout(() => {
                  clearHeight(topLoading, data, duration);
                }, time);
              }
            );
          } else {
            // stage1End(topLoading);
            clearBorder(topLoading, data, duration);
            clearHeight(topLoading, data, duration);
          }
        }
        if(data.bottom) {
          setStyle(bottomLoading, {
            visibility: "hidden"
          });
          data.phase = -1;
        }
      }
    });
    ele.addEventListener("touchcancel", (e) => {
    });
  }
}

export default VLoading;
