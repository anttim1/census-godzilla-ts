import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import DemoMap from '../components/DemoMap';

describe('App', () => {
  // Super basic test, page loads
  it('renders without crashing', () => {
    shallow(<App/>);
  });

  // Example test:
  it('renders Account header', () => {
    const wrapper = shallow(<App/>);
    const welcome = <h1>Display Active Users Account Details</h1>;
    expect(wrapper.contains(welcome)).toEqual(false);
  });

  test('getTable should fetch table', ()=>{

  });

  it('Should have a DemoMap child component', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.contains(<DemoMap selectedVar={null} />)).toBe(true);
  });

});


