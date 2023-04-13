import { HouseIcon, InstitutionIcon, UserGroupIcon } from "assets/images/xd";
import { InfoCard } from "components/UI/InfoCard";
import TooltipLabel from "components/UI/TooltipLabel";
import { formatTime } from "core/Protected/Home/SupplySchedule";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getWaterSchemeDetailsAction } from "store/modules/waterScheme/waterSchemeDetails";
import { getWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/getWaterSupplySchedule";
import { getWaterTarrifsAction } from "store/modules/waterTarrifs/getWaterTarrifs";
import { RootState } from "store/root-reducer";
import IncomeExpend from "./IncomeExpend";
import Maintainance from "./Maintainance";
import Tariff from "./Tariff";

interface Iprops extends PropsFromRedux {}

const HomeMain = (props: Iprops) => {
  const { language, schemeDetails, incomeExpenseData } = props;

  const { t } = useTranslation(["home"]);

  useEffect(() => {
    if (language && schemeDetails?.slug) {
      // props.getWaterTarrifsAction(language, schemeDetails.slug, "use");
      props.getWaterSupplyScheduleAction(language, schemeDetails.slug);
    }
  }, [language, schemeDetails]);

  return (
    <div className="container py-3">
      {/* <h6 className="mb-3 text-black">Dashboard</h6> */}
      <div className="row">
        <div className="col-lg-9 col-md-12">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-md-0 mb-3">
              <InfoCard
                first
                title={t("home:overallNetBalance")}
                subTitle={t("home:overallNetBalance") as string}
                value={incomeExpenseData?.net_balance}
              >
                <div className="infoCard-details">
                  <div className="infoCard-details-item">
                    <p className="infoCard-sub-title2">{t("home:overallNetIncome")}</p>
                    <h6
                      className="infoCard-sub-price"
                      style={{ fontFamily: language === "en" ? " Roboto" : "" }}
                    >
                      {props.schemeDetails?.currency} {incomeExpenseData?.net_income}
                    </h6>
                  </div>
                  <div className="infoCard-details-item">
                    <p className="infoCard-sub-title2">{t("home:overallNetExpenditure")}</p>
                    <h6
                      className="infoCard-sub-price"
                      style={{ fontFamily: language === "en" ? " Roboto" : "" }}
                    >
                      {props.schemeDetails?.currency} {incomeExpenseData?.net_expense}
                    </h6>
                  </div>
                </div>
              </InfoCard>
            </div>

            <div className="col-lg-5 col-md-6 mb-md-0 mb-3">
              <InfoCard
                second
                title={t("home:beneficiary")}
                subTitle={""}
                value={incomeExpenseData?.total_population}
              >
                <div className="row">
                  <div className="col-6">
                    <div className="infoCard-details-item">
                      <p className="infoCard-sub-title2">{t("home:households")}</p>
                      <h6 className="infoCard-sub-price">
                        <img src={HouseIcon} alt="" className="icon" />{" "}
                        {incomeExpenseData?.house_hold}
                      </h6>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="infoCard-details-item">
                      <p className="infoCard-sub-title2">{t("home:public")}</p>
                      <h6 className="infoCard-sub-price">
                        <img src={UserGroupIcon} alt="" className="icon" />{" "}
                        {incomeExpenseData?.public_connection}
                      </h6>
                    </div>
                  </div>
                  <div className="col-6 mt-4">
                    <div className="infoCard-details-item">
                      <p className="infoCard-sub-title2">{t("home:institutions")}</p>
                      <h6 className="infoCard-sub-price">
                        <img src={InstitutionIcon} alt="" className="icon" />{" "}
                        {incomeExpenseData?.instutions}
                      </h6>
                    </div>
                  </div>
                  <div className="col-6 mt-4">
                    <div className="infoCard-details-item">
                      <p className="infoCard-sub-title2">{t("home:commercial")}</p>
                      <h6 className="infoCard-sub-price">
                        <img src={InstitutionIcon} alt="" className="icon" />{" "}
                        {incomeExpenseData?.commercial_connection}
                      </h6>
                    </div>
                  </div>

                  {/* <div className="infoCard-details-item">
                    <p className="infoCard-sub-title2">{t("home:publicTaps")}</p>
                    <h6 className="infoCard-sub-price">
                      <img src={UserGroupIcon} alt="" className="icon" />{" "}
                      {incomeExpenseData?.public_taps}
                    </h6>
                  </div> */}
                </div>
              </InfoCard>
            </div>

            <div className="col-lg-3 col-md-6 mb-md-0 mb-3">
              <InfoCard
                title={t("home:supply")}
                subTitle={t("home:dailyAverage") as string}
                value={
                  incomeExpenseData?.daily_avg_supply
                    ? incomeExpenseData?.daily_avg_supply + " " + t("home:litre")
                    : ""
                }
              >
                <div className="infoCard-details"></div>

                {/* <div className="infoCard-details">
                  <div className="infoCard-details-item">
                    <p className="infoCard-sub-title2">Daily planned</p>
                    <h6 className="infoCard-sub-price">12,000 Ltrs</h6>
                  </div>
                  <div className="infoCard-details-item">
                    <p className="infoCard-sub-title2">
                      Overall Net Expenditure
                    </p> 
                  </div>
                </div> */}
              </InfoCard>
            </div>
          </div>
          <div className="my-2">
            <IncomeExpend />
          </div>
          <div className="my-2">
            <Maintainance />
          </div>
        </div>
        <div className="col-lg-3 col-md-12 ">
          <div className="home-right">
            <div className="home-right-card">
              <h6 className="home-right-title">{t("home:supplySchedule")}</h6>
              {props.waterSupplyData &&
                props.waterSupplyData instanceof Array &&
                props.waterSupplyData.map((item, index) => (
                  <div className="home-right-info" key={index}>
                    <h6>{item.day?.toUpperCase()}</h6>
                    <span>
                      <p>
                        {getNumberByLanguage(formatTime(item.time_from))} :
                        {getNumberByLanguage(formatTime(item.time_to))}
                      </p>
                    </span>
                  </div>
                ))}
            </div>

            <div className="home-right-card">
              <h6 className="home-right-title">{t("home:tariffRates")} </h6>

              {/* {props.waterTarrifs?.map((tarrif) => (
                <div className="home-right-info" key={tarrif.id}>
                  <h6>
                    {tarrif.unit_from}-{tarrif.unit_to} {t("home:unit")}
                  </h6>
                  <span>
                    <p>
                      {props.scheme?.currency} {tarrif.rate} | {t("home:unit")}
                    </p>
                  </span>
                </div>
              ))} */}
              <Tariff />
            </div>
            <div className="home-right-card">
              <h6 className="home-right-title">{t("home:generalInformation")}</h6>
              <div className="home-right-info">
                <h6>{t("home:name")}: </h6>
                <span>
                  <p>{props.waterSchemeDetails?.scheme_name}</p>
                </span>
              </div>
              <div className="home-right-info">
                <h6>{t("home:address")}: </h6>
                <span>
                  <p>{props.waterSchemeDetails?.location}</p>
                </span>
              </div>
              <div className="home-right-info">
                <h6>{t("home:source")}: </h6>
                <span>
                  <p>{props.schemeDetails?.water_source}</p>
                </span>
              </div>
              <div className="home-right-info">
                <h6>{t("home:builtDate")}: </h6>
                <span>
                  <p>
                    {getNumberByLanguage(
                      new Date(props.waterSchemeDetails?.system_built_date)?.toLocaleDateString()
                    )}
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  incomeExpenseData: state.reportData.incomeExpenseData.data,
  waterTarrifs: state.waterTarrifsData.waterTarrifData.data,
  waterSupplyData: state.waterSupplyData.waterScheduleData.data,
  waterSchemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
});

const mapDispatchToProps = {
  getWaterTarrifsAction: getWaterTarrifsAction,
  getWaterSupplyScheduleAction: getWaterSupplyScheduleAction,
  getWaterSchemeDetailsAction: getWaterSchemeDetailsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HomeMain);
