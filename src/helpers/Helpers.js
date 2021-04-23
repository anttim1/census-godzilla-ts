import { intersect } from "@turf/turf";
import * as d3 from "d3";

export const matchAndStrip = (str, regex, strip, rep) => {
  if (regex) {
    var match = str.match(regex);
  } else {
    var match = 1;
  }
  if (match) {
    for (let i = 0; i < strip.length; i++) {
      str = str.replace(strip[i], rep[i]);
    }
    return str;
  }
};

export const fetchCensusData = (request) =>
  fetch(request).then((res) => res.json());

export const addData = (geo, data) => {
  const newFeatures = [];
  for (let feat in geo.features) {
    const newFeature = geo.features[feat];
    const geoId = geo.features[feat].properties.GEO_ID.split("US")[1];
    if (data[geoId]) {
      const dataItem = data[geoId];
      const newData = {};
      Object.keys(dataItem).forEach((key) => {
        const newKey = key.split("_")[1];
        newData[newKey] = dataItem[key];
      });
      //const newKey = Object.keys(newData);
      //const newValue = newData[newKey];
      //console.log(newData, newValue, newKey);
      newFeature.properties["dataValue"] = newData;
      newFeatures.push(newFeature);
    }
  }
  return newFeatures;
};

export const getIntersect = (bounds, geo) => {
  const intrsctPolys = [];
  for (let i in geo) {
    let geo_poly = geo[i];
    let intrsct = intersect(bounds, geo_poly);
    if (intrsct != null) {
      intrsctPolys.push(geo_poly);
    }
  }
  return intrsctPolys;
};

export const coordsToJSON = (coords) => {
  let lat_NE = coords[0][0];
  let lng_NE = coords[0][1];
  let lat_SW = coords[1][0];
  let lng_SW = coords[1][1];
  let poly = [
    [
      [lng_NE, lat_NE],
      [lng_NE, lat_SW],
      [lng_SW, lat_SW],
      [lng_SW, lat_NE],
      [lng_NE, lat_NE],
    ],
  ];
  return poly;
};

export const createRequest = (group, variable) => {
  const url = "https://better-census-api.com/";
  const request =
    url +
    "gettable?vintage=2018&dataset=acs5&group=" +
    group +
    "&state=36&county=*&geography=county&key=32dd72aa5e814e89c669a4664fd31dcfc3df333d&variable=" +
    variable;
  return request;
};

export const sumObjects = (objs) => {
  return objs.reduce((acc, val) => {
    for (let k in val) {
      if (val.hasOwnProperty(k)) acc[k] = (acc[k] || 0) + val[k];
    }
    return acc;
  }, {});
};

export const avgObjects = (objs) => {
  const sum = sumObjects(objs);
  Object.keys(sum).forEach((key) => (sum[key] = sum[key] / objs.length));
  return sum;
};

export const drawChart = (data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand().range([height, 0]).padding(0.1);

  var x = d3.scaleLinear().range([0, width]);

  var svg = d3
    .select("#barplot")
    .append("svg")
    //  .attr("viewBox", [0, 0, width, height]);
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  x.domain([0, d3.max(values)]);
  y.domain(keys);
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(keys)
    .enter()
    .append("rect")
    .attr("class", "bar")
    //.attr("x", function(d) { return x(d.sales); })
    .attr("width", function (d) {
      return x(data[d]);
    })
    .attr("y", function (d) {
      return y(d);
    })
    .attr("height", y.bandwidth());

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
};
