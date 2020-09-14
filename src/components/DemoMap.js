import React, { Component,  createRef } from "react";
import { 
  Map, 
  TileLayer, 
  Popup,
  GeoJSON,
  ZoomControl,
} from "react-leaflet";
import {
  attribution,
  tileUrl,
  defaultMapState,
  colorRange
} from './utils/Utils';
import {
  addData,
  getIntersect,
  coordsToJSON
} from './helpers/Helpers';
import {scaleQuantile} from "d3-scale";
import DemoMapTooltip from "./DemoMapTooltip";
import "leaflet/dist/leaflet.css";
import US_counties from './data/US_counties_5m'
import Legend from "./Legend"
import { polygon } from '@turf/turf'

const TitleBlock = ({title}) => (
        <div className="info title">
            {title}
      </div>
  )

export default class DemoMap extends Component {
    state = {}     // needs to initialize, no state needed at init

    mapRef = createRef()
    layerRef = createRef()

    fetchData = (request) => fetch(request)
              .then(res => res.json())
              .then(result => {
                  const items = addData(US_counties,result.geoid)
                  const colorScale = scaleQuantile()
                   .domain(items.map(d => d.properties.dataValue))
                   .range(colorRange);
                  this.setState({
                    isLoaded: true,
                    items: items,
                    variables: result.variables,
                    groupInfo: result.group,
                    colorScale: colorScale,
                    quantiles: colorScale.quantiles()
                  });
                },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error)
          this.setState({
            isLoaded: true,
            error
          });
        }
              )



    handleMove = () => { 
        const map = this.mapRef.current.leafletElement
       // const dataLayer = this.layerRef.current.leafletElement
       // dataLayer.clearLayers()
        const bounds = map.getBounds()
        const geo = this.state.items
        const bounds_poly = coordsToJSON([[bounds._northEast.lat, bounds._northEast.lng], [bounds._southWest.lat, bounds._southWest.lng]])  
        const bounds_json =  polygon(bounds_poly)
        const polysOnScreen = getIntersect(bounds_json, geo)
        this.setState({
            onScreen: polysOnScreen,
        })
  } 

    updateColorScale = () => {
        const colorScale = scaleQuantile()
            .domain(this.state.onScreen.map(d => d.properties.dataValue))
            .range(colorRange);
        const quantiles = colorScale.quantiles()    //for legend
            this.setState({
                colorScale: colorScale,
                quantiles: quantiles,
                })
    }

    getRequest = () => {
        const group = this.props.selectedCol.split("_")[0]
        const column = this.props.selectedCol.split("_")[1]
        const url =  "https://better-census-api.com/"
        const request = url + "gettable?vintage=2018&dataset=acs5&group="+group+"&state=36,34,42&county=*&geography=county&key=32dd72aa5e814e89c669a4664fd31dcfc3df333d&variable=" + column
        return request
    }

    componentDidMount() {
                  this.setState({
                    isLoaded: true,
       })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.onScreen !== prevState.onScreen) {
            this.updateColorScale()
         } else if (this.props.selectedCol !== prevProps.selectedCol) {
            const request = this.getRequest()
            this.fetchData(request)
                }
        }    

    render() {
    const isLoaded = this.state.isLoaded
    const items = this.state.items
    const variables = this.state.variables
    const groupInfo = this.state.groupInfo
     if (!isLoaded) {
      return <div>Loading...</div>;
        } else if (!items) {
        console.log("map only")
        return (   
    <Map
        ref={this.mapRef}
        center={[defaultMapState.lat, defaultMapState.lng]}
        zoom={defaultMapState.zoom}
        style={defaultMapState.mapStyle}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={defaultMapState.minZoom}
        zoomControl={false}
        //onClick={}
    >
        <TileLayer
            attribution={attribution}
            url={tileUrl}
        />
        <ZoomControl
            position="topright"
        />
    </Map> 
        )} else {
        console.log("with items")
        return items ? (        
    <Map
        ref={this.mapRef}
        center={[defaultMapState.lat, defaultMapState.lng]}
        zoom={defaultMapState.zoom}
        style={defaultMapState.mapStyle}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={defaultMapState.minZoom}
        onMoveEnd={this.handleMove}
        zoomControl={false}
        //onClick={}
    >
        <TitleBlock
            title = {groupInfo.vintage + " " + groupInfo.description + " " + variables[Object.keys(variables)[0]].name} 
        />
        <TileLayer
            attribution={attribution}
            url={tileUrl}
        />
        <ZoomControl
            position="topright"
        />
      <GeoJSON
      ref={this.layerRef}
      data={items} 
    //  style={style}
      style={(items) => ({
                fillColor: this.state.colorScale(items ? items.properties.dataValue : "#EEE"),
                fillOpacity: 0.5, 
                weight: 0.5,
                opacity: 0.7,
                color: 'white',
                dashArray: '3',
      })}
      />
      <Legend 
      quantiles={this.state.quantiles}
      colorRange={colorRange}
        /> 
    </Map>
    ) : (
        "Data is loading..."
    );
}
}
}
