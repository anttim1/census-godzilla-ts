import React, { createRef, useState, useEffect } from "react";
import { Map, TileLayer, Popup, GeoJSON, ZoomControl } from "react-leaflet";
import {
  attribution,
  tileUrl,
  defaultMapState,
  colorRange,
} from "../utils/Utils";
import {
  addData,
  getIntersect,
  coordsToJSON,
  createRequest,
} from "../helpers/Helpers";
import { scaleQuantile } from "d3-scale";
import DemoMapTooltip from "./DemoMapTooltip";
import "leaflet/dist/leaflet.css";
import US_counties from "../data/US_counties_5m";
import Legend from "./Legend";
import { polygon } from "@turf/turf";

const TitleBlock = ({ title }) => <div className="info title">{title}</div>;

const DemoMap = (props) => {
  const [isLoaded, setIsLoaded] = useState();
  const [items, setItems] = useState();
  const [variables, setVariables] = useState();
  const [groupInfo, setGroupInfo] = useState();
  const [colorScale, setColorScale] = useState("");
  const [quantiles, setQuantiles] = useState();
  const [error, setError] = useState();
  const [onScreen, setOnScreen] = useState();

  const mapRef = createRef();
  const layerRef = createRef();

  const fetchData = (request) =>
    fetch(request)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("fetched data");
          const items = addData(US_counties, result.geoIdValue);
          setVariables(result.variableInfo);
          setGroupInfo(result.groupInfo);
          setItems(items);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          setError(error);
        }
      );

  useEffect(() => {
    if (items) {
      const coloScale = scaleQuantile()
        .domain(items.map((d) => d.properties.dataValue))
        .range(colorRange);
      setQuantiles(coloScale.quantiles());
      setColorScale(coloScale);
    }
  }, [items]);

  const handleMove = () => {
    const map = mapRef.current.leafletElement;
    // const dataLayer = this.layerRef.current.leafletElement
    // dataLayer.clearLayers()
    const bounds = map.getBounds();
    const geo = items;
    const bounds_poly = coordsToJSON([
      [bounds._northEast.lat, bounds._northEast.lng],
      [bounds._southWest.lat, bounds._southWest.lng],
    ]);
    const bounds_json = polygon(bounds_poly);
    const polysOnScreen = getIntersect(bounds_json, geo);
    setOnScreen(polysOnScreen);
  };

  const updateColors = () => {
    const colorScale = scaleQuantile()
      .domain(onScreen.map((d) => d.properties.dataValue))
      .range(colorRange);
    const quantiles = colorScale.quantiles(); //for legend
    setColorScale(colorScale);
    setQuantiles(quantiles);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    //only run when variable has been selected
    if (props.selectedVar) {
      const group = props.selectedVar.split("_")[0];
      const variable = props.selectedVar.split("_")[1];
      const request = createRequest(group, variable);
      fetchData(request);
    }
    //?missing dependency
  }, [props]);

  useEffect(() => {
    if (onScreen) {
      console.log(onScreen);
      //updateColors();
    }
  }, [onScreen]);
  //  componentDidUpdate(prevProps, prevState) {
  //if (this.state.onScreen !== prevState.onScreen) {
  //this.updateColors();
  //} else if (this.props.selectedVar !== prevProps.selectedVar) {
  //const request = this.createRequest();
  //this.fetchData(request);
  //}
  //  }

  console.log("in body", colorScale);
  if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (!items) {
    console.log("map only");
    return (
      <Map
        ref={mapRef}
        center={[defaultMapState.lat, defaultMapState.lng]}
        zoom={defaultMapState.zoom}
        style={defaultMapState.mapStyle}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={props}
        minZoom={defaultMapState.minZoom}
        zoomControl={false}
        //onClick={}
      >
        <TileLayer attribution={attribution} url={tileUrl} />
        <ZoomControl position="topright" />
      </Map>
    );
  } else {
    console.log("with items");
    return items && colorScale ? (
      <Map
        ref={mapRef}
        center={[defaultMapState.lat, defaultMapState.lng]}
        zoom={defaultMapState.zoom}
        style={defaultMapState.mapStyle}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={defaultMapState.minZoom}
        onMoveEnd={handleMove}
        zoomControl={false}
        //onClick={}
      >
        <TitleBlock
          title={
            groupInfo.vintage +
            " " +
            groupInfo.description +
            " " +
            variables[Object.keys(variables)[0]].name
          }
        />
        <TileLayer attribution={attribution} url={tileUrl} />
        <ZoomControl position="topright" />
        <GeoJSON
          ref={layerRef}
          data={items}
          style={() => {
            console.log(colorScale);
            return {
              fillColor: colorScale(
                items ? items.properties.dataValue : "#EEE"
              ),
              fillOpacity: 0.5,
              weight: 0.5,
              opacity: 0.7,
              color: "white",
              dashArray: "3",
            };
          }}
        />
        {quantiles && <Legend quantiles={quantiles} colorRange={colorRange} />}
      </Map>
    ) : (
      "Data is loading..."
    );
  }
};

export default DemoMap;
