import React, { Component } from "react";
import { 
  Map, 
  TileLayer, 
  CircleMarker, 
  Popup,
  GeoJSON
} from "react-leaflet";
import {
  attribution,
  tileUrl,
  defaultMapState,
} from './utils/Utils';
import DemoMapTooltip from "./DemoMapTooltip";
import "leaflet/dist/leaflet.css";
import US_counties from './data/US_counties_5m'

console.log(US_counties)

function style(feature) {
    return {
        fillColor: getColor(feature.properties.COUNTY),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

export default class DemoMap extends Component {
    state = defaultMapState;
    componentDidMount() {
              this.setState({
                isLoaded: true,
                items: US_counties
              });
            }
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
        render() {
        const { isLoaded, items } = this.state;
         if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
            return this.props.mountains ? (
        <Map
            center={[this.state.lat, this.state.lng]}
            zoom={this.state.zoom}
            style={{ width: "100%", position: "absolute", top: 0, bottom: 0, zIndex: 500, }}
            updateWhenZooming={false}
            updateWhenIdle={true}
            preferCanvas={true}
            minZoom={this.state.minZoom}
        >
            <TileLayer
                attribution={attribution}
                url={tileUrl}
            />
          <GeoJSON
          data={items} 
          style={style}
        //  style={() => ({
        //    color: '#4a83ec',
        //    weight: 0.5,
        //    fillColor: getColor(items.features.properties.COUNTY),
        //    fillOpacity: 0.5,
        //  })}
          />
            {this.props.mountains.map((mountain, idx) => 
                <CircleMarker 
                    key={`mountain-${mountain.id}`}
                    color='black'
                    radius={15}
                    weight={2}
                    onClick={() => { 
                        this.setState({ activeMountain: mountain });
                    }}
                    center={mountain.point}>
                </CircleMarker>
            )}
            {this.state.activeMountain && <Popup
                position={this.state.activeMountain.point}
                onClose={() => {
                    this.setState({ activeMountain: null })
                }}
            >
                <DemoMapTooltip
                    mountain={this.state.activeMountain}
                />
            </Popup>}
        </Map>
        ) : (
            "Data is loading..."
        );
    }
}
}
