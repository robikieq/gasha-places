import React from "react";
import { makeStyles } from "@material-ui/core";
import logo from "../images/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#f7f7f7",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderInner: {
    position: "relative",
  },
  loaderCircle: {
    width: 100,
    height: 100,
    position: "relative",
    borderStyle: "solid",
    borderWidth: 3,
    borderTopColor: "#8f1bdc",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    zIndex: 10,
    borderRadius: "50%",
    boxShadow: "0 1px 5px 0 rgba(35,181,185,0.15)",
    backgroundColor: "white",
    animation: `$zoom 2000ms infinite ease`,
    transition: ".6s",
  },
  centerImgContainer: {
    position: "absolute",
    top: "50%",
    zIndex: 200,
    left: 0,
    right: 0,
    margin: "0 auto",
    textAlign: "center",
    display: "inline-block",
    transform: "translateY(-50%)",
    paddingTop: theme.spacing(1),
    transition: ".6s",
  },
  centerImg: {
    maxWidth: 55,
    verticalAlign: "middle",
    borderStyle: "none",
  },
  "@keyframes zoom": {
    "0%": {
      transform: "rotate(0deg)",
      transition: ".6s",
    },
    "100%": {
      transform: "rotate(360deg)",
      transition: ".6s",
    },
  },
}));

export function AppLoading() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.loaderInner}>
        <div className={classes.loaderCircle} />
        <div className={classes.centerImgContainer}>
          <img src={logo} alt="Logo" className={classes.centerImg} />
        </div>
      </div>
    </div>
  );
}
