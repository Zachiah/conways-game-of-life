import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

type TippyParams = Parameters<typeof tippy>[1];
const tooltip = (node: HTMLElement, params: TippyParams) => {
  let tip = tippy(node, params);
  return {
    update: (newParams: TippyParams) => {
      tip.setProps(newParams ?? {});
    },
    destroy: () => {
      tip.destroy();
    },
  };
};

export default tooltip;
