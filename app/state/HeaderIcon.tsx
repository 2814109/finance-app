import { atom } from "recoil";

const HeaderIconState = atom<string>({
  key: "HeaderIconState",
  default: "",
});

export default HeaderIconState;
