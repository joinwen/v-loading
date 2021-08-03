'use strict';

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

module.exports = VLoading;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidi1sb2FkaW5nLmNqcy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL2luZGV4LmpzIiwiLi4vc3JjL2NvcmUvZGVmYXVsdC5qcyIsIi4uL3NyYy9jb3JlL2hlbHBlcnMuanMiLCIuLi9zcmMvY29yZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzZXRTdHlsZSA9IChlbGUsIG9iaikgPT4ge1xyXG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpIHtcclxuICAgIGxldCB2YWx1ZSA9IGAke29ialtrZXldfWAsXHJcbiAgICAgIHR5cGUgPSBcInN0eWxlXCI7XHJcbiAgICBpZihrZXkgPT09IFwidGV4dFwiKVxyXG4gICAgICB0eXBlID0gXCJpbm5lclRleHRcIjtcclxuICAgIGlmKGtleSA9PT0gXCJodG1sXCIpXHJcbiAgICAgIHR5cGUgPSBcImlubmVySFRNTFwiO1xyXG4gICAgaWYodHlwZW9mIGVsZVt0eXBlXSA9PT0gXCJvYmplY3RcIilcclxuICAgICAgZWxlW3R5cGVdW2tleV0gPSB2YWx1ZTtcclxuICAgIGVsc2VcclxuICAgICAgZWxlW3R5cGVdID0gdmFsdWU7XHJcbiAgfVxyXG59O1xyXG5jb25zdCBnZXRTdHlsZSA9IChlbGUsIGF0dHIpID0+IHtcclxuICByZXR1cm4gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbGUpW2F0dHJdO1xyXG59O1xyXG5cclxuY29uc3QgY2xlYXJCb3JkZXIgPSAoZWxlLCBkYXRhLCBkdXJhdGlvbiA9IDYwMCkgPT4ge1xyXG4gIHNldFN0eWxlKGVsZSwge1xyXG4gICAgXCJib3JkZXJCb3R0b21cIjogXCIwIHNvbGlkIHRyYW5zcGFyZW50XCIsXHJcbiAgICBcInRyYW5zaXRpb25cIjogYGJvcmRlci1ib3R0b20gJHtkdXJhdGlvbn1tc2BcclxuICB9KTtcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIHNldFN0eWxlKGVsZSwge1xyXG4gICAgICBcInRyYW5zaXRpb25cIjogXCJub25lXCJcclxuICAgIH0pO1xyXG4gICAgKGRhdGEpICYmIChkYXRhLnBoYXNlID0gLTEpO1xyXG4gIH0sIGR1cmF0aW9uKTtcclxufTtcclxuXHJcbmNvbnN0IGNsZWFySGVpZ2h0ID0gKGVsZSwgZGF0YSwgZHVyYXRpb24gPSA2MDApID0+IHtcclxuICBzZXRTdHlsZShlbGUsIHtcclxuICAgIGhlaWdodDogXCIwXCIsXHJcbiAgICB0cmFuc2l0aW9uOiBgaGVpZ2h0ICR7ZHVyYXRpb259bXNgXHJcbiAgfSk7XHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBzZXRTdHlsZShlbGUsIHtcclxuICAgICAgXCJ0cmFuc2l0aW9uXCI6IFwibm9uZVwiXHJcbiAgICB9KTtcclxuICAgIChkYXRhKSAmJiAoZGF0YS5waGFzZSA9IC0xKTtcclxuICB9LCBkdXJhdGlvbik7XHJcbn07XHJcblxyXG5jb25zdCBjbGVhckxvYWRpbmdJbWcgPSAoZWxlKSA9PiB7XHJcbiAgc2V0U3R5bGUoZWxlLCB7XHJcbiAgICBiYWNrZ3JvdW5kOiBcIm5vbmVcIlxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0Qm9yZGVyID0gKGVsZSwgb2JqLCBjb2xvciA9IFwiI2YwZjBmMFwiKSA9PiB7XHJcbiAgbGV0IHsgeSwgYmcgfSA9IG9iajtcclxuICBiZyA9IGJnIHx8IGNvbG9yO1xyXG4gIHNldFN0eWxlKGVsZSwge1xyXG4gICAgXCJib3JkZXJCb3R0b21cIjogYCR7eX1weCBzb2xpZCAke2JnfWAsXHJcbiAgICB0cmFuc2l0aW9uOiBcIm5vbmVcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IHNldEhlaWdodCA9IChlbGUsIG9iaiwgY29sb3IgPVwiI2YwZjBmMFwiKSA9PiB7XHJcbiAgbGV0IHsgeSwgYmcgfSA9IG9iajtcclxuICBiZyA9IGJnIHx8IGNvbG9yO1xyXG4gIHNldFN0eWxlKGVsZSwge1xyXG4gICAgaGVpZ2h0OiBgJHt5fXB4YCxcclxuICAgIGJhY2tncm91bmQ6IGJnLFxyXG4gICAgdHJhbnNpdGlvbjogXCJub25lXCJcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IHNldExvYWRpbmdJbWcgPSAoZWxlLCBzcmM9XCIuL2xvYWRpbmcuZ2lmXCIpID0+IHtcclxuICBsZXQgY29sb3IgPSBnZXRTdHlsZShlbGUsIFwiYmFja2dyb3VuZENvbG9yXCIpO1xyXG4gIHNldFN0eWxlKGVsZSwge1xyXG4gICAgYmFja2dyb3VuZDogYHVybCgke3NyY30pIGNlbnRlci80ZW0gbm8tcmVwZWF0ICR7Y29sb3J9YFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZGFtcCA9ICh4LCBtYXgpID0+IHtcclxuICBsZXQgdW5pdCA9ICh4KSA9PiB7XHJcbiAgICByZXR1cm4gTWF0aC5hdGFuKHgpIC8gKE1hdGguUEkgLyAyKTtcclxuICB9O1xyXG4gIGxldCBjb250cmFjdGlvbiA9ICh4LCBtYXgpID0+IHtcclxuICAgIHJldHVybiB4IC8gbWF4O1xyXG4gIH07XHJcbiAgcmV0dXJuIHVuaXQoY29udHJhY3Rpb24oeCwgbWF4KSkgKiBtYXg7XHJcbn07XHJcbmV4cG9ydCB7XHJcbiAgc2V0U3R5bGUsXHJcbiAgc2V0SGVpZ2h0LFxyXG4gIHNldEJvcmRlcixcclxuICBjbGVhckhlaWdodCxcclxuICBjbGVhckJvcmRlcixcclxuICBkYW1wLFxyXG4gIHNldExvYWRpbmdJbWcsXHJcbiAgY2xlYXJMb2FkaW5nSW1nXHJcbn07XHJcbiIsImltcG9ydCB7IHNldFN0eWxlfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIHRpbWU6IDMwMCxcclxuICBtYXg6IDgwLFxyXG4gIGJvdHRvbUhlaWdodDogMzIsXHJcbiAgYmc6IFwiI2YwZjBmMFwiLFxyXG4gIHRfY2I6ICgpID0+IHt9LFxyXG4gIGJfY2I6ICgpID0+IHt9LFxyXG4gIHRfc3RhZ2UxQmVnaW46IChlbGUsIG9iaikgPT4ge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXHJcbiAgICBsZXQgeyB5LCBiZyB9ID0gb2JqO1xyXG4gICAgc2V0U3R5bGUoZWxlLCB7XHJcbiAgICAgIHRleHQ6IFwi5LiL5ouJ5Yi35pawXCIsXHJcbiAgICAgIGNvbG9yOiBcIiM2N2MyM2FcIixcclxuICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICBsaW5lSGVpZ2h0OiBgJHt5fXB4YFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICB0X3N0YWdlMkJlZ2luOiAoZWxlLCBvYmopID0+IHtcclxuICAgIHNldFN0eWxlKGVsZSwge1xyXG4gICAgICB0ZXh0OiBcIuadvuW8gOWIt+aWsFwiXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHRfc3RhZ2UxRW5kOiAoZWxlLCBmbGFnKSA9PiB7XHJcbiAgICBpZihmbGFnKSB7XHJcbiAgICAgIHNldFN0eWxlKGVsZSwge1xyXG4gICAgICAgIHRleHQ6IFwi5Yi35paw5oiQ5YqfXCJcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZXRTdHlsZShlbGUse1xyXG4gICAgICAgIHRleHQ6IFwi5Yi35paw5aSx6LSlXCIsXHJcbiAgICAgICAgY29sb3I6IFwiI2Y1NmM2Y1wiXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgdF9zdGFnZTFRdWlja0VuZDogKGVsZSkgPT4ge30sXHJcbiAgdF9zdGFnZTJFbmQ6IChlbGUpID0+IHtcclxuICAgIHNldFN0eWxlKGVsZSwge1xyXG4gICAgICB0ZXh0OiBcIuWIt+aWsOS4rS4uLlwiXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGJfc3RhZ2UxQmVnaW46IChlbGUsIHkpID0+IHtcclxuICAgIHNldFN0eWxlKGVsZSwge1xyXG4gICAgICBsaW5lSGVpZ2h0OiBgJHt5fXB4YCxcclxuICAgICAgaGVpZ2h0OiBgJHt5fXB4YCxcclxuICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICB2aXNpYmlsaXR5OiBcImhpZGRlblwiLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBiX3N0YWdlMkJlZ2luOiAoZWxlKSA9PiB7XHJcbiAgICBzZXRTdHlsZShlbGUsIHtcclxuICAgICAgdGV4dDogXCLkuIrmi4nliqDovb1cIixcclxuICAgICAgdmlzaWJpbGl0eTogXCJ2aXNpYmxlXCJcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgYl9zdGFnZTFFbmQ6IChlbGUpID0+IHtcclxuICAgIHNldFN0eWxlKGVsZSwge1xyXG4gICAgICB0ZXh0OiBcIuWKoOi9veS4rS4uLlwiXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGJfc3RhZ2UyRW5kOiAoZWxlLCBmbGFnKSA9PiB7XHJcbiAgICBpZihmbGFnKSB7XHJcbiAgICAgIHNldFN0eWxlKGVsZSwge1xyXG4gICAgICAgIHRleHQ6IFwi5Yqg6L295oiQ5YqfXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0U3R5bGUoZWxlLCB7XHJcbiAgICAgICAgdGV4dDogXCLliqDovb3lpLHotKVcIlxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIGR1cmF0aW9uOiAyNTAsXHJcbn07XHJcbmV4cG9ydCB7XHJcbiAgZGVmYXVsdE9wdGlvbnNcclxufTtcclxuIiwiY29uc3QgdXBkYXRlRGF0YUluU3RhcnQgPSAoZGF0YSwgZSwgb3B0aW9ucykgPT4ge1xyXG4gIGxldCBlbGUgPSBvcHRpb25zLmVsZSxcclxuICAgIGJvdHRvbUhlaWdodCA9IG9wdGlvbnMuYm90dG9tSGVpZ2h0LFxyXG4gICAgW3RvcCwgYm90dG9tXSA9IHRvcEFuZEJvdHRvbShlbGUsIGJvdHRvbUhlaWdodCk7XHJcbiAgaWYoZGF0YS5waGFzZSA9PT0gLTEgJiYgKHRvcCB8fCBib3R0b20pKSB7XHJcbiAgICBkYXRhLnN0YXJ0ID0gZS50b3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgZGF0YS5waGFzZSA9IDA7XHJcbiAgICBkYXRhLnRvcCA9IHRvcDtcclxuICAgIGRhdGEuYm90dG9tID0gYm90dG9tO1xyXG4gIH1cclxufTtcclxuY29uc3QgdXBkYXRlRGF0YUluTW92ZSA9IChkYXRhLCBlLCBvcHRpb25zKSA9PiB7XHJcbiAgbGV0IG1vdmUgPSBlLnRvdWNoZXNbMF0ucGFnZVksXHJcbiAgICBzdGFydCA9IGRhdGEuc3RhcnQsXHJcbiAgICBlbGUgPSBvcHRpb25zLmVsZSxcclxuICAgIGJvdHRvbUhlaWdodCA9IG9wdGlvbnMuYm90dG9tSGVpZ2h0LFxyXG4gICAgW3RvcCwgYm90dG9tXSA9IHRvcEFuZEJvdHRvbShlbGUsIGJvdHRvbUhlaWdodCksXHJcbiAgICB5ID0gbW92ZSAtIHN0YXJ0LFxyXG4gICAgcG9zaXRpdmUgPSB5ID49IDAsXHJcbiAgICBuZWdhdGl2ZSA9IHkgPD0gMDtcclxuICBpZihkYXRhLnBoYXNlID09PSAwIHx8IGRhdGEucGhhc2UgPT09IDEpIHtcclxuICAgIGlmKHRvcCAmJiBwb3NpdGl2ZSB8fCBib3R0b20gJiYgbmVnYXRpdmUpIHtcclxuICAgICAgZGF0YS5waGFzZSA9IDE7XHJcbiAgICAgIGRhdGEueSA9IHk7XHJcbiAgICAgIGRhdGEucG9zaXRpdmUgPSBwb3NpdGl2ZTtcclxuICAgICAgZGF0YS5uZWdhdGl2ZSA9IG5lZ2F0aXZlO1xyXG4gICAgICBkYXRhLnRvcCA9IHRvcDtcclxuICAgICAgZGF0YS5ib3R0b20gPSBib3R0b207XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgdXBkYXRlRGF0YUluQ2FuY2VsID0gKGRhdGEsIGUsIG9wdGlvbnMpID0+IHtcclxuICBsZXQgZWxlID0gb3B0aW9ucy5lbGUsXHJcbiAgICBib3R0b21IZWlnaHQgPSBvcHRpb25zLmJvdHRvbUhlaWdodCxcclxuICAgIFt0b3AsIGJvdHRvbSBdID0gdG9wQW5kQm90dG9tKGVsZSwgYm90dG9tSGVpZ2h0KTtcclxuICBkYXRhLnRvcCA9IHRvcDtcclxuICBkYXRhLmJvdHRvbSA9IGJvdHRvbTtcclxufTtcclxuXHJcbmNvbnN0IHRvcEFuZEJvdHRvbSA9IChlbGUsIGJvdHRvbUhlaWdodCkgPT4ge1xyXG4gIHJldHVybiBbXHJcbiAgICBlbGUuc2Nyb2xsVG9wID09PSAwLFxyXG4gICAgZWxlLnNjcm9sbFRvcCArIGVsZS5jbGllbnRIZWlnaHQgPj0gKGVsZS5zY3JvbGxIZWlnaHQgLSBib3R0b21IZWlnaHQpXHJcbiAgXTtcclxufTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgdXBkYXRlRGF0YUluU3RhcnQsXHJcbiAgdXBkYXRlRGF0YUluTW92ZSxcclxuICB1cGRhdGVEYXRhSW5DYW5jZWxcclxufTtcclxuIiwiaW1wb3J0IHtkZWZhdWx0T3B0aW9uc30gZnJvbSBcIi4vZGVmYXVsdFwiO1xyXG5pbXBvcnQge1xyXG4gIGNsZWFyQm9yZGVyLFxyXG4gIGNsZWFySGVpZ2h0LFxyXG4gIHNldEJvcmRlcixcclxuICBzZXRIZWlnaHQsXHJcbiAgc2V0U3R5bGVcclxufSBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IHtcclxuICB1cGRhdGVEYXRhSW5TdGFydCxcclxuICB1cGRhdGVEYXRhSW5Nb3ZlLFxyXG4gIHVwZGF0ZURhdGFJbkNhbmNlbFxyXG59IGZyb20gXCIuL2hlbHBlcnNcIjtcclxuXHJcbmNsYXNzIFZMb2FkaW5nIHtcclxuICBjb25zdHJ1Y3RvcihlbGUsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZWxlID0gZWxlO1xyXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucywgeyBlbGUgfSk7XHJcbiAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgIHRvcDogZmFsc2UsICAgICAvLyDmmK/lkKbop6bpobZcclxuICAgICAgYm90dG9tOiBmYWxzZSwgIC8vIOaYr+WQpuinpuW6lVxyXG4gICAgICB5OiAwLCAgICAgICAgICAgLy8g6Lev56iL5L2N56e7XHJcbiAgICAgIHN0YXJ0OiAwLCAgICAgICAvLyDotbfngrnkvY3np7tcclxuICAgICAgcGhhc2U6IC0xLCAgICAgIC8vIDA6dG91Y2hzdGFydCwgMTp0b3VjaG1vdmUsIDI6dG91Y2hlbmQvY2FuY2VsLCAtMSwgbm8gZXZlbnRzXHJcbiAgICB9O1xyXG4gICAgdGhpcy5pbnNlcnRUb3BMb2FkaW5nKCk7XHJcbiAgICB0aGlzLmluc2VydEJvdHRvbUxvYWRpbmcoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuICBpbnNlcnRUb3BMb2FkaW5nKCkge1xyXG4gICAgY29uc3QgbG9hZGluZyA9IHRoaXMub3B0aW9ucy50b3BMb2FkaW5nO1xyXG4gICAgaWYobG9hZGluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgbGV0IGZpcnN0Tm9kZSA9IHRoaXMuZWxlLmZpcnN0RWxlbWVudENoaWxkLFxyXG4gICAgICBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc2V0U3R5bGUoZGl2LCB7XHJcbiAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWxlLmluc2VydEJlZm9yZShkaXYsIGZpcnN0Tm9kZSk7XHJcbiAgICB0aGlzLm9wdGlvbnMudG9wTG9hZGluZyA9IGRpdjtcclxuICB9XHJcbiAgaW5zZXJ0Qm90dG9tTG9hZGluZygpIHtcclxuICAgIGNvbnN0IGJvdHRvbUxvYWRpbmcgPSB0aGlzLm9wdGlvbnMuYm90dG9tTG9hZGluZyxcclxuICAgICAgYm90dG9tSGVpZ2h0ID0gdGhpcy5vcHRpb25zLmJvdHRvbUhlaWdodCxcclxuICAgICAgYl9zdGFnZTFCZWdpbiA9IHRoaXMub3B0aW9ucy5iX3N0YWdlMUJlZ2luO1xyXG4gICAgaWYoYm90dG9tTG9hZGluZylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgbGV0IGxhc3ROb2RlID0gdGhpcy5lbGUubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuZWxlLmluc2VydEJlZm9yZShkaXYsIGxhc3ROb2RlLm5leHRTaWJsaW5nKTtcclxuICAgIHRoaXMub3B0aW9ucy5ib3R0b21Mb2FkaW5nID0gZGl2O1xyXG4gICAgYl9zdGFnZTFCZWdpbihkaXYsIGJvdHRvbUhlaWdodCk7XHJcbiAgfVxyXG4gIGluaXQoKSB7XHJcbiAgICBsZXQgZWxlID0gdGhpcy5lbGUsXHJcbiAgICAgIGRhdGEgPSB0aGlzLmRhdGEsXHJcbiAgICAgIHRvcExvYWRpbmcgPSB0aGlzLm9wdGlvbnMudG9wTG9hZGluZyxcclxuICAgICAgYm90dG9tTG9hZGluZyA9IHRoaXMub3B0aW9ucy5ib3R0b21Mb2FkaW5nLFxyXG4gICAgICB0X2NiID0gdGhpcy5vcHRpb25zLnRfY2IsXHJcbiAgICAgIGJfY2IgPSB0aGlzLm9wdGlvbnMuYl9jYixcclxuICAgICAgbWF4ID0gdGhpcy5vcHRpb25zLm1heCxcclxuICAgICAgYmcgPSB0aGlzLm9wdGlvbnMuYmcsXHJcbiAgICAgIHRpbWUgPSB0aGlzLm9wdGlvbnMudGltZSxcclxuICAgICAgZHVyYXRpb24gPSB0aGlzLm9wdGlvbnMuZHVyYXRpb24sXHJcbiAgICAgIHRfc3RhZ2UxQmVnaW4gPSB0aGlzLm9wdGlvbnMudF9zdGFnZTFCZWdpbixcclxuICAgICAgdF9zdGFnZTJCZWdpbiA9IHRoaXMub3B0aW9ucy50X3N0YWdlMkJlZ2luLFxyXG4gICAgICB0X3N0YWdlMUVuZCA9IHRoaXMub3B0aW9ucy50X3N0YWdlMUVuZCxcclxuICAgICAgdF9zdGFnZTFRdWlja0VuZCA9IHRoaXMub3B0aW9ucy50X3N0YWdlMVF1aWNrRW5kLFxyXG4gICAgICB0X3N0YWdlMkVuZCA9IHRoaXMub3B0aW9ucy50X3N0YWdlMkVuZCxcclxuICAgICAgYl9zdGFnZTJCZWdpbiA9IHRoaXMub3B0aW9ucy5iX3N0YWdlMkJlZ2luLFxyXG4gICAgICBiX3N0YWdlMUVuZCA9IHRoaXMub3B0aW9ucy5iX3N0YWdlMUVuZCxcclxuICAgICAgYl9zdGFnZTJFbmQgPSB0aGlzLm9wdGlvbnMuYl9zdGFnZTJFbmQ7XHJcbiAgICB3aW5kb3cuZGF0YSA9IGRhdGE7XHJcbiAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+IHtcclxuICAgICAgdXBkYXRlRGF0YUluU3RhcnQoZGF0YSwgZSwgdGhpcy5vcHRpb25zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIChlKSA9PiB7XHJcbiAgICAgIHVwZGF0ZURhdGFJbk1vdmUoZGF0YSwgZSwgdGhpcy5vcHRpb25zKTtcclxuICAgICAgaWYoZGF0YS5waGFzZSA9PT0gMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGlmKGRhdGEucGhhc2UgPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGRhdGEucGhhc2UgPT09IDIpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGRhdGEudG9wKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxldCB5ID0gZGF0YS55O1xyXG5cclxuICAgICAgICBpZih5ID49IG1heCkge1xyXG4gICAgICAgICAgeSA9ICh5IC0gbWF4KSAvIDI7XHJcbiAgICAgICAgICBzZXRCb3JkZXIodG9wTG9hZGluZywgeyB5LCBiZyB9KTtcclxuICAgICAgICAgIHRfc3RhZ2UyQmVnaW4odG9wTG9hZGluZywgeyB5LCBiZyB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2V0SGVpZ2h0KHRvcExvYWRpbmcsIHsgeSwgYmcgfSk7XHJcbiAgICAgICAgICB0X3N0YWdlMUJlZ2luKHRvcExvYWRpbmcsIHsgeSwgYmcgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmKGRhdGEuYm90dG9tKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGJfc3RhZ2UyQmVnaW4oYm90dG9tTG9hZGluZyk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtwYXNzaXZlOiBmYWxzZX0pO1xyXG4gICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZSkgPT4ge1xyXG4gICAgICB1cGRhdGVEYXRhSW5DYW5jZWwoZGF0YSwgZSwgdGhpcy5vcHRpb25zKTtcclxuICAgICAgaWYoZGF0YS5waGFzZSA9PT0gMCkge1xyXG4gICAgICAgIGRhdGEucGhhc2UgPSAtMTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYoZGF0YS5waGFzZSA9PT0gMSkge1xyXG4gICAgICAgIGRhdGEucGhhc2UgPSAyO1xyXG4gICAgICAgIGlmKGRhdGEudG9wKSB7XHJcbiAgICAgICAgICBsZXQgeSA9IGRhdGEueTtcclxuICAgICAgICAgIGlmKHkgPiBtYXgpIHtcclxuICAgICAgICAgICAgY2xlYXJCb3JkZXIodG9wTG9hZGluZyxudWxsLCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgIHRfc3RhZ2UyRW5kKHRvcExvYWRpbmcpO1xyXG4gICAgICAgICAgICB0X2NiKFxyXG4gICAgICAgICAgICAgIChmbGFnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0X3N0YWdlMUVuZCh0b3BMb2FkaW5nLGZsYWcpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNsZWFySGVpZ2h0KHRvcExvYWRpbmcsIGRhdGEsIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH0sIHRpbWUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRfc3RhZ2UxUXVpY2tFbmQodG9wTG9hZGluZyk7XHJcbiAgICAgICAgICAgIGNsZWFyQm9yZGVyKHRvcExvYWRpbmcsIGRhdGEsIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgY2xlYXJIZWlnaHQodG9wTG9hZGluZywgZGF0YSwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihkYXRhLmJvdHRvbSkge1xyXG4gICAgICAgICAgYl9zdGFnZTFFbmQoYm90dG9tTG9hZGluZyk7XHJcbiAgICAgICAgICBiX2NiKChmbGFnKSA9PiB7XHJcbiAgICAgICAgICAgIGJfc3RhZ2UyRW5kKGJvdHRvbUxvYWRpbmcsIGZsYWcpO1xyXG4gICAgICAgICAgICBpZihmbGFnKSB7XHJcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRTdHlsZShib3R0b21Mb2FkaW5nLCB7XHJcbiAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IFwiaGlkZGVuXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0sIHRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGEucGhhc2UgPSAtMTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIChlKSA9PiB7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVkxvYWRpbmc7XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSztBQUMvQixFQUFFLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0QyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztB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
