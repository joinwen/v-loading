import {defaultOptions} from "./default";
import {
  clearBorder,
  clearHeight,
  setBorder,
  setHeight,
  setStyle
} from "../utils/index";
import {
  updateDataInStart,
  updateDataInMove,
  updateDataInCancel
} from "./helpers";

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
