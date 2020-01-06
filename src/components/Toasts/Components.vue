<script>
import Vue from "vue";

import Toasts from "./Toasts";

export default Vue.extend({
  name: "ToastsComponents",
  components: { Toasts }
});
</script>

<template>
  <div>
    <toasts type="toasts-basic" :dismissible="false">
      <template v-slot:default="{ data }">
        <div class="toast__inner">
          <div class="toast__title">{{ data.title }}</div>
          <div class="toast__description">{{ data.description }}</div>
        </div>
        <div class="toast__inputs" v-if="data.inputs && data.inputs.length">
          <label v-for="(input, index) in data.inputs" :key="index">
            {{ input.name }}
            <input
              :placeholder="input.placeholder"
              type="text"
              v-model="input.value"
              v-on="input.listeners"
            />
          </label>
        </div>
        <div class="toast__buttons" v-if="data.buttons && data.buttons.length">
          <button
            v-for="(button, index) in data.buttons"
            :key="index"
            v-on="button.listeners"
          >
            {{ button.name }}
          </button>
        </div>
      </template>
    </toasts>
  </div>
</template>

<style lang="scss" scoped></style>
