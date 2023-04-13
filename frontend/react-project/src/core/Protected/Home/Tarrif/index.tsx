import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { UncontrolledCollapse } from "reactstrap";
import { getWaterTarrifsAction } from "store/modules/waterTarrifs/getWaterTarrifs";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";
import { getUseBasedWaterTarrifsAction } from "store/modules/waterTarrifs/getUseBasedWaterTarrifs";

interface IProps extends PropsFromRedux {}

const Tariff = (props: IProps) => {
  const { t } = useTranslation(["home"]);
  React.useEffect(() => {
    if (props.language && props.schemeDetails?.slug) {
      props.getWaterTarrifsAction(props.language, props.schemeDetails.slug, "fixed");
      props.getUseBasedWaterTarrifsAction(props.language, props.schemeDetails?.slug);
      
    }
  }, [props.language, props.schemeDetails]);

  console.log(props.useBasedWaterTarrifs, "------")

  return (
    <>
      {props.waterTarrifs &&
      props.waterTarrifs instanceof Array &&
      props.waterTarrifs?.length > 0 ? (
        props.waterTarrifs?.map((item, index) => (
          <div className="tariff-rate" key={index}>
            <div className="tariff-header" id={"toggler" + index}>
              <h6>{getNumberByLanguage(item.apply_date)}</h6>
              <p>
                {item.terif_type} <i className="ic-line-arrow-down icon"></i>
              </p>
            </div>
            {item.terif_type === "Use Based" ? (
              <UncontrolledCollapse toggler={"#toggler" + index}>
                <>
                  <div className="tariff-content-header">
                    <h6>{t("home:sn")}</h6>
                    <h6 className="mr-5">{t("home:units")}</h6>
                    <h6>{t("home:rate")}</h6>
                  </div>
                  {item.used_based_units?.length > 0 ? (
                    item.used_based_units?.map((tariff, i) => (
                      <div className="tariff-content">
                        <p>{getNumberByLanguage(i + 1)}</p>
                        <p>
                          {getNumberByLanguage(tariff.unit_from)}-
                          {getNumberByLanguage(tariff.unit_to)} {t("home:units")}
                        </p>
                        <p>
                          {props.schemeDetails?.currency} {tariff.rate} | {t("home:unit")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="tariff-content">
                      <p>-</p>
                      <p>-</p>
                      <p>-</p>
                    </div>
                  )}
                </>
              </UncontrolledCollapse>
            ) : (
              <UncontrolledCollapse toggler={"#toggler" + index}>
                <>
                  <div className="tariff-content-header">
                    <h6>{t("home:rateInstitution")}</h6>
                    <h6>{t("home:rateHousehold")}</h6>
                  </div>
                  <div className="tariff-content">
                    <p>
                      {props.schemeDetails?.currency} {item?.rate_for_institution} | {t("home:units")}
                    </p>
                    <p>
                    {props.schemeDetails?.currency} {item?.rate_for_household} | {t("home:units")}
                    </p>
                  </div>
                </>
              </UncontrolledCollapse>
            )}
          </div>
        ))
      ) : (
        <small className="d-block text-center">{t("home:noData")}</small>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  useBasedWaterTarrifs: state.waterTarrifsData.getUseBasedWaterTarrifs.data,
  waterTarrifs: state.waterTarrifsData.waterTarrifData.data,
  language: state.i18nextData.languageType,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
});

const mapDispatchToProps = {
  getWaterTarrifsAction: getWaterTarrifsAction,
  getUseBasedWaterTarrifsAction: getUseBasedWaterTarrifsAction
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Tariff);
