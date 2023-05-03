import { GeneralCard } from "components/UI/GeneralCard";
import TooltipLabel from "components/UI/TooltipLabel";
import { title } from "process";
import React from "react";
import { useTranslation } from "react-i18next";
import ManageComponentLogs from './ManageComponentLogs'

interface Props {}

const ManageCategories = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="container py-3 ">
      <div className="row">
        <div className="col-lg-12">
          <GeneralCard title={t("maintainance:componentLogs")}>
            <TooltipLabel id="complog" text={t("maintainance:complog")} />
              <ManageComponentLogs/>
          </GeneralCard>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
