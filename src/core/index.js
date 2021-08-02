import {defaultOptions} from "./default";
import {clearBorder, clearHeight, clearLoadingImg, setBorder, setHeight, setLoadingImg, damp} from "../utils/index";
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
    }
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
    })

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
    }, {passive: false})
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
            cb(() => {stage2End(topLoading);clearHeight(topLoading, data, duration)});
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
              cb(() => {stage2End(bottomLoading);clearHeight(bottomLoading, data, duration)});
            } else {
              stage1End(bottomLoading);
              clearBorder(bottomLoading, data, duration);
              clearHeight(bottomLoading, data, duration);
            }
          // }
        }
      }
    })
    ele.addEventListener("touchcancel", (e) => {
    })
  }
}
export default VLoading;
