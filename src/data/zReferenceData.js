export const raceVars = {
  B03002_003E: "White",
  B03002_004E: "Black",
  B03002_005E: "Native",
  B03002_006E: "Asian",
  B03002_007E: "Pacific",
  B03002_008E: "Other",
  B03002_009E: "Multi",
  B03002_012E: "Hispanic",
};

export const edVars = {
  C15003_010E: "High School",
  C15003_011E: "GED",
  C15003_012E: "1 Y College",
  C15003_013E: "1+ Y College",
  C15003_014E: "Associates",
  C15003_015E: "Bachelor's",
  C15003_016E: "Master's",
  C15003_017E: "Professional",
  C15003_018E: "Doctorate",
};

export const sumObjects = (objs) => {
  return objs.reduce((acc, val) => {
    for (let k in val) {
      if (val.hasOwnProperty(k)) acc[k] = (acc[k] || 0) + val[k];
    }
    return acc;
  }, {});
};

export const avgOfObjects = (objs) => {
  const sum = sumObjects(objs);
  Object.keys(sum).forEach((key) => (sum[key] = sum[key] / objs.length));
  return sum;
};

export class CensusSummary {
  constructor(data, varMap) {
    this.varMap = varMap;
    this.data = data;
    this.summaryData = {};
  }

  calcAverage() {
    this.summaryData = avgOfObjects(Object.values(this.data));
  }
  //need to check if vars exist in data and error if not
  mapCodeToDescriptor(data) {
    return Object.assign(
      ...Object.entries(data).map(([k, v]) => ({
        [this.varMap[k]]: v,
      }))
    );
    //    return Object.entries(this.summaryData).map(
    //([k, v]) => (this.summaryData[k] = 100)
    //    );
  }

  sumVars(data, varList, newVar) {
    data[newVar] = 0;
    Object.entries(data).forEach(([k, v]) => {
      if (varList.includes(k)) {
        data[newVar] += v;

        console.log("sumvalue", data);
      }
    });
    return data;
  }

  sumDataVars(varList, newVar) {
    Object.entries(this.data).forEach(([k, v]) => {
      this.sumVars(v, varList, newVar);
    });
  }

  delVars(data, varList) {
    Object.keys(data).forEach((item) => {
      if (varList.includes(item)) delete data[item];
    });
  }

  mapDataToDescriptor() {
    Object.entries(this.data).forEach(([k, v]) => {
      const newItem = this.mapCodeToDescriptor(v);
      this.data[k] = newItem;
    });
  }

  delDataVars(varList) {
    Object.values(this.data).forEach((item) => {
      this.delVars(item, varList);
    });
  }
}
