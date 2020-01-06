import "./styles/index.scss";

import Modals, { Components as ModalsComponents } from "./Modals";
import Panels, { Components as PanelsComponents } from "./Panels";
import Stacks, { Components as StacksComponents } from "./Stacks";
import Toasts, { Components as ToastsComponents } from "./Toasts";

import { events } from "./events";

const plugin = {
  install(Vue) {
    if (this.installed) {
      return;
    }

    this.installed = true;

    // ---
    const id = "notifications";

    const container = document.body.appendChild(
      document.getElementById(id) || document.createElement("div")
    );
    container.setAttribute("id", id);
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.appendChild(new ModalsComponents().$mount().$el);
    container.appendChild(new PanelsComponents().$mount().$el);
    container.appendChild(new StacksComponents().$mount().$el);
    container.appendChild(new ToastsComponents().$mount().$el);

    // ---

    const components = {
      modals: Modals,
      panels: Panels,
      stacks: Stacks,
      toasts: Toasts
    };

    const open = data => {
      const id =
        data.id ||
        [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join("");

      events.$emit(`open`, { ...data, id });

      return id;
    };
    const close = id => events.$emit(`close`, id);
    const clear = type => events.$emit(`clear`, type);

    Object.keys(components).map(key => {
      Vue.component(key, components[key]);

      const fn = data => open(data);
      fn.close = id => close(id);
      fn.clear = type => clear(type);

      Vue[key] = Vue.prototype[`$${key}`] = fn;

      [
        "default",
        "success",
        "error",
        "warning",
        "info",
        "alert",
        "confirm",
        "prompt"
      ].map(type => {
        fn[type] = data =>
          open({
            ...data,
            type: `${key}-basic`,
            classes: `type-${type} ${data.classes || ""}`
          });
      });
    });
  }
};

export default plugin;

if (typeof window !== `undefined` && window.Vue) {
  window.Vue.use(plugin);
}
