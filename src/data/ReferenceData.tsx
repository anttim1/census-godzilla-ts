export interface EducationCodes {
	C15003_001E: string;
	C15003_010E: string;
	C15003_011E: string;
	C15003_012E: string;
	C15003_013E: string;
	C15003_014E: string;
	C15003_015E: string;
	C15003_016E: string;
	C15003_017E: string;
	C15003_018E: string;
}
export interface RaceCodes {
	B03002_001E: string;
	B03002_003E: string;
	B03002_004E: string;
	B03002_005E: string;
	B03002_006E: string;
	B03002_007E: string;
	B03002_008E: string;
	B03002_009E: string;
	B03002_012E: string;
}
export interface RaceCategories {
	Asian: number;
	Black: number;
	Hispanic: number;
	Multi: number;
	Native: number;
	Other: number;
	Pacific: number;
	Total: number;
	White: number;
}
export interface EducationCategories {
	'1 Y College': number;
	'1+ Y College': number;
	Associates: number;
	'Bachelor\'s': number;
	Doctorate: number;
	GED: number;
	'High School': number;
	'Master\'s': number;
	Professional: number;
	Total: number;
}

export const raceVars = {
  B03002_001E: 'Total',
  B03002_003E: 'White',
  B03002_004E: 'Black',
  B03002_005E: 'Native',
  B03002_006E: 'Asian',
  B03002_007E: 'Pacific',
  B03002_008E: 'Other',
  B03002_009E: 'Multi',
  B03002_012E: 'Hispanic',
};
export const edVars = {
  C15003_001E: 'Total',
  C15003_010E: 'High School',
  C15003_011E: 'GED',
  C15003_012E: '1 Y College',
  C15003_013E: '1+ Y College',
  C15003_014E: 'Associates',
  C15003_015E: 'Bachelor\'s',
  C15003_016E: 'Master\'s',
  C15003_017E: 'Professional',
  C15003_018E: 'Doctorate',
};

type AnyObject = { [key: string]: any };

export class CensusSummary {
varMap: AnyObject;
data: AnyObject;
totals: AnyObject;
shares: AnyObject;
constructor(data: { [key: string]: EducationCategories }, varMap: { [key: string]: string }) {
  this.varMap = varMap;
  this.data = data;
  this.totals = {};
  this.shares = {};
}

sumObjects = <T extends AnyObject>(objs: T[]) => {
  return objs.reduce((acc: Partial<T>, val: T) => {
    if (!val) return acc;
    Object.keys(val).map<T>((k) => ((acc as AnyObject)[k] = (acc[k] || 0) + val[k]));
    return acc;
  }, {});
};


getTotals() {
  this.totals = this.sumObjects(Object.values(this.data));
  return Object.entries(this.totals).map(([k, v]) => (this.shares[k] = v / this.totals['Total']));
}


mapCodeToDescriptor(data: AnyObject) {
  return Object.assign(
  // @ts-ignore
    ...Object.entries(data).map(([k, v]) => ({
      [this.varMap[k]]: v,
    }))
  );
}

sumShares(varList: string[], newVar: string) {

  const newVal = Object.entries(this.shares).reduce((acc, [k, v]) => {
    if (varList.includes(k)) {
      acc += v ? v : 0;
      delete this.shares[k];
    }
    return acc;
  }, 0);
  this.shares[newVar] = newVal;
}



mapDataToDescriptor() {
  Object.entries(this.data).forEach(([k, v]) => {
    const newItem = this.mapCodeToDescriptor(v);
    this.data[k] = newItem;
  });
}

}
