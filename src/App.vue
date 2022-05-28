<template>
  <div id="app" class="container">
    <div id="form-container" class="col-sm-12 col-md-6 mx-auto">
      <b-row>
        <h1 v-if="browserVersion == 'IE' || browserVersion == 'Edge'">Please use a real browser</h1>
      </b-row>
      <b-row>
    <input-text
      labelText="Description"
      placeholderText="Description"
      tooltipText=""
      :pattern="regexPatterns.PRINTABLE_CHARACTERS"
      inputElementName="bugDescriptionInput"
      labelElementName="bugDescriptionLabel"
      errorElementName="bugDescriptionError"
      @changed="handleChange"
      :inputDisabled="inputsDisabled"
      :textValue=description
      :maxLength="bugDescriptionMaxLength"
    />
    </b-row>
    <b-row>
      <b-col>
        <input-text
          labelText="Project Code"
          placeholderText="AFT"
          tooltipText=""
          :pattern="regexPatterns.ALPHA_WHITESPACE"
          inputElementName="projectCodeInput"
          labelElementName="projectCodeLabel"
          errorElementName="projectCodeError"
          @changed="handleChange"
          :inputDisabled="inputsDisabled"
          :textValue=projectCode
          :maxLength="projectCodeMaxLength"
        />
      </b-col>
      <b-col>
        <input-text
          labelText="Ticket Number(s)"
          placeholderText="1234"
          tooltipText="Ticket Number(s) e.g. 1234 or 123, 1234"
          :pattern="regexPatterns.DIGITS_AND_COMMA"
          inputElementName="ticketNumbersInput"
          labelElementName="ticketNumbersLabel"
          errorElementName="ticketNumbersError"
          @changed="handleChange"
          @focus="this.$root.$emit('bv::hide::tooltip')"
          :inputDisabled="inputsDisabled"
          :textValue="ticketNumbersData.join(',')"
          :maxLength="ticketNumbersMaxLength"
      />
      </b-col>
    </b-row>
        <custom-data-list
      labelText="Add Steps"
      placeholderText="Login to ..."
      tooltipText="Steps to Recreate"
      :pattern="regexPatterns.ALL_CHARACTERS"
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
    <b-row class="mt-2">
      <b-col>
        <div v-if="hasMounted">
          <strong>
            <label class="pt-2 pb-2 float-start editIcon"
              for="outputTextArea" name="outputTextLabel">Output
              <a href="editTemplate"><span id="editIcon" class="float-right">
                  <!-- Edit icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg>
                </span>
              </a>
            </label>
          </strong>
          <textarea
            id="textarea"
            placeholder="Enter something..."
            name="outputTextArea"
            rows="15"
            max-rows="15"
            @keyup="handleOutputTextChange"
            :value="generateOutputText"
          ></textarea>
        <b-row>
      <b-col>
        <button @click="resetForm" class="mt-4 mb-2 float-end min-width-10">
          Reset
        </button>
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
import bugTemplate from 'raw-loader!./assets/template.txt';
import InputText from './components/InputText.vue';
import CustomDataList from './components/CustomDataList.vue';
import {
  replaceText,
  replaceTextAt,
  isTextValid,
  getBrowserVersion,
  getTemplateFromLocalStorage,
  saveDataToLocalStorage,
  getDataFromLocalStorage,
} from './utils/helpers';
import regexPatterns from './constants/regexPatterns';

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
      outputText: null,
      listOptions: this.getSteps(),
      ticketNumbersData: [],
      projectCode: '',
      description: '',
      stepTextValue: '',
      stepBuffer: [],
      steps: [],
      descriptionPosition: 0,
      inputsDisabled: false,
      regexPatterns,
      bugDescriptionMaxLength: 120,
      projectCodeMaxLength: 8,
      ticketNumbersMaxLength: 10,
    };
  },
  computed: {
    outputTextDefault() {
      const template = getTemplateFromLocalStorage();
      if (template) return template;
      return bugTemplate;
    },
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
        text = replaceTextAt(text, '<description>', this.description, this.descriptionPosition);
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
      const steps = getDataFromLocalStorage('steps');
      return steps !== undefined && steps != null ? steps : ['Login to', 'Click on'];
    },
    saveSteps() {
      saveDataToLocalStorage('steps', this.listOptions);
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
          if (event.target.value === '') {
            this.ticketNumbersData = [];
            break;
          }
          if (isTextValid(event.target.value, this.ticketNumbersMaxLength)) {
            this.ticketNumbersData = event.target.value.split(',');
          } else {
            const oldValue = this.ticketNumbersData;
            this.ticketNumbersData = [];
            this.ticketNumbersData = oldValue;
          }
          break;
        case 'projectCodeInput':
          if (event.target.value === '') {
            this.projectCode = '';
            break;
          }
          if (isTextValid(event.target.value, this.projectCodeMaxLength)) {
            this.projectCode = event.target.value;
          } else {
            const oldValue = this.projectCode;
            this.projectCode = '';
            this.projectCode = oldValue;
          }
          break;
        case 'bugDescriptionInput':
          if (event.target.value === '') {
            this.description = '';
            break;
          }
          if (isTextValid(event.target.value, this.bugDescriptionMaxLength)) {
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
    handleOutputTextChange(e) {
      console.log('Output changed');
      this.outputText = e.target.value;
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
    getDescriptionPosition() {
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
