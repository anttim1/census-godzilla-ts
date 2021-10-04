import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/typeahead.css';

import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import Form from 'react-bootstrap/Form';

import Map from './components/Map';
import US_state_FIPS from './data/US_state_FIPS.json';

const censusKey = '32dd72aa5e814e89c669a4664fd31dcfc3df333d';

const acsCall =
  'https://better-census-api.com/finddataset?vintage=*&search=ACS,detailed%20tables';
const tablesCall =
  'https://better-census-api.com/findtable?search=*&datasetid=$id';

const variablesCall =
  'https://better-census-api.com/gettable?vintage=$vintage&dataset=acs5&state=10&county=*&group=$group&variable=*&geography=tract&key=$key';

const App = () => {
  interface DatasetParameters {
    id: number;
    vintage: number;
    title: string;
  }
  interface InitialQueryType {
    name: string;
    type: string;
  }
  const [vintage, setVintage] = useState<string>('0');
  const [states, setStates] = useState<string>('');
  const [tables, setTables] = useState<CensusLabel[]>([]);
  const [variables, setVariables] = useState<CensusLabel[]>([]);
  const [selectedVar, setSelectedVar] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [datasets, setDatasets] = useState<DatasetParameters[]>([]);

  type CensusLabel = { [key: string]: string[] };

  interface TableCategories {
    AccessURL: string;
    Dataset: string;
    Groups: { [key: string]: string }[];
  }
  const getTables = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value.split(':')[0];
    const vintage = e.target.value.split(':')[1];
    setVintage(vintage);
    fetch(tablesCall.replace('$id', id))
      .then((res) => res.json())
      .then((result: TableCategories) => {
        setTables(
          result.Groups.flatMap((data: { [key: string]: string }) =>
            Object.entries(data).map(([key, value]) => ({ [key]: [value] }))
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getVariables = (e: CensusLabel[]): void => {
    if (e[0] !== undefined) {
      console.log(vintage);
      fetch(
        variablesCall
          .replace('$group', Object.keys(e[0])[0])
          .replace('$key', censusKey)
          .replace('$vintage', vintage)
      )
        .then((res) => res.json())
        .then(
          (result: { variableInfo: { [key: string]: InitialQueryType } }) => {
            setVariables(
              Object.entries(result.variableInfo).map(([key, value]) => ({
                [key]: Object.values(value),
              }))
            );
          }
        )
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('can\'t get variables');
    }
  };

  const setVariable = (e: CensusLabel[]) => {
    if (!Array.isArray(e) || !e?.length) return setSelectedVar('');
    const selectedQuery = Object.keys(e[0])[0];
    setSelectedVar(selectedQuery);
  };

  interface UnprocessedCensusYearsData {
    Dataset_ID: number;
    Title: string;
    Vintage: number;
  }

  useEffect(() => {
    fetch(acsCall)
      .then((res) => res.json())
      .then((data: UnprocessedCensusYearsData[]) => {
        const datasetsAPI = data.map((d) => {
          return { id: d.Dataset_ID, vintage: d.Vintage, title: d.Title };
        });
        setIsLoaded(true);
        setDatasets(datasetsAPI);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <div className="form-container">
          <Form.Group>
            <Form.Control
              id="states"
              size="sm"
              as="select"
              multiple={true}
              onChange={(e) => {
                const target = e.target as HTMLSelectElement;
                const options = target.selectedOptions;
                const stateCodes = [];
                for (let i = 0; i < options.length; i++) {
                  stateCodes.push(options[i].value);
                }
                setStates(stateCodes.join(','));
              }}
            >
              <option value="" disabled selected>
                Select states
              </option>
              {US_state_FIPS.map((state, idx) => (
                <option key={idx} value={state.st}>
                  {state.stname}
                </option>
              ))}
            </Form.Control>
            <br />
            <Form.Control
              id="dataset"
              size="sm"
              as="select"
              onChange={getTables}
            >
              <option value="" disabled selected>
                Select dataset
              </option>
              {datasets.map((dataset, idx) => (
                <option key={idx} value={dataset.id + ':' + dataset.vintage}>
                  {dataset.vintage + ' ' + dataset.title}
                </option>
              ))}
            </Form.Control>
            <br />
            {
              <Typeahead
                id="group"
                size="small"
                onChange={getVariables}
                labelKey={(option) => {
                  return option[Object.keys(option)[0]][0];
                }}
                placeholder="Type to search..."
                options={tables}
              />
            }
            <br />
            {
              <Typeahead
                id="variable"
                size="small"
                onChange={setVariable}
                filterBy={(option) => {
                  return !!option[Object.keys(option)[0]][0].match(
                    /^Estimate!!/i
                  );
                }}
                labelKey={(option) => {
                  return option[Object.keys(option)[0]][0]
                    .replace(/Estimate!!Total!!/g, '')
                    .replace(/!!/g, '|');
                }}
                placeholder="Type to search..."
                options={variables}
              />
            }
          </Form.Group>
        </div>
        <Map selectedVar={selectedVar} vintage={vintage} states={states} />
      </>
    );
  }
};

export default App;
