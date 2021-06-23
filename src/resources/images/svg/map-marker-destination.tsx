import { DivIcon } from "leaflet";
import * as React from "react";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ReactDOMServer from 'react-dom/server';

const htmlString = ReactDOMServer.renderToStaticMarkup(
  <div style={{ height: 28, width: 28, backgroundColor: "#037083", borderRadius: 100, alignItems: "center", display: "flex", paddingRight: 10 }}>
    <LocationOnIcon style={{ marginLeft: 2, height: 15 }} htmlColor="#fff"/>
  </div>
);

export const destinationIcon = new DivIcon({
  html: htmlString,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [15, 16],
});