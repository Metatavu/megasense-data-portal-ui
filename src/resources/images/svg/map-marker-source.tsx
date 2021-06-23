import { DivIcon } from "leaflet";
import * as React from "react";
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import ReactDOMServer from 'react-dom/server';

const htmlString = ReactDOMServer.renderToStaticMarkup(
  <div style={{ height: 28, width: 28, backgroundColor: "#037083", borderRadius: 100, alignItems: "center", display: "flex", paddingRight: 10 }}>
    <TripOriginIcon style={{ marginLeft: 2, height: 11 }} htmlColor="#fff"/>
  </div>
);

export const sourceIcon = new DivIcon({
  html: htmlString,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [15, 16],
});