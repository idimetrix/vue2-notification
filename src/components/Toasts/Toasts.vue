<script>
import Vue from "vue";

import { basicMixin, pointerMixin } from "../mixins";

export default Vue.extend({
  name: "Toasts",
  mixins: [basicMixin, pointerMixin]
});
</script>

<template>
  <div>
    <transition-group
      v-for="(datas, section) in sections"
      :key="section"
      :class="['notifications', 'toasts', section, { backdrop }]"
      :duration="duration"
      :name="transitionName(section)"
      :enter-active-class="transitionEnterClass(section)"
      :leave-active-class="transitionLeaveClass(section)"
    >
      <div
        v-for="data in datas"
        :key="data.id"
        :class="[
          'notification',
          'toast',
          classes,
          data.classes,
          { indication: data.indication && data.timeout > 0 }
        ]"
        :style="style"
        @click="click(data)"
        @mouseover="mouseover(data)"
        @mouseout="mouseout(data)"
        v-on="data.listeners"
      >
        <slot
          v-if="data.indication && data.timeout > 0"
          name="indication"
          :data="data.data"
          :progress="data.progress"
          :close="() => close(data.id, true)"
        >
          <div
            class="progression"
            :style="{ width: data.progress + '%' }"
          ></div>
        </slot>

        <slot
          v-if="data.closure"
          name="closure"
          :data="data.data"
          :progress="data.progress"
          :close="() => close(data.id, true)"
        >
          <div class="closure" @click="close(data.id, true)"></div>
        </slot>

        <slot
          :name="data.block"
          :data="data.data"
          :progress="data.progress"
          :close="() => close(data.id, true)"
        >
        </slot>
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped></style>
