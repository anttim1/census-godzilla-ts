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

console.log("im fluid")
        return (
                
                <GeoJSON data={this.props.data} style={this.props.style}></GeoJSON>
           )
       }
    }

    export default FluidGeoJSON;
