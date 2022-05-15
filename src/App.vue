<template>
  <div id="app" class="container">
    <div id="form-container" class="col-sm-12 col-md-6 mx-auto">
      <b-row>
      <h1 v-if="browserVersion == 'IE' || browserVersion == 'Edge'">Please use a real browser</h1>
      </b-row>
      <b-row>
    <input-text
      labelText="Title"
      placeholderText="Bug Description"
      tooltipText=""
      inputElementName="bugDescriptionInput"
      labelElementName="bugDescriptionLabel"
      errorElementName="bugDescriptionError"
      @changed="handleChange"
      :inputDisabled="inputsDisabled"
      :textValue=description
    />
    </b-row>
    <b-row>
      <b-col>
        <input-text
          labelText="Project Code"
          placeholderText="AFT"
          tooltipText=""
          inputElementName="projectCodeInput"
          labelElementName="projectCodeLabel"
          errorElementName="projectCodeError"
          @changed="handleChange"
          :inputDisabled="inputsDisabled"
          :textValue=projectCode
        />
      </b-col>
      <b-col>
        <input-text
          labelText="Ticket Number(s)"
          placeholderText="1234"
          tooltipText="Ticket Number(s) e.g. 1234 or 123, 1234"
          inputElementName="ticketNumbersInput"
          labelElementName="ticketNumbersLabel"
          errorElementName="ticketNumbersError"
          @changed="handleChange"
          @focus="this.$root.$emit('bv::hide::tooltip')"
          :inputDisabled="inputsDisabled"
          :textValue="ticketNumbersData.join(',')"
      />
      </b-col>
    </b-row>
        <custom-data-list
      labelText="Add Steps"
      placeholderText="Login to ..."
      tooltipText="Steps to Recreate"
      inputElementName="addStepsInput"
      labelElementName="addStepsLabel"
      errorElementName="addStepsError"
      :listOptions=listOptions
      @changed="handleListChange"
      @keypress="handleKeyPress"
      v-model="stepTextValue"
    />
    <b-row>
      <b-col>
      <button @click="addStep" class="mt-4 mb-2 float-end min-width-12">+ Add Step</button>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <div v-if="hasMounted">
        <strong><label class="pt-2 pb-2 float-start"
          for="outputTextArea" name="outputTextLabel">Output</label></strong>
        <b-form-textarea
          id="textarea"
          placeholder="Enter something..."
          name="outputTextArea"
          rows="15"
          max-rows="15"
          @update="handleOutputTextChange"
          :value="generateOutputText"
    ></b-form-textarea>
        <b-row>
      <b-col>
      <button @click="resetForm" class="mt-4 mb-2 float-end min-width-10">Clear</button>
      </b-col>
    </b-row>
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
import {
  replaceText,
  replaceTextAt,
  isTextValid,
  getBrowserVersion,
} from './utils/helpers';

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
      outputText: null,
      listOptions: this.getSteps(),
      ticketNumbersData: [],
      projectCode: '',
      description: '',
      stepTextValue: '',
      stepBuffer: [],
      steps: [],
      titlePosition: 0,
      inputsDisabled: false,
    };
  },
  computed: {
    browserVersion() {
      return getBrowserVersion();
    },
    generateOutputText() {
      let text = null;
      if (this.outputText == null) {
        text = this.outputTextDefault;
      } else {
        text = this.outputText;
      }

      if (this.description.length > 0) {
        text = replaceTextAt(text, '<title>', this.description, this.titlePosition);
      }
      switch (this.ticketNumbersData.length) {
        case 1:
          text = replaceText(text, '<code>', this.ticketNumbersData[0]);
          break;
        case 2:
          text = replaceText(text, '<code>', `${this.ticketNumbersData[0]} and ${this.projectCode ? this.projectCode : '<project>'}-${this.ticketNumbersData[1]}`);
          break;
        default:
          break;
      }
      text = replaceText(text, '<project>', this.projectCode);
      text = replaceText(text, '<steps>', this.steps.join('\n'));
      return text;
    },
  },
  methods: {
    getSteps() {
      return localStorage.steps !== undefined ? localStorage.steps.split(',') : savedSteps.split('\n');
    },
    saveSteps() {
      localStorage.steps = this.listOptions.join(',');
    },
    disableInputFields() {
      this.inputsDisabled = true;
    },
    enableInputFields() {
      this.inputsDisabled = false;
    },
    handleKeyPress() {
      this.addStep();
    },
    handleChange(event) {
      this.$root.$emit('bv::hide::tooltip');
      switch (event.target.name) {
        case 'ticketNumbersInput':
          if (isTextValid(event.target.value, 10)) {
            this.ticketNumbersData = event.target.value.split(',');
          } else {
            const oldValue = this.ticketNumbersData;
            this.ticketNumbersData = [];
            this.ticketNumbersData = oldValue;
          }
          break;
        case 'projectCodeInput':
          if (isTextValid(event.target.value, 8)) {
            this.projectCode = event.target.value;
          } else {
            const oldValue = this.projectCode;
            this.projectCode = '';
            this.projectCode = oldValue;
          }
          break;
        case 'bugDescriptionInput':
          if (isTextValid(event.target.value, 120)) {
            this.description = event.target.value;
          } else {
            const oldValue = this.description;
            this.description = '';
            this.description = oldValue;
          }
          break;
        default:
          break;
      }
    },
    handleOutputTextChange() {
      this.titlePosition = this.getTitlePosition();
      this.disableInputFields();
    },
    handleListChange(value) {
      this.$root.$emit('bv::hide::tooltip');
      if (value.trim().length < 1) {
        return;
      }
      this.stepBuffer = `# ${value}`;
    },
    addStep() {
      // Prevent adding empty steps
      if (this.stepBuffer.length === 0) return;
      // Prevent adding steps with only spaces
      if (this.stepTextValue.trim().length < 1) {
        this.stepTextValue = '';
        return;
      }
      // Prevent adding duplicates
      if (this.steps.includes(this.stepBuffer)) {
        this.stepBuffer = [];
        return;
      }
      // Add the steps
      this.steps.push(this.stepBuffer);

      // Add the step to the dropdown list
      if ((!this.steps.includes(this.listOptions))
      && (!this.listOptions.includes(this.stepBuffer.replace('#', '').trim()))) {
        const newListOptions = [...this.listOptions, this.stepBuffer.replace('#', '').trim()];
        this.listOptions = newListOptions;
      }
      // Save the steps to local storage
      this.saveSteps();

      // Clear the step buffer
      this.stepBuffer = [];

      // Clear the add step input field
      this.stepTextValue = '';
    },
    getTitlePosition() {
      if (this.outputText == null) return 0;
      if (this.description === '') return 0;
      return this.outputText.search(this.description);
    },
    resetForm() {
      this.projectCode = '';
      this.description = '';
      this.stepTextValue = '';
      this.ticketNumbersData = [];
      this.steps = [];
      this.enableInputFields();
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
