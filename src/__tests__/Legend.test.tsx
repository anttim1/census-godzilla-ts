import React from 'react';
import { mount } from 'enzyme';
import Legend from '../components/Legend';
import { Feature, Polygon, Properties } from '@turf/turf';
import { act } from 'react-dom/test-utils';
global.fetch = require('node-fetch'); //TODO this should be mocked

// Check that Legend is available to be passed properties
describe('passing props', () => {
  // Variables DataContainer requires as props
  const quantiles:number[] | undefined = [];
  const colorRange:string[] = [ '#ffd1dc',
  '#ffad9f',
  '#ff5533',
  '#e2492d',
  '#9a311f',
  '#782618'];
  const leaflet: any = {}

  act(() => {
  const wrapper = mount(
  <Legend
    quantiles={quantiles}
    colorRange={colorRange}
    />);
    it('Accepts map information props', () => {
      expect(wrapper.props().quantiles).toEqual(quantiles);
      expect(wrapper.props().colorRange).toEqual(colorRange);
    });
  });
});
