const updateDataInStart = (data, e, options) => {
  let ele = options.ele,
  [top, bottom] = topAndBottom(ele);
  if(data.phase === -1 && (top || bottom)) {
    data.start = e.touches[0].pageY;
    data.phase = 0;
    data.top = top;
    data.bottom = bottom;
  }
}
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
}

const updateDataInCancel = (data, e, options) => {
  // if(data.top || data.bottom) {
  //   (data.phase === 1) && (data.phase = 2)
  // }
  let ele = options.ele,
    [top, bottom ] = topAndBottom(ele);
  data.top = top;
  data.bottom = bottom;
}

const topAndBottom = (ele) => {
  return [
    ele.scrollTop === 0,
    ele.scrollTop + ele.clientHeight >= ele.scrollHeight
  ]
}

export {
  updateDataInStart,
  updateDataInMove,
  updateDataInCancel
}
