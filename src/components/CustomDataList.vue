<template>
  <div>
    <strong><label class="pt-4 pb-2 float-start"
    :for=inputElementName :name=labelElementName>{{ labelText }}</label></strong>
    <b-form-input list="my-list-id" :name=inputElementName
      v-model=value
      @change=handleChange
      @keyup=handleChange></b-form-input>
    <datalist id="my-list-id">
      <option :key=option v-for="option in listOptions">{{ option }}</option>
    </datalist>
    <custom-tool-tip v-if="hasMounted && tooltipText.length !== 0" :tooltipText="tooltipText"
      :targetElementName="inputElementName">
    </custom-tool-tip>
  </div>
</template>

<script>
import CustomToolTip from './CustomToolTip.vue';

export default {
  components: { CustomToolTip },
  name: 'CustomDataList',
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
  },
  mounted() {
    this.$nextTick(() => {
      this.hasMounted = true;
    });
  },
  data() {
    return {
      hasMounted: false,
      value: '',
    };
  },
  methods: {
    getElementByName(name) {
      return document.getElementsByName(name)[0];
    },
    handleChange() {
      this.$emit('changed', this.value);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
