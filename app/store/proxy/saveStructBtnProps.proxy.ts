import {proxy} from "valtio";

type SaveStructBtn = {
  handleSubmit: () => Promise<void>;
  disabled?: boolean
}
export const saveStructBtnPropsProxy = proxy<SaveStructBtn>({
  handleSubmit: async () => {
  },
  disabled: false
})
