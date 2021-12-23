import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import ManageComponentCategories from "./ManageCategories";
import ManageComponent from "./ManageComponent";
import { useTranslation } from "react-i18next";

interface Props {}

const ManageCategories = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="container py-3 ">
      <div className="row">
        <div className="col-lg-8">
          <GeneralCard title={t("maintainance:component")}>
            <ManageComponent />
          </GeneralCard>
        </div>
        <div className="col-lg-4">
          <GeneralCard title={t("maintainance:component") + " " + t("maintainance:categories")}>
            <ManageComponentCategories />
          </GeneralCard>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
