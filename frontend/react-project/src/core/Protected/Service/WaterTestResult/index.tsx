import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import ManageWaterTestResult from "./ManageWaterTestResult";
import { useTranslation } from "react-i18next";

interface Props {}

const WaterTestResult = (props: Props) => {
  const { t } = useTranslation("home");
  const [rateType, setRateType] = React.useState("1");

  console.log(rateType);

  return (
    <div className="container py-3 ">
      <ManageWaterTestResult />
    </div>
  );
};

export default WaterTestResult;
