import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import ManageWaterSupplyRecord from "./WaterSupplyRecord";
import { useTranslation } from "react-i18next";

interface Props {}

const WaterSupplyRecord = (props: Props) => {
  const { t } = useTranslation("home");

  return (
    <div className="container py-3 ">
      <div className="row">
        <div className="col-lg-12">
          <GeneralCard title={t("home:wsr")}>
            <ManageWaterSupplyRecord />
          </GeneralCard>
        </div>
      </div>
    </div>
  );
};

export default WaterSupplyRecord;
