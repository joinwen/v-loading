const setStyle = (ele, obj) => {
  for (const key of Object.keys(obj)) {
    ele.style[key] = `${obj[key]}`;
  }
};
const getStyle = (ele, attr) => {
  return document.defaultView.getComputedStyle(ele)[attr];
};

const clearBorder = (ele, duration = 600) => {
  setStyle(ele, {
    "borderBottom": "0 solid transparent",
    "transition": `border-bottom ${duration}ms`
  });
  setTimeout(() => {
    setStyle(ele, {
      "transition": "none"
    });
  }, duration);
};

const clearHeight = (ele, duration = 600) => {
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

class VLoading {
  constructor(ele, options) {
    this.ele = ele;
    this.options = Object.assign(defaultOptions, options);
    this.data = {
      y: 0,
      start: 0,
      move: false,
      ing: false,
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
      if(data.ing)
        return;
      data.move = true;
      data.start = e.touches[0].pageY;
    });
    ele.addEventListener("touchmove", (e) => {
      if(!data.move)
        return;
      let move = e.touches[0].pageY,
        deltaY = move - data.start;
      if(ele.scrollTop === 0) {
        if(deltaY > 0 || data.ing)
          e.preventDefault();
        let y = data.y = deltaY;
        if(y >= max) {
          // y = y < (max + 100) ? (y - max) / 4 : (y-max)/2;
          y = (y - max) / 2;
          stage2Begin(loading);
          setBorder(loading, y, bg);
        } else {
          stage1Begin(loading);
          setHeight(loading, y, bg);
        }
      }
    }, {passive: false});
    ele.addEventListener("touchend", (e) => {
      let y = data.y,
        move = data.move;
      data.start = data.y = 0;
      data.move = false;
      if(!move)
        return;
      if(y > max) {
        clearBorder(loading, duration);
        cb(() => {stage2End(loading);clearHeight(loading, duration);data.ing = false;});
      } else {
        stage1End(loading);
        data.ing = false;
        clearBorder(loading, duration);
        clearHeight(loading, duration);
      }
    });
    ele.addEventListener("touchcancel", (e) => {
    });
  }
}

export default VLoading;
