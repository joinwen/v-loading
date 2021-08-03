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

const clearLoadingImg = (ele) => {
  setStyle(ele, {
    background: "none"
  });
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

const setLoadingImg = (ele, src="./loading.gif") => {
  let color = getStyle(ele, "backgroundColor");
  setStyle(ele, {
    background: `url(${src}) center/4em no-repeat ${color}`
  });
};

const damp = (x, max) => {
  let unit = (x) => {
    return Math.atan(x) / (Math.PI / 2);
  };
  let contraction = (x, max) => {
    return x / max;
  };
  return unit(contraction(x, max)) * max;
};
export {
  setStyle,
  setHeight,
  setBorder,
  clearHeight,
  clearBorder,
  damp,
  setLoadingImg,
  clearLoadingImg
};
