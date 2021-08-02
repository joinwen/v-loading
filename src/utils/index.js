const setStyle = (ele, obj) => {
  for (const key of Object.keys(obj)) {
    ele.style[key] = `${obj[key]}`;
  }
}
const getStyle = (ele, attr) => {
  return document.defaultView.getComputedStyle(ele)[attr];
}

const clearBorder = (ele, data, duration = 600) => {
  setStyle(ele, {
    "borderBottom": "0 solid transparent",
    "transition": `border-bottom ${duration}ms`
  })
  setTimeout(() => {
    setStyle(ele, {
      "transition": "none"
    });
    (data) && (data.phase = -1);
  }, duration)
}

const clearHeight = (ele, data, duration = 600) => {
  let color = getStyle(ele, "backgroundColor");
  setStyle(ele, {
    height: "0",
    background: color,
    transition: `height ${duration}ms`
  })
  setTimeout(() => {
    setStyle(ele, {
      "transition": "none"
    });
    (data) && (data.phase = -1);
  }, duration)
}

const clearLoadingImg = (ele) => {
  setStyle(ele, {
    background: "none"
  })
}

const setBorder = (ele, value, color = "#f0f0f0") => {
  setStyle(ele, {
    "borderBottom": `${value}px solid ${color}`,
    transition: "none",
  })
}

const setHeight = (ele, value, color ="#f0f0f0") => {
  setStyle(ele, {
    height: `${value}px`,
    background: color,
    transition: "none"
  })
}

const setLoadingImg = (ele, src="./loading.gif") => {
  let color = getStyle(ele, "backgroundColor");
  setStyle(ele, {
    background: `url(${src}) center/4em no-repeat ${color}`
  })
}

const damp = (x, max) => {
  let unit = (x) => {
    return Math.atan(x) / (Math.PI / 2);
  }
  let contraction = (x, max) => {
    return x / max;
  }
  return unit(contraction(x, max)) * max;
}
export {
  setStyle,
  setHeight,
  setBorder,
  clearHeight,
  clearBorder,
  damp,
  setLoadingImg,
  clearLoadingImg
}
