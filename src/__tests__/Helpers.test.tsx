import React, { createRef } from 'react';
import US_counties from '../data/US_counties_5m.json';
import { legendDataMock, addDataResult,getIntersectBound, getIntersectGeo,getIntersectResult} from './legendDataMock'

import { 
  addData, 
  getIntersect, 
  createRequest,
  coordsToJSON, 
  createChartRequest
 } from '../helpers/Helpers'
import { Feature, Polygon, Properties } from '@turf/turf';

 describe('Helpers unit test', () => {
	it('AddData takes arguments and returns a valid Features response', () => {
		const response = addData(US_counties, legendDataMock);
    expect(response).toMatchObject(addDataResult);
	});

  it('GetIntersect takes arguments and returns a valid Features response', () => {
		// The test here isn't super meaningful, but we'd have to pass in a massive array of mock data to get a better expected value
    const response = getIntersect(getIntersectBound, getIntersectGeo);
    expect(response).toMatchObject(getIntersectResult);
	});

  it('createRequest takes string arguments and returns a valid URL', () => {
		// The test here isn't super meaningful, but we'd have to pass in a massive array of mock data to get a better expected value
    const response = createRequest('B17015', '002E');
    expect(response).toMatch("https://better-census-api.com/gettable?vintage=2018&dataset=acs5&group=B17015&state=36&county=*&geography=county&key=32dd72aa5e814e89c669a4664fd31dcfc3df333d&variable=002E");
	});

  it('createChartRequest takes arguments and returns ', () => {
		// The test here isn't super meaningful, but we'd have to pass in a massive array of mock data to get a better expected value
    const response = createChartRequest('B03002', ["001E", "003E", "004E", "005E", "006E", "007E", "008E", "009E", "012E"]);
    expect(response).toMatch("https://better-census-api.com/gettable?vintage=2018&dataset=acs1&group=B03002&state=36&county=*&geography=county&key=32dd72aa5e814e89c669a4664fd31dcfc3df333d&variable=001E,003E,004E,005E,006E,007E,008E,009E,012E");
	});
});


 // Test for createRequest (group: string, variable: string)
 // Test fir createChartRequest (group: string, variable: string[])