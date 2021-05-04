import 'swiper/swiper-bundle.css';
import '../css/styles.css';

import React, { useEffect, useState } from 'react';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper } from 'swiper/react';

import { drawChart } from '../helpers/Helpers';
import ReactDOM from 'react-dom';

//import "swiper/components/navigation/navigation.scss"; // Import Swiper styles
//import 'swiper/swiper.scss';
// install Swiper modules

type AnyObject = { [key: string]: any };

interface SummeryData {
	data: {
		race: AnyObject;
		education: AnyObject;
	};
  setShowDataContainer: React.Dispatch<React.SetStateAction<Boolean>>
}

SwiperCore.use([Navigation]);
const ChartSwiper = (props: SummeryData) => {
  const [raceChart, setRaceChart] = useState<AnyObject>();
  const [edChart, setEdChart] = useState<AnyObject>();

  useEffect(() => {
    if (props.data) {
      setRaceChart(drawChart(props.data.race, '#race-chart'));
      setEdChart(drawChart(props.data.education, '#education-chart'));
    }
  }, []);

  useEffect(() => {
    if (raceChart) {
      // Here we take steps to correct any errors in the data before we pass it to the chart
      const currentValue = Object.assign(
        {
          Asian: 0,
          Black: 0,
          Hispanic: 0,
          Other: 0,
          White: 0,
        },
        props.data.race
      );
      let totalCount = 0;
      for (const key in currentValue) {
        if (!currentValue[key]) currentValue[key] = 0; // Correct any null or undefined values
        totalCount += currentValue[key];
      }
      raceChart.update(currentValue);
      // If total count is zero, we're not graphing anything, so unmount the DataContainer
      if (totalCount === 0) props.setShowDataContainer(false);
    }

    if (edChart) {
      // Here we take steps to correct any errors in the data before we pass it to the chart
      const currentValue = Object.assign(
        {
          'Bachelor\'s': 0,
          'Graduate': 0,
          'High School': 0,
          'No Degree': 0,
          'Some College': 0,
        },
        props.data.education
      );
      for (const key in currentValue) {
        if (!currentValue[key]) currentValue[key] = 0;
      }
      edChart.update(currentValue);
    }
  }, [props.data]);

  if (props) {
    return (
      <React.Fragment>
        <Swiper
          id="main"
          tag="section"
          wrapperTag="ul"
          navigation
          pagination
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            console.log('Slide index changed to: ', swiper.activeIndex);
          }}
          onReachEnd={() => console.log('Swiper end reached')}
        >
          <div className="swiper-wrapper">
            <div className="swiper-slide" id="race-chart" key={1} data-tag="li">
              <div className="swiper-title">Ethnicity</div>
            </div>
            <div className="swiper-slide" id="education-chart" key={2} data-tag="li">
              {' '}
              <div className="swiper-title">Education</div>
            </div>
          </div>
        </Swiper>
      </React.Fragment>
    );
  } else return null;
};

export default ChartSwiper;
