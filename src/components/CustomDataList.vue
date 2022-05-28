<template>
  <div class="input-text">
    <strong class="mytooltip">
      <label class="pt-4 pb-2 float-start"
        :for=inputElementName :name=labelElementName>{{ labelText }}
      </label>
      <span class="mytooltip__left mytooltiptext" v-if="hasMounted && tooltipText.length !== 0">
        {{ tooltipText }}
      </span>
    </strong>
    <input type="text"
      list="my-list-id"
      :name=inputElementName
      :value="value"
      @change=handleChange
      @keyup=handleChange
      :pattern="pattern"
      v-on:keyup.enter=handleKeyPress
    />
    <datalist id="my-list-id" class="custom-datalist">
      <option :key=option
        v-for="option in listOptions">{{ option }}</option>
    </datalist>
  </div>
</template>

<script>
import '../styles/colours.css';
import '../styles/custom.css';

export default {
  name: 'CustomDataList',
  props: {
    labelText: {
      default: 'Label',
      type: String,
    },
    pattern: {
      default: '[a-zA-Z0-9]',
    },
    placeholderText: {
      default: 'Placeholder',
      type: String,
    },
    tooltipText: {
      default: 'Tooltip',
      type: String,
    },
    labelElementName: {
      default: 'label-name',
      type: String,
    },
    inputElementName: {
      default: 'input-name',
      type: String,
    },
    errorElementName: {
      default: 'error-name',
      type: String,
    },
    listOptions: {
      default() {
        return [''];
      },
      type: Array,
    },
    value: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.hasMounted = true;
    });
  },
  data() {
    return {
      hasMounted: false,
    };
  },
  methods: {
    getElementByName(name) {
      return document.getElementsByName(name)[0];
    },
    handleChange(event) {
      this.$emit('changed', event);
    },
    handleKeyPress() {
      this.$emit('keypress');
    },
  },
  computed: {
    textValue: {
      default: '',
      type: String,
      get() { return this.value; },
      set(textValue) { this.$emit('input', textValue); },
    },
  },
  watch: {
    value: {
      handler(newValue) {
        this.$emit('input', newValue);
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
