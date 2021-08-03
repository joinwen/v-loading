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

export {
  updateDataInStart,
  updateDataInMove,
  updateDataInCancel
};
