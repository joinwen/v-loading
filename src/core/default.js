import {clearLoadingImg, setLoadingImg} from "../utils";

const defaultOptions = {
  max: 80,
  bg: "#f0f0f0",
  cb: () => {},
  stage1Begin: () => {},
  stage2Begin: (ele) => {
    setLoadingImg(ele)
  },
  stage1End: () => {},
  stage2End: () => {
    clearLoadingImg(ele)
  },
  stage2: () => {},
  duration: 250,
}
export {
  defaultOptions
}
