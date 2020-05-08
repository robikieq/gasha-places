import React, { Component } from "react";
import moment from 'moment';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

export class Map extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mapPosition: {
          lat: this.props.center.lat,
          lng: this.props.center.lng
        },
        mapLocations: this.props.locations,
        markerPosition: {
          lat: this.props.center.lat,
          lng: this.props.center.lng
        }
      };
    }

  render() {
    const WrappedMap = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          google={this.props.google}
          defaultZoom={this.props.zoom}
          defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}>
          {this.props.locations &&
            this.props.locations.map((place, i) => {
              let lat = parseFloat(place.latitude, 10);
              let lng = parseFloat(place.longitude, 10);
              return (
                <Marker
                  id={place.id}
                  key={place.id}
                  position={{ lat: lat, lng: lng }}
                  title={moment(place.time).format('DD/MM/YYYY')}>
                </Marker>
              );
            })
          }
        </GoogleMap>
      ))
    );

    return (
      <div>
        <WrappedMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: "100vh", width: "100%"}} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default Map;
