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
  data.start = e.touches[0].pageY;
  (data.phase === -1) && (data.phase = 0);
};
const updateDataInMove = (data, e, options) => {
  let move = e.touches[0].pageY,
    start = data.start,
    ele = options.ele;
  (data.phase === 0) && (data.phase = 1);
  if(data.phase === 1) {
    data.y = move - start;
    data.positive = data.y >= 0;
    data.negative = !data.positive;
    data.top = ele.scrollTop === 0;
    data.bottom = ele.scrollTop + ele.clientHeight === ele.scrollHeight;
  }
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
    this.insertLoading();
    this.init();
  }
  insertLoading() {
    const loading = this.options.loading;
    if(loading)
      return;
    let firstNode = this.ele.firstElementChild,
      div = document.createElement("div");
    this.ele.insertBefore(div, firstNode);
    this.options.loading = div;
  }
  init() {
    let ele = this.ele,
      data = this.data,
      loading = this.options.loading,
      cb = this.options.cb,
      max = this.options.max,
      bg = this.options.bg,
      duration = this.options.duration,
      stage1Begin = this.options.stage1Begin,
      stage2Begin = this.options.stage2Begin,
      stage1End = this.options.stage1End,
      stage2End = this.options.stage1End;

    ele.addEventListener("touchstart", (e) => {
      updateDataInStart(data, e, this.options);
      // if(data.ing)
      //   return;
      // data.move = true;
      // data.start = e.touches[0].pageY;
    });
    ele.addEventListener("touchmove", (e) => {
      updateDataInMove(data, e, this.options);
      if(data.phase !== 1){
        e.preventDefault();
        return;
      }
      if(data.top) {
        if(data.positive)
          e.preventDefault();
        let y = data.y;
        if(y >= max) {
          y = (y - max) / 2;
          stage2Begin(loading);
          setBorder(loading, y, bg);
        } else {
          stage1Begin(loading);
          setHeight(loading, y, bg);
        }
      }


      // if(!data.move)
      //   return;
      // let move = e.touches[0].pageY,
      //   deltaY = move - data.start;
      // if(ele.scrollTop === 0) {
      //   if(deltaY > 0 || data.ing)
      //     e.preventDefault();
      //   let y = data.y = deltaY
      //   if(y >= max) {
      //     // y = y < (max + 100) ? (y - max) / 4 : (y-max)/2;
      //     y = (y - max) / 2;
      //     stage2Begin(loading);
      //     setBorder(loading, y, bg);
      //   } else {
      //     stage1Begin(loading);
      //     setHeight(loading, y, bg);
      //   }
      // }
    }, {passive: false});
    ele.addEventListener("touchend", (e) => {
      if(data.phase !== 1 )
        return;
      let y = data.y;
        data.phase;
      data.start = data.y = 0;
      data.phase = 2;
      if(y > max) {
        clearBorder(loading,null, duration);
        cb(() => {stage2End(loading);clearHeight(loading, data, duration);});
      } else {
        stage1End(loading);
        data.phase = -1;
        clearBorder(loading, data, duration);
        clearHeight(loading, data, duration);
      }

      // let y = data.y,
      //   move = data.move;
      // data.start = data.y = 0;
      // data.move = false;
      // if(!move)
      //   return;
      // if(y > max) {
      //   clearBorder(loading, duration);
      //   cb(() => {stage2End(loading);clearHeight(loading, duration);data.ing = false;});
      // } else {
      //   stage1End(loading);
      //   data.ing = false;
      //   clearBorder(loading, duration);
      //   clearHeight(loading, duration);
      // }
    });
    ele.addEventListener("touchcancel", (e) => {
    });
  }
}

export default VLoading;
