import React from 'react';
import { shallow, mount, render } from 'enzyme';
import App from '../App';
import jestFetchMock from  'jest-fetch-mock';
import DemoMap from '../components/DemoMap';
import {getTablesResult} from '../__mocks__/appMocks';

// NOTE: This updates our snapshot "/node_modules/.bin/jest --updateSnapshot"
jestFetchMock.enableMocks();
let wrapper:any;
describe('App should properly render', () => {
	beforeEach(() => {
		wrapper = mount(<App />);
		console.log(wrapper.debug());
		//fetch.resetMocks();
	});
	// Super basic test, page loads
	it('renders without crashing', () => {
		shallow(<App />);
	});
	
});

describe('App should react to changes properly', () => {
	it('GroupForm should make a request when form is filled', () => {
		const searchMock = jest.fn();
		const event = {
			target: { value: 'the-value' }
		} as React.ChangeEvent<HTMLInputElement>;
	}
	
	)
	// fetch.mockResponseOnce(JSON.stringify(getTablesResult));
	// Make sure ColorScale is invoked when passed data that is correct
	// Make sure DataContainer's conditional rendering is Correct
	// Attempt snapshot testing of the whole main function
});

/*
// Example test I found
it('should call onChange prop', () => {
  const onSearchMock = jest.fn();
  const event = {
    target: { value: 'the-value' }    //target value=68
  } as React.ChangeEvent<HTMLInputElement>;
  const component = enzyme.mount<InputBox>(<InputBox onSearch={onSearchMock} />);
  const instance = component.instance();
  instance.onSearch(event);
  expect(onSearchMock).toBeCalledWith('the-value');
}); 
*/