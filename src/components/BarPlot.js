import "../css/dataContainer.css";
import "../css/styles.css";
import React, { useState, useEffect } from "react";
import { fetchCensusData, createRequest, drawChart } from "../helpers/Helpers";
import { raceVars, CensusSummary } from "../data/ReferenceData.js";

const createSummaryData = (data, vars) => {
  const summary = new CensusSummary(data, vars);
  summary.mapDataToDescriptor();
  summary.sumDataVars(["Native", "Pacific", "Multi"], "Other");
  summary.delDataVars(["Native", "Pacific", "Multi"]);
  summary.calcAverage();
  return summary;
};

const DataContainer = (props) => {
  const [raceData, setRaceData] = useState();
  const [raceChart, setRaceChart] = useState();
  const [incomeData, setIncomeData] = useState();
  const [incomeChart, setIncomeChart] = useState();

  };
  useEffect(() => {
    const raceTables = Object.keys(raceVars);
    const splitTables = raceTables.map((item) => item.split("_")[1]);
    console.log("split", splitTables);
    const raceRequest = createRequest("B03002", splitTables);
    const incomeRequest = createRequest("B19013", "001E");

    //?concurrent fetch doubles data in first request
    fetchCensusData(raceRequest).then((result) => {
      const raceSummary = createSummaryData(result.geoIdShare, raceVars);
      setRaceData(raceSummary.data);
      setRaceChart(drawChart(raceSummary.summaryData, "#dataContainer"));
    });

    fetchCensusData(incomeRequest).then((result) => {
      const incomeSummary = createSummaryData(result.geoIdValue, {
        B19013_001E: "Median Household Income",
      });
      setIncomeData(incomeSummary.data);
      setIncomeChart(drawChart(incomeSummary.summaryData, "#dataContainer"));
    });
  }, []);

  useEffect(() => {
    if (props.onScreen) {
      const onScreenGeoIDs = [];
      for (let item of props.onScreen) {
        const geoId = item.properties.GEO_ID.split("US")[1];
        onScreenGeoIDs.push(geoId);
      }
      const onScreenData = Object.assign(
        ...onScreenGeoIDs.map((key) => ({
          [key]: raceData[key],
        }))
      );
      const raceSum = new CensusSummary(onScreenData);
      raceSum.calcAverage();
      raceChart.update(raceSum.summaryData);
    }
  }, [props.onScreen]);

  return (
    <div id="dataContainer" className="dataContainer">
      <button onClick={console.log("clicked")}>+</button>
    </div>
  );
};

export default DataContainer;
