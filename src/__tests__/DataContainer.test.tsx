import React from 'react';
import { mount } from 'enzyme';
import DataContainer from '../components/DataContainer';
import { Feature, Polygon, Properties } from '@turf/turf';
global.fetch = require('node-fetch');
// Check that DataContainer is available to be passed properties
describe('passing props', () => {
  // Variables DataContainer requires as props
  const onScreen:Feature<Polygon, Properties>[] = []
  const setShowDataContainer = (showDataContainer:any) => jest.fn().mockImplementation(() => [
    showDataContainer,
    () => {},
  ]);

  const wrapper = mount(
  <DataContainer
    onScreen={onScreen}
    setShowDataContainer={setShowDataContainer} //@ts-ignore
    showDataContainer={}
  />);
  it('Accepts map information props', () => {
    expect(wrapper.props().onScreen).toEqual(onScreen);
  });
});