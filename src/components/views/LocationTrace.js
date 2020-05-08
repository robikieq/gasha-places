import React, { Component } from 'react'
import Papa from "papaparse";
import moment from 'moment';
import Select from 'react-select'
import {
    Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Map from '../maps/Map';

import './LocationTrace.css';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }));
export class LocationTrace extends Component {
    constructor(props) {
        super(props)

        this.state = {
            locationData: [],
            locationDataByDate: [],
            selectedDateLocationData: []
        }
        this.updateData = this.updateData.bind(this);
    }

    handleFilesUpload = event => {
      console.log(event.target.files[0]);
      Papa.parse(event.target.files[0], {
        complete: this.updateData,
        dynamicTyping: true,
        header: true
      });
    };

    updateData(results) {
        // Convert unix timestamp to Date.
        results.data.map(location => (
            location.time = moment(location.time).format('DD/MM/YYYY')
        ));
        this.setState({ locationData: results.data });

        const { locationData } = this.state;

        this.handleLocationDataByDate(locationData);
    }

    handleLocationDataByDate = (locationData) => {
        let tmpDate = ' ';

        let locationsByDate = locationData.reduce((accumulator, currentValue, index, array) => {
          let date = currentValue.time;
          if(tmpDate !== date) {
            tmpDate = date;
            accumulator.push(
              {
                "value": date,
                "label": date,
                "date" : date,
                "locations": locationData.reduce((accumulator, location, index, array) => {
                if(location.time === date) {
                    accumulator.push({
                      "latitude": location.latitude,
                      "longitude": location.longitude,
                      "time": location.time
                    });
                  }
                  return accumulator;
                }, [])
              }
            );
          }
          return accumulator;
        }, [])

        console.log(locationsByDate);
        this.setState({ locationDataByDate: locationsByDate });
    }

    handleSelectChange = (value) => {
      this.setState({
        time: value.date,
        selectedDateLocationData: value.locations
      });
      console.log(this.state.selectedDateLocationData);
    }

    render() {
      return (
          <div>
            <h1>LocationTrace</h1>
            <Grid container justify="left" className={useStyles.root} spacing={2}>
              <Grid item xs={6} sm={6}>
                <div>
                  <input
                      type="file"
                      name="file"
                      ref={input => {
                        this.filesInput = input;
                      }}
                      placeholder={null}
                      onChange={this.handleFilesUpload}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={6}>
                <div>
                  <Select
                    options={this.state.locationDataByDate}
                    onChange= {this.handleSelectChange} />
                </div>
              </Grid>
            </Grid>

            <Map
              locations={this.state.selectedDateLocationData}
              google={this.props.google}
              center={{lat: 9.0080217, lng: 38.7418911}}
              height='500px'
              zoom={10}
            />
          </div>
      );
    }
}

export default LocationTrace;
