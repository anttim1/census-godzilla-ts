import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import React, { useState, useEffect } from "react";
import { drawChart } from "../helpers/Helpers";
import "swiper/swiper-bundle.css";
import "../css/styles.css";
//import "swiper/components/navigation/navigation.scss"; // Import Swiper styles
//import 'swiper/swiper.scss';
// install Swiper modules
SwiperCore.use([Navigation]);
const ChartSwiper = (props) => {
  const [raceChart, setRaceChart] = useState();
  const [edChart, setEdChart] = useState();

  useEffect(() => {
    if (props.data) {
      console.log("props", props);
      setRaceChart(drawChart(props.data.race, "#race-chart"));
      setEdChart(drawChart(props.data.education, "#education-chart"));
    }
  }, []);

  useEffect(() => {
    console.log("updating");
    if (raceChart) {
      console.log("updating2");
      raceChart.update(props.data.race);
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
    console.log(props);
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
          onInit={(swiper) => console.log("Swiper initialized!", swiper)}
          onSlideChange={(swiper) => {
            console.log("Slide index changed to: ", swiper.activeIndex);
          }}
          onReachEnd={() => console.log("Swiper end reached")}
        >
          <div className="swiper-wrapper">
            <div
              className="swiper-slide"
              id="race-chart"
              key={1}
              tag="li"
            ></div>
            <div
              className="swiper-slide"
              id="education-chart"
              key={2}
              tag="li"
            ></div>
          </div>
        </Swiper>
      </React.Fragment>
    );
  }
};

export default ChartSwiper;
