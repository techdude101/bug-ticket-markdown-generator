<template>
  <div class="input-text">
    <strong class="mytooltip"><label class="pt-4 pb-2 float-start"
    :for=inputElementName :name=labelElementName>{{ labelText }}</label>
    <span class="mytooltiptext" v-if="hasMounted && tooltipText.length !== 0">
      {{ tooltipText }}</span>
    </strong>
    <input
      :name=inputElementName
      :value="textValue"
      :placeholder=placeholderText
      @keyup=handleChange
      :pattern="pattern"
      :disabled="inputDisabled"
      :maxlength="maxLength"
      />
  </div>
</template>

<script>
import '../styles/colours.css';
import '../styles/custom.css';

export default {
  // components: { CustomToolTip },
  name: 'InputText',
  props: {
    labelText: {
      default: 'Label',
      type: String,
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
    textValue: {
      default: '',
      type: String,
    },
    errorElementName: {
      default: 'error-name',
      type: String,
    },
    pattern: {
      default: '[a-zA-Z0-9]+',
      type: String,
    },
    title: {
      default: 'Alphanumeric characters',
      type: String,
    },
    inputDisabled: {
      default: false,
      type: Boolean,
    },
    maxLength: {
      default: 10,
      type: Number,
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
    handleChange(event) {
      this.$emit('changed', event);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
