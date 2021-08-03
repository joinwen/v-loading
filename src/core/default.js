import { setStyle} from "../utils";

const defaultOptions = {
  time: 300,
  max: 80,
  bg: "#f0f0f0",
  cb: () => {},
  stage1Begin: (ele, obj) => {
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
  stage2Begin: (ele, obj) => {
    setStyle(ele, {
      text: "松开刷新"
    });
  },
  stage1End: (ele, flag) => {
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
  stage2End: (ele) => {
    setStyle(ele, {
      text: "刷新中..."
    });
  },
  stage2: () => {},
  duration: 250,
};
export {
  defaultOptions
};
