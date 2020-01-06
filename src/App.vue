<template>
  <div id="app">
    <div>
      vAlign
      <select v-model="vAlign">
        <option v-for="item in vAligns" :value="item" :key="item">
          {{ item }}
        </option>
      </select>
    </div>

    <div>
      hAlign
      <select v-model="hAlign">
        <option v-for="item in hAligns" :value="item" :key="item">
          {{ item }}
        </option>
      </select>
    </div>

    <div>
      components
      <select v-model="component">
        <option v-for="item in components" :value="item" :key="item">
          {{ item }}
        </option>
      </select>
    </div>

    <div>
      <button v-for="name in simples" :key="name" @click="simple(name)">
        {{ name }}
      </button>

      <div>
        <button
          v-for="name in interactions"
          :key="name"
          @click="interaction(name)"
        >
          {{ name }}
        </button>
      </div>
    </div>

    <div>
      <button @click="test(1)">
        Test1
      </button>
    </div>

    <div>
      <button @click="clear()">
        Clear
      </button>
    </div>

    <toasts type="test1">
      <template v-slot:default="{}">
        <b>vAlign</b>: {{ vAlign }} <b>hAlign</b>: {{ hAlign }}
      </template>
    </toasts>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    const aligns = ["start", "center", "end"];

    return {
      vAlign: "end",
      vAligns: aligns,
      hAlign: "end",
      hAligns: aligns,
      component: "toasts",
      components: ["modals", "panels", "stacks", "toasts"],
      simples: ["default", "success", "error", "warning", "info"],
      interactions: ["alert", "confirm", "prompt"]
    };
  },
  methods: {
    make() {
      this.$toasts.confirm({
        vAlign: this.vAlign,
        hAlign: this.hAlign,
        data: {
          title: "test test test",
          description: "test test test"
        }
      });
    },
    simple(type) {
      const id = this[`$${this.component}`][type]({
        vAlign: this.vAlign,
        hAlign: this.hAlign,
        onOpen: () => console.log("onOpen"),
        onClose: () => console.log("onClose"),
        data: {
          title: `Title for "${type}"`,
          description: `Description for "${type}"`
        }
      });
    },
    interaction(type) {
      let title = "";
      let description = "";

      const inputs = [];
      const buttons = [];

      switch (type) {
        case "alert":
          title = "Are you sure?";
          description = 'Use "Notification" plugin?';
          break;

        case "confirm":
          title = "Are you sure?";
          description = 'Use "Notification" plugin?';

          ["Yes", "No", "Later", "Close"].map(name =>
            buttons.push({
              name,
              listeners: {
                click() {
                  console.log(name);
                }
              }
            })
          );
          break;

        case "prompt":
          title = "Are you sure?";
          description = 'Use "Notification" plugin?';

          inputs.push({
            name: "Are you sure?"
          });

          ["Ok", "Cancel"].map(name =>
            buttons.push({
              name,
              listeners: {
                click() {
                  console.log(name);
                }
              }
            })
          );
          break;
      }

      const id = this[`$${this.component}`][type]({
        vAlign: this.vAlign,
        hAlign: this.hAlign,
        onOpen: () => console.log("onOpen"),
        onClose: () => console.log("onClose"),
        data: { title, description, inputs, buttons }
      });
    },
    test() {
      const id = this.$toasts({
        type: "test1",
        vAlign: this.vAlign,
        hAlign: this.hAlign,
        onOpen: () => console.log("onOpen"),
        onClose: () => console.log("onClose")
      });
    },
    clear() {
      this.$toasts.clear();
    }
  }
};
</script>

<style lang="scss">
body {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
}
</style>
