import 'swiper/swiper-bundle.css';
import '../css/styles.css';

import React, { useEffect, useState } from 'react';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper } from 'swiper/react';

import { drawChart } from '../helpers/Helpers';

//import "swiper/components/navigation/navigation.scss"; // Import Swiper styles
//import 'swiper/swiper.scss';
// install Swiper modules

type AnyObject = { [key: string]: any };

interface SummeryData {
	data: {
		race: AnyObject;
		education: AnyObject;
	};
}

SwiperCore.use([Navigation]);
const ChartSwiper = (props: SummeryData) => {
	const [raceChart, setRaceChart] = useState<AnyObject>();
	const [edChart, setEdChart] = useState<AnyObject>();

	useEffect(() => {
		if (props.data) {
			console.log('props', props);
			setRaceChart(drawChart(props.data.race, '#race-chart'));
			setEdChart(drawChart(props.data.education, '#education-chart'));
		}
	}, []);

	useEffect(() => {
		console.log('updating');
		if (raceChart) {
			console.log(props.data.race);
			raceChart.update(props.data.race);
		}
		if (edChart) {
			console.log(props.data.education);
			edChart.update(props.data.education);
		}
	}, [props.data]);

	//  useEffect(() => {
	//console.log(props.closeChart);
	//props.closeChart
	//? setRaceChart(null, "#race-chart")
	//: setRaceChart(drawChart(props.data.race, "#race-chart"));
	//  }, [props.closeChart]);

	if (props) {
		return (
			<React.Fragment>
				<Swiper
					id="main"
					//thumbs={{ swiper: thumbsSwiper }}
					//controller={{ control: controlledSwiper }}
					tag="section"
					wrapperTag="ul"
					navigation
					pagination
					spaceBetween={0}
					slidesPerView={1}
					onInit={(swiper) => console.log('Swiper initialized!', swiper)}
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
