import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import ManageQTParameters from "./ManageQTParameters";
import { useTranslation } from "react-i18next";

interface Props {}

const QualityTestParameters = (props: Props) => {
  const { t } = useTranslation("home");
  const [rateType, setRateType] = React.useState("1");

  console.log(rateType);

  return (
    <div className="container py-3 ">
      <div className="row">
        <div className="col-lg-12">
          <GeneralCard title={t("home:qtp")}>
            <ManageQTParameters />
          </GeneralCard>
        </div>
      </div>
    </div>
  );
};

export default QualityTestParameters;
