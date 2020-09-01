import React, { Component } from "react";
import DemoMap from "./components/DemoMap";
import { mountains } from "./components/utils/Utils"
import "leaflet/dist/leaflet.css";
import Sidebar from "react-sidebar";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

class App extends Component {
  state = {
    mountains: mountains,
    sidebarOpen: true
  };
  constructor(props) {
      super(props);
      this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen(open) {
      this.setState({ sidebarOpen: open });
    }

  componentDidUpdate() {
      console.log("appitems",this.state.items)
  }

  render() {
    return (
      <div>
  <button onClick={() => this.onSetSidebarOpen(true)}>
          Open sidebar
        </button>
    <Sidebar
        sidebar={<DropdownButton id="dropdown-basic-button" title="Dropdown button">
  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
</DropdownButton> 
      }
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={{ sidebar: { background: "white", zIndex: 6000 } }}
   />
        <DemoMap
          mountains={this.state.mountains}
        />
      </div>
    );
  }
}
export default App;
