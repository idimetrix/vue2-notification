<script>
import Vue from "vue";

import { basicMixin, pointerMixin } from "../mixins";

export default Vue.extend({
  name: "Stacks",
  mixins: [basicMixin, pointerMixin]
});
</script>

<template>
  <transition-group>
    <transition-group
      v-for="(datas, section) in sections"
      :key="section"
      :class="['notifications', 'stacks', section]"
      :name="transition"
      :duration="duration"
    >
      <div
        v-for="data in datas"
        :key="data.id"
        :class="['notification', 'stack', classes, data.classes]"
        :style="style"
        @click="click(data)"
        @mouseover="mouseover(data)"
        @mouseout="mouseout(data)"
        v-on="data.listeners"
      >
        <slot
          :name="data.block"
          :data="data.data"
          :progress="data.progress"
          :close="() => close(data, true)"
        >
        </slot>

        <slot
          v-if="data.indication && data.timeout > 0"
          name="indication"
          :data="data.data"
          :progress="data.progress"
          :close="() => close(data, true)"
        >
          <div class="indication" :style="{ width: data.progress + '%' }"></div>
        </slot>
      </div>
    </transition-group>
  </transition-group>
</template>

<style lang="scss" scoped></style>
