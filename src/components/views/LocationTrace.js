import React, { useState, useMemo, useRef } from "react";
import Papa from "papaparse";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Map from "../maps/Map";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import parse from "date-fns/parse";

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

function getSortedDates(dateLocationMap) {
  return Object.keys(dateLocationMap).sort((date1, date2) =>
    date1.localeCompare(date2)
  );
}

export default function LocationTrace() {
  const [selectedDate, setSelectedDate] = useState("");
  const [dateLocationMap, setDateLocationMap] = useState({});
  const handleFilesUpload = (event) => {
    function updateData(results) {
      // Convert unix timestamp to Date.
      const locationData = results.data.map((location) => {
        return {
          ...location,
          date: format(new Date(location.time), "dd/MM/yyyy"),
        };
      });
      const dateLocationMap = {};

      for (let entry of locationData) {
        const locationValue = {
          latitude: entry.latitude,
          longitude: entry.longitude,
          time: entry.date,
        };
        if (dateLocationMap[entry.date]) {
          dateLocationMap[entry.date].push(locationValue);
        } else {
          dateLocationMap[entry.date] = [locationValue];
        }
      }

      const dates = getSortedDates(dateLocationMap);
      setSelectedDate(dates[dates.length - 1]);
      setDateLocationMap(dateLocationMap);
    }

    Papa.parse(event.target.files[0], {
      complete: updateData,
      dynamicTyping: true,
      header: true,
    });
  };
  const handleSelectChange = (value) => {
    setSelectedDate(format(value, "dd/MM/yyyy"));
  };

  const dates = getSortedDates(dateLocationMap);
  const locations = dates.map((date) => dateLocationMap[date]);
  const mapCenter = useMemo(() => ({ lat: 9.0080217, lng: 38.7418911 }), []);
  const fileRef = useRef(null);

  const renderLocationDatePicker = () => {
    const minDate = parse(dates[0], "dd/MM/yyyy", new Date());
    const maxDate = parse(dates[dates.length - 1], "dd/MM/yyyy", new Date());

    const value = selectedDate && parse(selectedDate, "dd/MM/yyyy", new Date());
    console.log({
      minDate,
      maxDate,
    });
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          autoOk
          disabled={locations && locations.length === 0}
          minDate={minDate}
          maxDate={maxDate}
          format="dd/MM/yyyy"
          value={value}
          onChange={handleSelectChange}
        />
      </MuiPickersUtilsProvider>
    );
  };

  return (
    <div>
      <h1>LocationTrace</h1>
      <Grid container justify="left" className={useStyles.root} spacing={2}>
        <Grid item xs={6} sm={6}>
          <div>
            <input
              type="file"
              name="file"
              ref={fileRef}
              placeholder={null}
              onChange={handleFilesUpload}
            />
          </div>
        </Grid>
        <Grid item xs={6} sm={6}>
          <div>
            {locations && locations.length > 0 && renderLocationDatePicker()}
          </div>
        </Grid>
      </Grid>

      <Map
        locations={dateLocationMap[selectedDate]}
        center={mapCenter}
        height="500px"
        zoom={10}
      />
    </div>
  );
}
