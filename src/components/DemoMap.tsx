import { Feature, Polygon, polygon, Properties } from '@turf/turf';
import { ScaleQuantile, scaleQuantile } from 'd3-scale';
import 'leaflet/dist/leaflet.css';
import React, { createRef, useEffect, useState } from 'react';
import { GeoJSON, Map, TileLayer, ZoomControl } from 'react-leaflet';
import US_counties from '../data/US_counties_5m.json';
import { addData, coordsToJSON, createRequest, fetchCensusData, getIntersect } from '../helpers/Helpers';
import { attribution, colorRange, defaultMapState, tileUrl } from '../utils/Utils';
import DataContainer from './DataContainer';
import Legend from './Legend';

interface MapReference {
	current: any;
}

interface QueryType {
	[key: string]: {
		name: string;
		type: string;
	};
}

const TitleBlock = ({ title }: { title: string }) => <div className="info title">{title}</div>;

const DemoMap = ({ selectedVar }: { selectedVar: string | null }) => {
  if (selectedVar === '') selectedVar = null;

  const [isLoaded, setIsLoaded] = useState<boolean>();
  const [items, setItems] = useState<Feature<Polygon, Properties>[]>([]);
  const [variables, setVariables] = useState<QueryType>({ noData: { name: '', type: 'int' } });
  const [mapVariable, setMapVariable] = useState<string>('');
  const [groupInfo, setGroupInfo] = useState({ vintage: 0, description: '', code: '' });
  const [colorScale, setColorScale] = useState<ScaleQuantile<string, never>>();
  const [quantiles, setQuantiles] = useState<number[]>();
  const [onScreen, setOnScreen] = useState<Feature<Polygon, Properties>[]>();

  const mapRef: MapReference = createRef();
  const layerRef = createRef<GeoJSON>();

  const handleMove = () => {
    const map = mapRef.current.leafletElement;
    const bounds = map.getBounds();
    const bounds_poly = coordsToJSON([
      [bounds._northEast.lat, bounds._northEast.lng],
      [bounds._southWest.lat, bounds._southWest.lng],
    ]);
    const bounds_json = polygon(bounds_poly);
    const polysOnScreen = getIntersect(bounds_json, items);
    setOnScreen(polysOnScreen);
  };

  const updateColors = () => {
    if (!onScreen) return;
    const colorScale = scaleQuantile<string>()
      .domain(onScreen.map((d) => d.properties?.dataValue[mapVariable]))
      .range(colorRange);

    const quantiles = colorScale.quantiles();
    setColorScale(() => colorScale);
    setQuantiles(quantiles);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const getMapData = () => {
      const group = selectedVar?.split('_')[0];
      const val = selectedVar?.split('_')[1];
      const groupVal = group ? group : '';
      const variable = val ? val : '';
      setMapVariable(variable);
      const request = createRequest(groupVal, variable);

      fetchCensusData(request).then((result) => {
        const items = addData(US_counties, result.geoIdValue);
        const coloScale = scaleQuantile<string>()
          .domain(items.map((d) => d.properties.dataValue[variable]))
          .range(colorRange);
        //setQuantiles(coloScale.quantiles());
        setVariables(result.variableInfo);
        setGroupInfo(result.groupInfo);
        setItems(items);
        setColorScale(() => coloScale);
      });
    };
    if (selectedVar) {
      getMapData();
    }
  }, [selectedVar]);

  useEffect(() => {
    if (onScreen) {
      updateColors();
    }
  }, [onScreen]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (colorScale) {
    return (
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
      >
        <TitleBlock
          title={
            groupInfo.vintage +
						' ' +
						groupInfo.description +
						' | ' +
						variables[Object.keys(variables)[0]].name.replaceAll('!!', ' ')
          }
        />
        <TileLayer attribution={attribution} url={tileUrl} />
        <ZoomControl position="topright" />
        <GeoJSON
          ref={layerRef}
          data={items}
          style={(item) => {
            return {
              fillColor: colorScale(item ? item.properties.dataValue[mapVariable] : '#EEE'),
              fillOpacity: 0.5,
              weight: 0.5,
              opacity: 0.7,
              color: 'white',
              dashArray: '3',
            };
          }}
        />
        <DataContainer onScreen={onScreen} />
        {<Legend quantiles={quantiles} colorRange={colorRange} />}
      </Map>
    );
  } else {
    return items ? (
      <Map
        ref={mapRef}
        center={[defaultMapState.lat, defaultMapState.lng]}
        zoom={defaultMapState.zoom}
        style={defaultMapState.mapStyle}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={defaultMapState.minZoom}
        zoomControl={false}
        onMoveEnd={handleMove}
      >
        <TileLayer attribution={attribution} url={tileUrl} />
        <ZoomControl position="topright" />
        {/* <DataContainer /> */}
      </Map>
    ) : (
      <h2>Data is loading...</h2>
    );
  }
};

export default DemoMap;
