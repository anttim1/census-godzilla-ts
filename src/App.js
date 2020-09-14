import React, { Component } from "react";
import DemoMap from "./components/DemoMap";
import "leaflet/dist/leaflet.css";
import Sidebar from "react-sidebar";
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Typeahead } from 'react-bootstrap-typeahead'
import './css/typeahead.css';

const censusKey = "32dd72aa5e814e89c669a4664fd31dcfc3df333d" 

const acsCall = "https://better-census-api.com/finddataset?vintage=*&search=ACS,detailed%20tables"
const tablesCall = "https://better-census-api.com/findtable?search=*&datasetid=$id"

const columnsCall = "https://better-census-api.com/gettable?vintage=2018&dataset=acs5&state=10&county=*&group=$group&variable=*&geography=tract&key=$key"

const matchAndStrip = (str, regex, strip, rep) => {
    if (regex) { 
    var match = str.match(regex)
    } else {
        var match = 1
    }
    if (match) {
        for (let i=0; i<strip.length; i++) {
             str = str.replace(strip[i], rep[i])
        }
    return str
    }
}


class App extends Component {
  state = {
    sidebarOpen: true,
    tables: [],
    columns: [],
    selectedCol: null 
  };

  constructor(props) {
      super(props);
      this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

  onSetSidebarOpen(open) {
      this.setState({ sidebarOpen: open });
    }

  getTables = (e) => {
    fetch(tablesCall.replace('$id', e.target.value))
      .then(res => res.json())
      .then((result) => {
          this.setState({tables: result.Groups})
          console.log(result.Groups)
    }).catch(error => {
    console.log(error);
    });
  }

  getColumns = (e) => {
    if (e[0] !== undefined) {
      fetch(columnsCall.replace('$group', Object.keys(e[0])[0]).replace('$key', censusKey))
        .then(res => res.json())
        .then((result) => {
          this.setState({columns: result.variables})
          console.log(result.variables)
        }).catch(error => {
          console.log(error);
        });
    }
  }

  setColumn = (e) => {
    this.setState({selectedCol: e[0]}) 
  }

  componentDidMount () {
    fetch(acsCall)
      .then(res => res.json())
      .then(data => {
        let datasetsAPI = data.map(d => {
            return {id: d.Dataset_ID, vintage: d.Vintage, title: d.Title}
        });
    this.setState({
      isLoaded: true,
      datasets: [{vintage: '', title: '(Select dataset)'}].concat(datasetsAPI)
      });
    }).catch(error => {
    console.log(error);
    });
  }

  render() {
    const { isLoaded, datasets } = this.state;
     if (!isLoaded) {
      return <div>Loading...</div>;
        } else {
    return (
      <>
<Form.Group >
  <Form.Control size="sm" as="select"
   onChange={this.getTables.bind()}
  >
    {datasets.map((dataset, idx) => <option key={idx} value={dataset.id}>{dataset.vintage+" "+dataset.title}</option>)}
   
</Form.Control>
  <br />
<Typeahead size="small"
  onChange={this.getColumns.bind()}
  labelKey={option => { return option[Object.keys(option)[0]]}}
  options={this.state.tables}
/>
  <br />
<Typeahead size="small"
  onChange={this.setColumn.bind()}
  filterBy={(option, props) => {return this.state.columns[option].name.match(/^Estimate!!/i)}}
    labelKey={option => {return this.state.columns[option].name.replace(/Estimate!!Total!!/g,"").replace(/!!/g,"|")}} 
    options={Object.keys(this.state.columns)}
/>
  <br />
  <Form.Control size="sm" as="select"
      onChange={this.setColumn.bind()}>
      {Object.keys(this.state.columns).filter((column) => {return this.state.columns[column].name.match(/^Estimate!!/i)}).map((column, idx) => <option key={idx} value={column}>{matchAndStrip(this.state.columns[column].name, /^Estimate!!/i, [/!!/g,/Estimate/g,/Total/g], [" | ","",""])}</option>)}
  </Form.Control>
</Form.Group>
      }
        <DemoMap
          selectedCol={this.state.selectedCol}
        />
  </>
    );
  }
}
}
export default App;
