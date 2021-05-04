import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import DemoMap from '../components/DemoMap';
import Form from 'react-bootstrap/Form';

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

  // test('getTable should fetch table', ()=>{

  // });

  it('Should change value when onChange was called', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Form.Control/>);
    const event = {
            target: {
                value: 'This is just for test'
            }
        }
    wrapper.find('TextField').simulate('change', event)
    expect(onChange).toHaveBeenCalledWith('This is just for test');
  });

  it('Should have a DemoMap child component', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.contains(<DemoMap selectedVar={null} />)).toBe(true);
  });

});


