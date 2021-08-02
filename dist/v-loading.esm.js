const setStyle = (ele, obj) => {
  for (const key of Object.keys(obj)) {
    ele.style[key] = `${obj[key]}`;
  }
};
const getStyle = (ele, attr) => {
  return document.defaultView.getComputedStyle(ele)[attr];
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
  let color = getStyle(ele, "backgroundColor");
  setStyle(ele, {
    height: "0",
    background: color,
    transition: `height ${duration}ms`
  });
  setTimeout(() => {
    setStyle(ele, {
      "transition": "none"
    });
    (data) && (data.phase = -1);
  }, duration);
};

const clearLoadingImg = (ele) => {
  setStyle(ele, {
    background: "none"
  });
};

const setBorder = (ele, value, color = "#f0f0f0") => {
  setStyle(ele, {
    "borderBottom": `${value}px solid ${color}`,
    transition: "none",
  });
};

const setHeight = (ele, value, color ="#f0f0f0") => {
  setStyle(ele, {
    height: `${value}px`,
    background: color,
    transition: "none"
  });
};

const setLoadingImg = (ele, src="./loading.gif") => {
  let color = getStyle(ele, "backgroundColor");
  setStyle(ele, {
    background: `url(${src}) center/4em no-repeat ${color}`
  });
};

const defaultOptions = {
  max: 80,
  bg: "#f0f0f0",
  cb: () => {},
  stage1Begin: () => {},
  stage2Begin: (ele) => {
    setLoadingImg(ele);
  },
  stage1End: () => {},
  stage2End: () => {
    clearLoadingImg(ele);
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
    this.ele.insertBefore(div, firstNode);
    this.options.topLoading = div;
  }
  insertBottomLoading() {
    const bottomLoading = this.options.bottomLoading;
    if(bottomLoading)
      return;
    let lastNode = this.ele.lastElementChild,
      div = document.createElement("div");
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
      duration = this.options.duration,
      stage1Begin = this.options.stage1Begin,
      stage2Begin = this.options.stage2Begin,
      stage1End = this.options.stage1End,
      stage2End = this.options.stage1End;
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
          stage2Begin(topLoading);
          setBorder(topLoading, y, bg);
        } else {
          stage1Begin(topLoading);
          setHeight(topLoading, y, bg);
        }
      }
      if(data.bottom) {
        // e.preventDefault();
        let y = -data.y;
        if(y >= max) {
          y = (y - max) / 2;
          stage2Begin(bottomLoading);
          setBorder(bottomLoading, y, bg);
        } else {
          stage1Begin(bottomLoading);
          setHeight(bottomLoading, y, bg);
        }
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
            cb(() => {stage2End(topLoading);clearHeight(topLoading, data, duration);});
          } else {
            stage1End(topLoading);
            clearBorder(topLoading, data, duration);
            clearHeight(topLoading, data, duration);
          }
        } else {
          // if(data.bottom) {
            let y = -data.y;
            if(y > max) {
              clearBorder(bottomLoading,null, duration);
              cb(() => {stage2End(bottomLoading);clearHeight(bottomLoading, data, duration);});
            } else {
              stage1End(bottomLoading);
              clearBorder(bottomLoading, data, duration);
              clearHeight(bottomLoading, data, duration);
            }
          // }
        }
      }
    });
    ele.addEventListener("touchcancel", (e) => {
    });
  }
}

export default VLoading;
