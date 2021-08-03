import { setStyle} from "../utils";

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
export {
  defaultOptions
};
