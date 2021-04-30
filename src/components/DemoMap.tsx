import React, { createRef, useState, useEffect } from 'react';
import { Map, TileLayer, Popup, GeoJSON, ZoomControl } from 'react-leaflet';
import { attribution, tileUrl, defaultMapState, colorRange } from '../utils/Utils';
import {
	addData,
	getIntersect,
	coordsToJSON,
	createRequest,
	fetchCensusData,
	//avgObjects,
	drawChart,
} from '../helpers/Helpers';
// import { censusRace } from "../data/ReferenceData.js";
import { scaleQuantile } from 'd3-scale';
// import DemoMapTooltip from "./DemoMapTooltip";
import DataContainer from './DataContainer';
import 'leaflet/dist/leaflet.css';
import US_counties from '../data/US_counties_5m.json';
//import US_tracts from "../data/";
import Legend from './Legend';
import { polygon } from '@turf/turf';

type CensusLabel = { [key: string]: string[] };

interface MapReference {
  current: any; // FIXME this should not by any type
}

const TitleBlock = ({ title }: {title: string}) => <div className="info title">{title}</div>;

//need to deal w negative values in data
const DemoMap = ({selectedVar}: {'selectedVar': string | null}) => {
	const testing = false;

	const [isLoaded, setIsLoaded] = useState();
	const [items, setItems] = useState();
	const [variables, setVariables] = useState();
	const [mapVariable, setMapVariable] = useState();
	const [groupInfo, setGroupInfo] = useState();
	const [colorScale, setColorScale] = useState();
	const [quantiles, setQuantiles] = useState();
	const [onScreen, setOnScreen] = useState();

	const mapRef: MapReference = createRef();
	const layerRef = createRef();

	const handleMove = () => {
		const map = mapRef.current.leafletElement;
		// const dataLayer = this.layerRef.current.leafletElement
		// dataLayer.clearLayers()
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
		const colorScale = scaleQuantile()
			.domain(onScreen.map((d) => d.properties.dataValue[mapVariable]))
			.range(colorRange);
		const quantiles = colorScale.quantiles(); //for legend
		setColorScale(() => colorScale);
		setQuantiles(quantiles);
	};

	useEffect(() => {
		setIsLoaded(true);
		if (testing) getMapData();
	}, []);

	useEffect(() => {
		//only run when variable has been selected
		if (selectedVar) {
			getMapData();
		}
	}, [selectedVar]);

	useEffect(() => {
		if (onScreen) {
			updateColors();
		}
	}, [onScreen]);

	const getMapData = () => {
		const group = selectedVar?.split('_')[0];
		const variable = selectedVar?.split('_')[1];
		setMapVariable(variable);
		const request = createRequest(group, variable);

		fetchCensusData(request).then((result) => {
			const items = addData(US_counties, result.geoIdValue);
			const coloScale = scaleQuantile()
				.domain(items.map((d) => d.properties.dataValue[variable]))
				.range(colorRange);
			setQuantiles(coloScale.quantiles());
			setVariables(result.variableInfo);
			setGroupInfo(result.groupInfo);
			setItems(items);
			console.log(items);
			setColorScale(() => coloScale);
		});
	};

	if (!isLoaded) {
		return <div>Loading...</div>;
	} else if (!items) {
		return (
			<Map
				ref={mapRef}
				center={[defaultMapState.lat, defaultMapState.lng]}
				zoom={defaultMapState.zoom}
				style={defaultMapState.mapStyle}
				updateWhenZooming={false}
				updateWhenIdle={true}
				preferCanvas={{'selectedVar':selectedVar}}
				minZoom={defaultMapState.minZoom}
				zoomControl={false}
				//onClick={}
			>
				<TileLayer attribution={attribution} url={tileUrl} />
				<ZoomControl position="topright" />
				<DataContainer />
			</Map>
		);
	} else {
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
							//? add variable to state to use here
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
				<Legend quantiles={quantiles} colorRange={colorRange} />
			</Map>
		) : (
			'Data is loading...'
		);
	}
};

export default DemoMap;
