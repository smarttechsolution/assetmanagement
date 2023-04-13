import Tariff from "core/Public/Home/Tariff";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import Beneficiaries from "./Beneficiaries";
import GeneralInfo from "./GeneralInfo";
import InflationParameters from "./InflationParameters";
import MobileUser from "./MobileUser";
import SupplySchedule from "./SupplySchedule";

interface IProps extends PropsFromRedux {}

const HomeMain = (props: IProps) => {
  const { t } = useTranslation("home");

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-lg-8 col-md-6">
          <div className="mb-3">
            <GeneralInfo />
          </div>
          <div className="my-3">
            <Beneficiaries />
          </div>
        </div>
        <div className="col-lg-4 col-md-6 ">
          <div className="mb-3 mobile">
            <MobileUser />
          </div>
          <div className="home-right">
            <SupplySchedule />

            {/* <TarrifRate /> */}
            <div className="home-right-card">
              <h6 className="home-right-title">{t("home:tariffRates")}</h6>
              <Tariff />
            </div>
            <div className="home-right-card">
              {/* <h6 className="home-right-title">{t("finance:inflationRate")}</h6> */}
              <InflationParameters />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  waterTarrifs: state.waterTarrifsData.waterTarrifData.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HomeMain);
