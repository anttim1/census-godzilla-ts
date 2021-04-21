import React, { Component } from 'react';
import { GeoJSON } from 'react-leaflet';

class FluidGeoJSON extends Component {
   // constructor(props) {
   //     super(props);

       // this.state = {
       //     polygonFillColor: "pink",
       //     constant_range: [-10.0, 10.0],
       // }
//
 //       this.getColor = this.getColor.bind(this);
  //      this.style = this.style.bind(this);
   // }

   // getColor(d) {
   // };

   // style(feature) {
   // };

    render() {

        return (

                <GeoJSON data={this.data} style={this.style}></GeoJSON>
           )
       }
    }

    export default FluidGeoJSON;
