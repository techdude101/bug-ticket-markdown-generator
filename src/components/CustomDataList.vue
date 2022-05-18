<template>
  <div>
    <strong class="mytooltip">
      <label class="pt-4 pb-2 float-start"
        :for=inputElementName :name=labelElementName>{{ labelText }}
      </label>
      <span class="mytooltip__left mytooltiptext" v-if="hasMounted && tooltipText.length !== 0">
        {{ tooltipText }}
      </span>
    </strong>
    <b-form-input
      list="my-list-id"
      :name=inputElementName
      v-model="value"
      @change=handleChange
      @keyup=handleChange
      :pattern="pattern"
      v-on:keyup.enter=handleKeyPress></b-form-input>
    <datalist id="my-list-id" class="custom-datalist">
      <option :key=option
        v-for="option in listOptions">{{ option }}</option>
    </datalist>
    <!-- <custom-tool-tip v-if="hasMounted && tooltipText.length !== 0" :tooltipText="tooltipText"
      :targetElementName="inputElementName">
    </custom-tool-tip> -->
  </div>
</template>

<script>
// import CustomToolTip from './CustomToolTip.vue';
import '../styles/custom.css';

export default {
  // components: { CustomToolTip },
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
    handleChange() {
      this.$emit('changed', this.value);
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
