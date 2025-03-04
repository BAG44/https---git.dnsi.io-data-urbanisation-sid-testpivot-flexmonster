"use client";
import * as React from "react";
import * as FlexmonsterReact from "react-flexmonster";
import Flexmonster from "flexmonster";

type PivotProps = Flexmonster.Params & {
  pivotRef?: React.ForwardedRef<FlexmonsterReact.Pivot>;
};

const PivotWrapper: React.FC<PivotProps> = ({ pivotRef, ...params }) => {
  return <FlexmonsterReact.Pivot {...params} ref={pivotRef} />;
};

export default PivotWrapper;
