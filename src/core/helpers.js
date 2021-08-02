const updateDataInStart = (data, e, options) => {
  data.start = e.touches[0].pageY;
  (data.phase === -1) && (data.phase = 0);
}
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
}

const updateDataInCancel = (data, e, options) => {
  (data.phase === 1) && (data.phase = 2);

}
export {
  updateDataInStart,
  updateDataInMove,
  updateDataInCancel
}
