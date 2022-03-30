import Vue from 'vue';
import { BFormInput, BootstrapVue } from 'bootstrap-vue';
import { shallowMount } from '@vue/test-utils';
import InputText from '../../src/components/InputText.vue';
import CustomToolTip from '../../src/components/CustomToolTip.vue';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

test('Default values when no props passed', () => {
  const wrapper = shallowMount(InputText);

  const titleLabel = wrapper.find('label');
  expect(titleLabel.text()).toBe('Label');
  expect(titleLabel.attributes('name')).toBe('label-name');

  const inputField = wrapper.findComponent(BFormInput);
  expect(inputField.attributes('placeholder')).toBe('Placeholder');
  expect(inputField.attributes('name')).toBe('input-name');
});

test('Label and placeholder are displayed', () => {
  const title = 'Title';
  const placeholder = 'Title Placeholder';
  const tooltip = 'Title Tooltip';
  const inputName = 'title-input';
  const labelName = 'title-label';
  const wrapper = shallowMount(InputText, {
    propsData: {
      labelText: title,
      labelElementName: labelName,
      placeholderText: placeholder,
      tooltipText: tooltip,
      inputElementName: inputName,
    },
  });

  const titleLabel = wrapper.find('label');
  expect(titleLabel.text()).toBe(title);
  expect(titleLabel.attributes('name')).toBe(labelName);

  const inputField = wrapper.findComponent(BFormInput);
  expect(inputField.attributes('placeholder')).toBe(placeholder);
  expect(inputField.attributes('name')).toBe(inputName);
});

test('Tooltip is displayed when input element is clicked', async () => {
  const title = 'Title';
  const placeholder = 'Title Placeholder';
  const tooltip = 'Title Tooltip';
  const inputName = 'title-input';
  const labelName = 'title-label';
  const wrapper = shallowMount(InputText, {
    propsData: {
      labelText: title,
      labelElementName: labelName,
      placeholderText: placeholder,
      tooltipText: tooltip,
      inputElementName: inputName,
    },
  });

  const titleLabel = wrapper.find('label');
  expect(titleLabel.text()).toBe(title);
  expect(titleLabel.attributes('name')).toBe(labelName);

  const inputField = wrapper.findComponent(BFormInput);
  expect(inputField.attributes('placeholder')).toBe(placeholder);
  expect(inputField.attributes('name')).toBe(inputName);

  expect(wrapper.findComponent(CustomToolTip).exists()).toBe(false);
  await inputField.trigger('click');
  const tooltipField = wrapper.findComponent(CustomToolTip);
  expect(tooltipField.exists()).toBe(true);
  expect(tooltipField.attributes('tooltiptext')).toBe(tooltip);
  expect(tooltipField.attributes('targetelementname')).toBe(inputName);
});
