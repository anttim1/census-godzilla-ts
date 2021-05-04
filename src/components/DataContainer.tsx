import '../css/dataContainer.css';
import '../css/styles.css';

import React, { useEffect, useState } from 'react';
import { CensusSummary, edVars, raceVars, EducationCategories } from '../data/ReferenceData';
import { createChartRequest, fetchCensusData } from '../helpers/Helpers';
import ChartSwiper from './Swiper';
import { Feature, Polygon, Properties } from '@turf/turf';

interface Props {
  onScreen: Feature<Polygon, Properties>[] | undefined;
	setShowDataContainer: React.Dispatch<React.SetStateAction<Boolean>>;
	showDataContainer: Boolean;
};

type AnyObject = { [key: string]: any };

// Function that makes calls to /helpers. Kind of like a Summary class
const createSummaryData = (
	data: { [key: string]: EducationCategories },
	varMap: AnyObject,
	sumVars: { [key: string]: string[] },
	reCalc?: boolean
) => {
	const summary = new CensusSummary(data, varMap);
	if (!reCalc) summary.mapDataToDescriptor();
	summary.getTotals();
	Object.entries(sumVars).forEach(([key, valArr]) => {
		summary.sumShares(valArr, key);
	});
	return summary;
};

const DataContainer = ({ onScreen, setShowDataContainer, showDataContainer }: Props) => {
	const [summary, setSummary] = useState({ race: {}, education: {} });
	const [data, setData] = useState<AnyObject>({});
	const [ethnicDataLoad, setEthnicDataLoad] = useState<Boolean>(false);
	const [educationDataLoad, setEducationDataLoad] = useState<Boolean>(false);

	useEffect(() => {
		const raceTables = Object.keys(raceVars).map((item) => item.split('_')[1]);
		const raceRequest = createChartRequest('B03002', raceTables);
		const edTables = Object.keys(edVars).map((item) => item.split('_')[1]);
		const edRequest = createChartRequest('C15003', edTables);

		fetchCensusData(raceRequest).then((result) => {
			const raceSummary = createSummaryData(result.geoIdValue, raceVars, {
				Other: ['Native', 'Pacific', 'Multi', 'Other'],
			});
			delete raceSummary.shares['Total'];
			setData((prevData) => ({ ...prevData, race: raceSummary.data }));
			setSummary(() => ({
				...summary,
				race: raceSummary.shares,
			}));
			setEthnicDataLoad(true);
		});

		fetchCensusData(edRequest).then((result) => {
			const edSummary = createSummaryData(result.geoIdValue, edVars, {
				'High School': ['High School', 'GED'],
				'Some College': ['1 Y College', '1+ Y College', 'Associates'],
				Graduate: ["Master's", 'Professional', 'Doctorate'],
			});
			edSummary.shares['No Degree'] =
				edSummary.shares['Total'] -
				edSummary.shares['High School'] -
				edSummary.shares['Some College'] -
				edSummary.shares['Graduate'] -
				edSummary.shares["Bachelor's"];
			delete edSummary.shares['Total'];
			setData((prevData) => ({ ...prevData, education: edSummary.data }));
			setSummary((prevData) => ({
				...prevData,
				education: edSummary.shares,
			}));
			setEducationDataLoad(true);
		});
	}, []);

	useEffect(() => {
		if (onScreen && Object.keys(data).length) {
			const onScreenGeoIDs = [];
			for (const item of onScreen) {
				const geoId = item.properties?.GEO_ID.split('US')[1];
				onScreenGeoIDs.push(geoId);
			}
			const onScreenRace = Object.assign(
				{},
				...onScreenGeoIDs.map((key) => ({
					[key]: data.race ? data.race[key] : {},
				}))
			);

			const onScreenEd = Object.assign(
				{},
				...onScreenGeoIDs.map((key) => ({
					[key]: data.education ? data.education[key] : {},
				}))
			);
			const raceSummary = createSummaryData(
				onScreenRace,
				raceVars,
				{
					Other: ['Native', 'Pacific', 'Multi', 'Other'],
				},
				true
			);
			delete raceSummary.shares['Total'];
			setSummary((prevData) => ({ ...prevData, race: raceSummary.shares }));

			const edSummary = createSummaryData(
				onScreenEd,
				edVars,
				{
					'High School': ['High School', 'GED'],
					'Some College': ['1 Y College', '1+ Y College', 'Associates'],
					Graduate: ["Master's", 'Professional', 'Doctorate'],
				},
				true
			);
			edSummary.shares['No Degree'] =
				edSummary.shares['Total'] -
				edSummary.shares['High School'] -
				edSummary.shares['Some College'] -
				edSummary.shares['Graduate'] -
				edSummary.shares["Bachelor's"];
			delete edSummary.shares['Total'];
			setSummary((prevData) => ({ ...prevData, education: edSummary.shares }));
		}
	}, [onScreen]);

	return onScreen && ethnicDataLoad && educationDataLoad ? (
		<div id="dataContainer" className={showDataContainer ? 'dataContainer' : 'hidden'}>
			<ChartSwiper data={summary} setShowDataContainer={setShowDataContainer} />
		</div>
	) : (
		<h3>Data is loading</h3>
	);
};

export default DataContainer;
