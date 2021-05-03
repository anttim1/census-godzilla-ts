// https://codesandbox.io/s/how-to-add-a-legend-to-the-map-using-react-leaflet-6yqs5?file=/src/Map.js
import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';

type Props = {
  quantiles:number[] | undefined;
  colorRange:string[];
  leaflet: any;
}
class Legend extends MapControl<Props> {
  //@ts-ignore
  createLeafletElement() {}

  //@ts-ignore
  legend = L.control({ position: 'bottomright' });

  createLegend = () => {

    const div = L.DomUtil.create('div', 'info legend');
    const grades = (this.props.quantiles)? this.props.quantiles:[];
    const colors = this.props.colorRange;
    const labels = [];
    let from;
    let to;

    for (let i = 0; i < grades?.length; i++) {
      from = Math.floor(grades[i]);
      to = grades[i + 1];
      labels.push(
        '<i style="background:' + colors[i] + '"></i> ' + from + (to ? '' : '+')
      );
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  componentDidMount() {

    const { map } = this.props.leaflet;
    this.legend.onAdd = this.createLegend;
    this.legend.addTo(map);
  }

  // this should only update the div
  componentDidUpdate() {
    const { map } = this.props.leaflet;
    map.removeControl(this.legend);
    this.legend.onAdd = this.createLegend;
    this.legend.addTo(map);
  }
}

export default withLeaflet(Legend);
