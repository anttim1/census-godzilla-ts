import { Feature, intersect, Polygon, Properties } from "@turf/turf";
import * as d3 from "d3";

type AnyObject = { [key: string]: any };

// export const matchAndStrip = (str:string, regex:string, strip, rep) => {
//   var match;
//   if (regex) {
//     match = str.match(regex);
//   } else {
//     match = 1;
//   }
//   if (match) {
//     for (let i = 0; i < strip.length; i++) {
//       str = str.replace(strip[i], rep[i]);
//     }
//     return str;
//   }
// };

export const fetchCensusData = (request: string) =>  fetch(request).then((res) => res.json());

export const addData = (geo:AnyObject, data:AnyObject) => {
  const newFeatures = [];
  for (let feat in geo.features) {
    const newFeature = geo.features[feat];
    const geoId = geo.features[feat].properties.GEO_ID.split("US")[1];
    if (data[geoId]) {
      const dataItem = data[geoId];
      const newData: AnyObject = {};
      Object.keys(dataItem).forEach((key) => {
        const newKey = key.split("_")[1];
        newData[newKey]  = dataItem[key];
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

export const getIntersect = (bounds: Feature<Polygon, Properties>, geo:Feature<Polygon, Properties>[]) => {
  const intrsctPolys = [];
  if (!geo) return [];
  for (let i in geo) {
    let geo_poly = geo[i]; // FIXME can this be const?
    let intrsct = intersect(bounds, geo_poly); // FIXME can this be const?
    if (intrsct != null) {
      intrsctPolys.push(geo_poly);
    }
  }
  return intrsctPolys;
};

export const coordsToJSON = (coords:number[][]) => {
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

export const createRequest = (group: string, variable: string) => { // A function calls this with type string | undefined
  const url = "https://better-census-api.com/";
  const request =
    url +
    "gettable?vintage=2018&dataset=acs5&group=" +
    group +
    "&state=36&county=*&geography=county&key=32dd72aa5e814e89c669a4664fd31dcfc3df333d&variable=" +
    variable;
  return request;
};

export const createChartRequest = (group: string, variable: string[]) => {
  const url = "https://better-census-api.com/";
  const request =
    url +
    "gettable?vintage=2018&dataset=acs1&group=" +
    group +
    "&state=36&county=*&geography=county&key=32dd72aa5e814e89c669a4664fd31dcfc3df333d&variable=" +
    variable;
  return request;
};

const roundUpShare = (val: number, interval: number) => {
  const ceil = Math.ceil(val * 10) / 10;
  if ((((ceil * 100) / interval) * 100) % 1 === 0) return ceil;
  else return ceil + interval;
};

export const drawChart = (data: AnyObject, target: string) => {
  var margin = { top: 20, right: 20, bottom: 30, left: 75 },
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand().range([height, 0]).padding(0.1);
  var x = d3.scaleLinear().range([0, width]);
  var svg = d3
    .select(target)
    .append("svg")
    //.attr("viewBox", [0, 0, width, height])
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const keys = Object.keys(data);
  const values = Object.values(data);
  // round x-axis up to nearest 0.2

  const xMax = roundUpShare(d3.max(values), 0.1);
  x.domain([0, xMax]);
  y.domain(keys);
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  // append the rectangles for the bar chart
  //svg
  //.selectAll(".bar")
  //.data(keys)
  //.enter()
  //.append("rect")
  //.attr("class", "bar")
  ////.attr("x", function(d) { return x(d.sales); })
  //.attr("width", function (d) {
  //return x(data[d]);
  //})
  //.attr("y", function (d) {
  //return y(d);
  //})
  //  .attr("height", y.bandwidth());

  let bar: d3.Selection<d3.BaseType | SVGRectElement, string, SVGGElement, unknown> =
  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(keys)
    .join("rect")
    .style("mix-blend-mode", "multiply")
    .attr("x", x(0))
    .attr("y", (d:string) => y(d) as number) // Second arg should be string, nummber, or boolean?
     .attr("width", (d) => x(data[d]) - x(0))
     .attr("height", y.bandwidth() - 1);

  // add the x Axis
  //.attr("transform", "translate(0," + height + ")");
  //    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));

  const xAxis = (g:any, x: d3.AxisScale<d3.AxisDomain>) =>
    g
      //    .attr("transform", `translate(0,${margin.bottom})`)
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(8, "f", "%"))
      .call((g:any) =>
        (g.selection ? g.selection() : g).select(".domain").remove()
      );

  const gx = svg.append("g").call(xAxis, x);

  return Object.assign(svg.node(), {
    update(data: {[key:string]: number}) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const t= svg.transition().duration(750);

      // only transition x axis at 0.2 intervals
      let maxValue = d3.max(values);
      if (!maxValue) maxValue=0;
      const xMax = roundUpShare(maxValue, 0.1);
      // gx.transition(t).call(xAxis, x.domain([0, xMax]));
      gx.transition()
      .transition()
      .duration(750)
      .call(xAxis, x.domain([0, xMax]));
      bar = bar.data(keys).call((bar:any) =>
        bar
          .transition(t)
          .attr("width", (d:string) => x(data[d]) - x(0))
          .attr("y", (d:string) => y(d))
      );
    },
  });
};

// function wrap(text, width) {
//   text.each(function () {
//     var text = d3.select(this),
//       words = text.text().split(/\s+/).reverse(),
//       word,
//       line = [],
//       lineNumber = 0,
//       lineHeight = 1.1, // ems
//       y = text.attr("y"),
//       dy = parseFloat(text.attr("dy")),
//       tspan = text
//         .text(null)
//         .append("tspan")
//         .attr("x", 0)
//         .attr("y", y)
//         .attr("dy", dy + "em");
//     while ((word = words.pop())) {
//       line.push(word);
//       tspan.text(line.join(" "));
//       if (tspan.node().getComputedTextLength() > width) {
//         line.pop();
//         tspan.text(line.join(" "));
//         line = [word];
//         tspan = text
//           .append("tspan")
//           .attr("x", 0)
//           .attr("y", y)
//           .attr("dy", ++lineNumber * lineHeight + dy + "em")
//           .text(word);
//       }
//     }
//   });
// }
