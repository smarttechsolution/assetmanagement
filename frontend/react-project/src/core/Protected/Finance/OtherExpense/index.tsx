import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import { useTranslation } from "react-i18next";
import ManageOtherExpenses from "./ManageOtherExpenses";
import ManageOtherParameters from "./ManageOtherParameters";

interface Props {}

const OtherExpenses = (props: Props) => {
  const { t } = useTranslation();
  const [rateType, setRateType] = React.useState("1");

  return (
    <div className="container py-3 ">
      <div className="row">
        <div className="col-lg-12">
          <GeneralCard title={t("sidebar:otherParam")}>
            <ManageOtherExpenses />
          </GeneralCard>
        </div>
        {/* <div className="col-lg-4">
          <GeneralCard title={t("finance:inflation") + " " + t("finance:parameters")}>
            <ManageOtherParameters />
          </GeneralCard>
        </div> */}
      </div>
    </div>
  );
};

export default OtherExpenses;
