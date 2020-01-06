import { events } from "../events";

const request =
  ["r", "webkitR", "mozR", "msR", "oR"].reduce(
    (p, v) => window[v + p] || p,
    "equestAnimationFrame"
  ) || (fn => window.setTimeout(fn, 1000 / 60));

const EVENT_VISIBILITY_CHANGE = "visibilitychange";

export default {
  props: {
    /**
     *
     */
    type: {
      type: String, // done
      default: ""
    },
    /**
     *
     */
    block: {
      type: String, // done
      default: "default"
    },
    /**
     *
     */
    vAlign: {
      type: String, // done
      default: "end",
      validator: prop => ["start", "center", "end"].includes(prop)
    },
    /**
     *
     */
    hAlign: {
      type: String, // done
      default: "end",
      validator: prop => ["start", "center", "end"].includes(prop)
    },
    /**
     *
     */
    width: {
      type: [Number, String], // done
      default: 400
    },
    /**
     *
     */
    reverse: {
      type: Boolean, // done
      default: false
    },
    /**
     *
     */
    classes: {
      type: String, // done
      default: ""
    },
    animation: {
      type: Boolean, // done
      default: false
    },
    /**
     *
     */
    transition: {
      type: String, // done
      default: "slide"
    },
    transitions: {
      type: Object, // done
      default: props => ({
        ...{
          "start-start": "fadeLeft",
          "start-center": "fadeDown",
          "start-end": "fadeRight",
          "center-start": "fadeLeft",
          "center-center": "fade",
          "center-end": "fadeRight",
          "end-start": "fadeLeft",
          "end-center": "fadeUp",
          "end-end": "fadeRight"
        },
        ...(props || {})
      })
    },
    /**
     *
     */
    inClass: {
      type: String, // done
      default: null
    },
    /**
     *
     */
    outClass: {
      type: String, // done
      default: null
    },
    /**
     *
     */
    timeout: {
      type: Number, // done
      default: 7000
    },
    /**
     *
     */
    duration: {
      type: Number, // done
      default: 500
    },
    /**
     *
     */
    delay: {
      type: Number, // done
      default: 0
    },
    /**
     *
     */
    timing: {
      type: String, // done
      default: ""
    },
    /**
     *
     */
    limit: {
      type: Number, // done
      default: Infinity
    },
    /**
     *
     */
    duplicates: {
      type: Boolean, // done
      default: true
    },
    /**
     *
     */
    dismissible: {
      type: Boolean, // done
      default: true
    },
    /**
     *
     */
    keepable: {
      type: Boolean, // done
      default: true
    },
    /**
     *
     */
    indication: {
      type: Boolean, // done
      default: true
    },
    /**
     *
     */
    queueable: {
      type: Boolean, // done
      default: true
    },
    /**
     *
     */
    backdrop: {
      type: Boolean, // done
      default: false
    },
    /**
     *
     */
    closure: {
      type: Boolean, // done
      default: true
    },
    /**
     *
     */
    orientations: {
      type: Boolean, // done
      default: false
    }
  },
  data() {
    return {
      datas: [],
      keep: false
    };
  },
  mounted() {
    events.$on("open", this.open);
    events.$on("close", this.close);
    events.$on("clear", this.clear);

    document.addEventListener(EVENT_VISIBILITY_CHANGE, this.visibilityChange);
  },
  destroyed() {
    events.$off("open", this.open);
    events.$off("close", this.close);
    events.$off("clear", this.clear);

    document.removeEventListener(
      EVENT_VISIBILITY_CHANGE,
      this.visibilityChange
    );

    this.clear();
  },
  computed: {
    style() {
      return {
        width: this.width + (/^\d*\.?\d*$/.test(this.width) ? "px" : ""),
        "transition-duration": `${this.duration}ms`,
        "transition-timing-function": `${this.timing}`,
        "transition-delay": `${this.delay}ms`,
        ...(this.animation
          ? {
              "animation-duration": `${this.duration}ms`,
              "animation-timing-function": `${this.timing}`,
              "animation-delay": `${this.delay}ms`
            }
          : {})
      };
    },
    sections() {
      const sections = {};
      const aligns = ["start", "center", "end"];

      aligns.map(vAlign =>
        aligns.map(hAlign => {
          const key = `${vAlign}-${hAlign}`;

          sections[key] = [];
        })
      );

      this.datas.map(data => {
        const key = `${data.vAlign}-${data.hAlign}`;

        sections[key][this.reverse ? "unshift" : "push"](data);
      });

      return sections;
    },
    align() {
      return `${this.vAlign}-${this.hAlign}`;
    }
  },
  methods: {
    transitionName(section) {
      return (
        (this.orientations ? this.transitions[section] : null) ||
        this.transition
      );
    },
    transitionEnterClass(section) {
      const transition =
        (this.orientations ? this.transitions[section] : null) ||
        this.transition;

      return transition ? `${transition}-enter-active` : this.inClass;
    },
    transitionLeaveClass(section) {
      const transition =
        (this.orientations ? this.transitions[section] : null) ||
        this.transition;

      return transition ? `${transition}-leave-active` : this.outClass;
    },
    click(data) {
      if (this.dismissible) {
        this.close(data.id, true);
      }
    },
    mouseover() {
      if (this.keepable) {
        this.pause();
      }
    },
    mouseout() {
      if (this.keepable) {
        this.resume();
      }
    },
    pause() {
      const timestamp = +new Date();

      this.datas.map(data => (data.timestamp = timestamp));

      this.keep = true;
    },
    resume() {
      const timestamp = +new Date();

      this.datas.map(data => (data.timestamp = timestamp));

      this.keep = false;
    },
    open(data) {
      if (this.type === data.type) {
        if (!this.duplicates) {
          if (
            this.datas
              .map(data => JSON.stringify({ ...data, id: null }))
              .indexOf(JSON.stringify({ ...data, id: null })) !== -1
          ) {
            return;
          }
        }

        if (this.datas.length === this.limit) {
          this.close(this.datas[0].id);
        }

        if (!this.queueable) {
          this.clear();
        }

        this.datas.push({
          block: this.block,
          vAlign: this.vAlign,
          hAlign: this.hAlign,
          timeout: this.timeout,
          indication: this.indication,
          closure: this.closure,
          ...data,
          timer: 0,
          timestamp: +new Date(),
          progress: 0
        });

        data.onOpen && data.onOpen(this.datas[this.datas.length - 1]);

        this.tick();
      }
    },
    close(id, manual = false) {
      const index = this.datas.findIndex(data => data.id === id);

      if (index !== -1) {
        const data = this.datas[index];

        this.datas.splice(index, 1);

        if (manual) {
          this.keep = false;
        }

        data.onClose && data.onClose(data, manual);

        this.tick();
      }
    },
    clear(type) {
      if (!type || type === this.type) {
        this.datas.slice().map(({ id }) => this.close(id));
      }
    },
    tick() {
      if (this.datas.length) {
        request(() => this.tick());

        if (this.keep) {
          return;
        }

        const timestamp = +new Date();

        this.datas.map(data => {
          data.timer += timestamp - data.timestamp;
          data.timestamp = timestamp;
          data.progress =
            Math.max(0, Math.min(data.timer / data.timeout, 1)) * 100;

          if (data.progress >= 100) {
            this.close(data.id);
          }
        });
      }
    },
    /**
     * If visibility changed pause or resume animation
     */
    visibilityChange() {
      switch (document.visibilityState) {
        case "visible":
          this.resume();
          break;
        case "hidden":
          this.pause();
          break;
        default:
      }
    }
  }
};
