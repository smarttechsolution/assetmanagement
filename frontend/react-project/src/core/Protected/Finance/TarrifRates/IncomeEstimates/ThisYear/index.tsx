import { HouseIcon, InstitutionIcon, UserGroupIcon, UserIcon } from "assets/images/xd";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getFixedRateIncomeEstimatesAction } from "store/modules/waterTarrifs/getFixedRateIncomeEstimates";
import { RootState } from "store/root-reducer";
import Table from "./Table";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";

interface IProps extends PropsFromRedux {
  rateType;
}

const IncomeEstimatesThisYear = (props: IProps) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (props.schemeSlug) {
      props.getUsIncomeEstimateThisYearAction(props.schemeSlug);
    }
  }, [props.schemeSlug]);

  return (
    <div>
      <div className="row">
        <div className="col-2 col-md-2">
          <div className="estimates">
            <span>{t("finance:incomeEstimateTY")}</span>
            <h5>
              {props.scheme?.currency}. {getNumberByLanguage(props.incomeEstimates?.total_income)}
            </h5>
          </div>
        </div>
        <div className="col-2 col-md-2">
          <div className="estimates">
            <span>{t("home:households")}</span>
            <h6>
              <img src={HouseIcon} alt="" className="icon" />{" "}
              {getNumberByLanguage(props.incomeEstimates?.household_connection)}
            </h6>
          </div>
        </div>
        <div className="col-2 col-md-2">
          <div className="estimates">
            <span>{t("home:institutions")}</span>
            <h6>
              <img src={InstitutionIcon} alt="" className="icon" />{" "}
              {getNumberByLanguage(props.incomeEstimates?.institutional_connection)}
            </h6>
          </div>
        </div>
        <div className="col-2 col-md-2">
          <div className="estimates">
            <span>{t("home:public")}</span>
            <h6>
              <img src={UserIcon} alt="" className="icon" />{" "}
              {getNumberByLanguage(props.incomeEstimates?.public_connection)}
            </h6>
          </div>
        </div>

       
        <div className="col-2 col-md-2">
          <div className="estimates">
            <span>{t("home:commercial")}</span>
            <h6>
              <img src={InstitutionIcon} alt="" className="icon" />{" "}
              {getNumberByLanguage(props.incomeEstimates?.commercial_connection)}
            </h6>
          </div>
        </div>
        <div className="col-2 col-md-2">
          <div className="estimates">
            <span>{t("home:totalConn")} </span>
            <h6> {getNumberByLanguage(props.incomeEstimates?.total_connection)}</h6>
          </div>
        </div>
      </div>
      <Table />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  incomeEstimates: state.waterTarrifsData.getIncomeEstimateThisYear.data,
});

const mapDispatchToProps = {
  getUsIncomeEstimateThisYearAction: getFixedRateIncomeEstimatesAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomeEstimatesThisYear);
