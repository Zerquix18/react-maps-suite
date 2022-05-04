import * as React from 'react';
import { Fragment } from "react";

interface MarkerClusterComponentProps {
  children: React.ReactNode;
}

function MarkerClusterComponent({ children }: MarkerClusterComponentProps) {
  // unsupported!
  return (
    <Fragment>
      { children }
    </Fragment>
  );
};

export default MarkerClusterComponent;
