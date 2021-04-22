import { intersect } from "@turf/turf";

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

export const addData = (geo, data) => {
  const newFeatures = [];
  for (var i in geo.features) {
    const newFeature = geo.features[i];
    const geoId = geo.features[i].properties.GEO_ID.split("US")[1];
    if (data[geoId]) {
      const newData = data[geoId];
      const newKey = Object.keys(newData);
      const newValue = newData[newKey];
      newFeature.properties["dataValue"] = newValue;
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
    "&state=36,34,42&county=*&geography=county&key=32dd72aa5e814e89c669a4664fd31dcfc3df333d&variable=" +
    variable;
  return request;
};
