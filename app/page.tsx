"use client";
import * as React from "react";
import type { Pivot } from "react-flexmonster";
import dynamic from "next/dynamic";
import styles from "flexmonster/flexmonster.css";
import cubejs from "@cubejs-client/core";

const PivotWrap = dynamic(() => import("@/UIElements/PivotWrapper"), {
  ssr: false,
  loading: () => <h1>Loading Flexmonster...</h1>,
});

const ForwardRefPivot = React.forwardRef<Pivot, Flexmonster.Params>(
  (props, ref?: React.ForwardedRef<Pivot>) => (
    <PivotWrap {...props} pivotRef={ref} />
  )
);

const cubejsApi = cubejs(process.env.CUBEJS_API_TOKEN || "", {
  apiUrl: "http://10.210.72.209:4001/cubejs-api/v1",
});

const resultSet = await cubejsApi.load({
  dimensions: ["pivot.etablissement", "pivot.code1", "pivot.code3"],
  timeDimensions: [
    {
      dimension: "pivot.date",
      granularity: "year",
    },
  ],
  measures: [
    // "pivot.creditdebitreel",
    // "pivot.debitcreditreel",
    "pivot.montantdebit",
    "pivot.montantcredit",
    "pivot.soldecreditdebit",
    "pivot.soldedebitcredit",
  ],
});

function changementCharacterPoint(data) {
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    data[index] = Object.fromEntries(
      Object.entries(element).map(([k, v]) => [`${k.replaceAll(".", "․")}`, v])
    );
  }
  return data;
}

console.log(changementCharacterPoint(resultSet.loadResponses[0].data));

export default function UpdatingData() {
  const pivotRef: React.RefObject<Pivot> = React.useRef<Pivot>(null);

  let data = changementCharacterPoint(resultSet.loadResponses[0].data);

  const onReady = () => {
    pivotRef.current?.flexmonster.connectTo({ data: data });
  };

  return (
    <main className={styles.main}>
      <ForwardRefPivot
        ref={pivotRef}
        toolbar={true}
        beforetoolbarcreated={(toolbar) => {
          toolbar.showShareReportTab = true;
        }}
        width="100%"
        height={400}
        ready={onReady}
        //licenseKey="XXXX-XXXX-XXXX-XXXX-XXXX"
      />
    </main>
  );
}
