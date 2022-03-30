<template>
  <div id="app" class="container">
    <div id="form-container" class="col-sm-12 col-md-6 mx-auto">
    <input-text
    labelText="Title"
    placeholderText="Bug / Improvement Description"
    tooltipText=""
    inputElementName="bugDescription"
    labelElementName="bugDescriptionLabel"
    errorElementName="bugDescriptionError"
    @changed="handleChange"
    />
    <b-row>
      <b-col>
        <input-text
          labelText="Project Code"
          placeholderText="KW, SRV, PS, SEN"
          tooltipText="Project Code"
          inputElementName="projectCode"
          labelElementName="projectCodeLabel"
          errorElementName="projectCodeError"
          @changed="handleChange"
        />
      </b-col>
      <b-col>
        <input-text
          labelText="Ticket Number(s)"
          placeholderText="4321"
          tooltipText="Ticket Number(s) \n e.g. 4321 or 123, 1234"
          inputElementName="ticketNumbers"
          labelElementName="ticketNumbersLabel"
          errorElementName="ticketNumbersError"
          @changed="handleChange"
          @focus="this.$root.$emit('bv::hide::tooltip')"
      />
      </b-col>
    </b-row>
        <custom-data-list
      labelText="Add Steps"
      placeholderText="Login to ..."
      tooltipText="Steps to Recreate"
      inputElementName="addSteps"
      labelElementName="addStepsLabel"
      errorElementName="addStepsError"
      :listOptions=listOptions
      @changed="handleListChange"
    />
    <b-row>
      <b-col>
      <b-button @click="addStep" class="mt-4 mb-2 float-end">+ Add Step</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <div v-if="hasMounted">
        <strong><label class="pt-2 pb-2 float-start"
          for="outputTextArea" name="outputTextLabel">Output</label></strong>
        <b-form-textarea
      id="textarea"
      v-model="generateOutputText"
      placeholder="Enter something..."
      name="outputTextArea"
      rows="15"
      max-rows="15"
    ></b-form-textarea>
    </div>
    </b-col>
    </b-row>
    </div> <!-- End of form container -->
  </div>
</template>

<script>
// eslint-disable-next-line
import savedSteps from 'raw-loader!./assets/steps.txt';
// eslint-disable-next-line
import bugTemplate from 'raw-loader!./assets/template.txt';
import InputText from './components/InputText.vue';
import CustomDataList from './components/CustomDataList.vue';

export default {
  name: 'App',
  components: {
    InputText,
    CustomDataList,
  },
  mounted() {
    this.$nextTick(() => {
      this.hasMounted = true;
    });
  },
  data() {
    return {
      hasMounted: false,
      outputTextDefault: bugTemplate,
      listOptions: savedSteps.split('\n'),
      ticketNumbersData: [1234],
      projectCode: 'ABC',
      description: '',
      stepBuffer: [],
      steps: [],
    };
  },
  computed: {
    generateOutputText() {
      let text = this.outputTextDefault.replace('<title>', this.description);
      switch (this.ticketNumbersData.length) {
        case 1:
          text = text.replace('<project>', this.projectCode);
          text = text.replace('<code>', this.ticketNumbersData[0]);
          break;
        case 2:
          text = text.replace('<project>', this.projectCode);
          text = text.replace('<code>', this.ticketNumbersData.join(` and ${this.projectCode}-`));
          break;
        default:
          break;
      }
      text = text.replace('<steps>', this.steps.join('\n'));
      return text;
    },
  },
  methods: {
    handleChange(event) {
      this.$root.$emit('bv::hide::tooltip');
      switch (event.target.name) {
        case 'ticketNumbers':
          this.ticketNumbersData = event.target.value.split(',');
          break;
        case 'projectCode':
          this.projectCode = event.target.value;
          break;
        case 'bugDescription':
          this.description = event.target.value;
          break;
        default:
          break;
      }
    },
    handleListChange(value) {
      this.$root.$emit('bv::hide::tooltip');
      if (value.length < 1) return;
      this.stepBuffer = `# ${value}`;
    },
    addStep() {
      if (this.steps.includes(this.stepBuffer)) return;
      this.steps.push(this.stepBuffer);
      this.stepBuffer = [];
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
