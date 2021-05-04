import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import DemoMap from '../components/DemoMap';

// NOTE: This updates our snapshot "/node_modules/.bin/jest --updateSnapshot"

let wrapper:any;
describe('App should properly render', () => {
	beforeEach(() => {
		wrapper = shallow(<App />);
	});
	// Super basic test, page loads
	it('renders without crashing', () => {
		shallow(<App />);
	});
	it('renders correctly', () => {
		expect(wrapper).toMatchSnapshot();
	});
});

describe('App should react to changes properly', () => {
	// Make sure ColorScale is invoked when passed data that is correct
	// Make sure DataContainer's conditional rendering is Correct
	// Attempt snapshot testing of the whole main function
});
