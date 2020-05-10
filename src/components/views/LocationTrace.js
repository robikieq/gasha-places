import React, { useState, useMemo, useRef, Fragment } from "react";
import Papa from "papaparse";
import {
  Paper,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  TextField,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Map from "../maps/Map";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import parse from "date-fns/parse";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  grow: {
    flex: 1,
  },
  toolbarContainer: {
    position: "absolute",
    top: theme.spacing(2),
    left: "50%",
    transform: "translateX(-50%)",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
    zIndex: theme.zIndex.appBar,
  },
  headline: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: theme.palette.text.secondary,
  },
  datePickerInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  fileUploadInput: {
    display: "none",
  },
  divider: {
    height: 28,
    margin: 4,
  },
  uploadButton: {
    padding: 10,
  },
}));

function getSortedDates(dateLocationMap) {
  return Object.keys(dateLocationMap).sort((date1, date2) =>
    date1.localeCompare(date2)
  );
}

function DatePickerInput({ InputProps, ...props }) {
  const classes = useStyles();
  return (
    <TextField
      InputProps={{ ...InputProps, disableUnderline: true }}
      className={classes.datePickerInput}
      {...props}
    />
  );
}

export default function LocationTrace() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState("");
  const [dateLocationMap, setDateLocationMap] = useState({});
  const [invalidFileUploaded, setInvalidFileUploaded] = useState(false);
  const handleErrorSnackbarClose = () => setInvalidFileUploaded(false);
  const handleFilesUpload = (event) => {
    function isValidFormat(meta) {
      if (meta.fields && meta.fields.length > 3) {
        if (
          meta.fields.indexOf("latitude") !== -1 &&
          meta.fields.indexOf("longitude") !== -1 &&
          meta.fields.indexOf("time") !== 0
        ) {
          return true;
        }
      }
      return false;
    }
    function updateData(results) {
      if (!isValidFormat(results.meta)) {
        setInvalidFileUploaded(true);
        return;
      }
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

    if (event.target.files.length === 0) {
      return;
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
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          autoOk
          disabled={locations && locations.length === 0}
          minDate={minDate}
          maxDate={maxDate}
          format="MMMM d, yyyy"
          value={value}
          onChange={handleSelectChange}
          TextFieldComponent={DatePickerInput}
        />
      </MuiPickersUtilsProvider>
    );
  };

  return (
    <Fragment>
      <Paper component="form" className={classes.toolbarContainer}>
        {(!locations || locations.length === 0) && (
          <Typography variant="subtitle2" className={classes.headline}>
            COVID Patient Location Tracer
          </Typography>
        )}
        {locations && locations.length > 0 && renderLocationDatePicker()}
        <Divider className={classes.divider} orientation="vertical" />
        <input
          accept=".csv"
          type="file"
          name="file"
          ref={fileRef}
          id="fileUploader"
          onChange={handleFilesUpload}
          className={classes.fileUploadInput}
        />
        <Tooltip title="Upload Patient Location Data">
          <label htmlFor="fileUploader">
            <IconButton
              color="primary"
              className={classes.uploadButton}
              component="span">
              <CloudUploadIcon />
            </IconButton>
          </label>
        </Tooltip>
      </Paper>
      <Map
        locations={dateLocationMap[selectedDate]}
        center={mapCenter}
        height="100vh"
        zoom={13}
      />
      <Snackbar
        open={invalidFileUploaded}
        autoHideDuration={6000}
        onClose={handleErrorSnackbarClose}>
        <Alert
          onClose={handleErrorSnackbarClose}
          severity="error"
          elevation={6}
          variant="filled">
          Invalid File Format!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
