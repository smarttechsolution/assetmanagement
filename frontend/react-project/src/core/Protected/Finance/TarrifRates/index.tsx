import CustomRadio from "components/UI/CustomRadio";
import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import UserBased from "./UseBased";
import FixedRate from "./FixedRates";
import ThisYear from "./IncomeEstimates/ThisYear";
import IncomeEstimates from "./IncomeExpendGraph";
import { useTranslation } from "react-i18next";
import { RootState } from "store/root-reducer";
import { connect, ConnectedProps } from "react-redux";
import { getWaterTarrifsAction } from "store/modules/waterTarrifs/getWaterTarrifs";
import { getFixedRateIncomeEstimatesAction } from "store/modules/waterTarrifs/getFixedRateIncomeEstimates";
import { getUseBasedWaterTarrifsAction } from "store/modules/waterTarrifs/getUseBasedWaterTarrifs";
import Note from "./UseBased/Note";
import TooltipLabel from "components/UI/TooltipLabel";

interface Props extends PropsFromRedux {}

const Tarrifrates = (props: Props) => {
  const { t } = useTranslation();
  const [rateType, setRateType] = React.useState("1"); //1 -> use Based //2 -> Fixed rate
  const [tariffType, setTariffType] = React.useState("");
  const [ note, setNote] = React.useState<any>();
 

  React.useEffect(() => {
    if (props.language && props.schemeSlug) {
      props.getWaterTarrifsAction(props.language, props.schemeSlug, "fixed");
      props.getUseBasedWaterTarrifsAction(props.language,props.schemeSlug);
    }
  }, [props.language, props.schemeSlug]);

  console.log(props.waterTarrifs , props.useBasedWaterTarrifs, "watterrrtarfififi")
  


  React.useEffect(() => {
    if (props.waterTarrifs || props.useBasedWaterTarrifs) {
      var nots = <Note />
      if (props.useBasedWaterTarrifs?.some((item) => item.terif_type === "Use Based")) {
        setTariffType("useBased");
        setRateType("1");
        setNote(nots)
      } else if (props.waterTarrifs?.some((item) => item.terif_type === "Fixed")) {
        setTariffType("fixed");
        setRateType("2");
      } else { 
        setTariffType("");
      }
    }
  }, [props.waterTarrifs, props.useBasedWaterTarrifs]);

  return (
    <div className="container py-3 ">
      <div className="row">
        <div className="col-lg-12">
          <GeneralCard title={t("sidebar:tariffRates")}>
            <div className="d-flex">
              {tariffType !== "fixed" && (
                <div className="mr-2">
                  <CustomRadio
                    label={t("finance:useBased")}
                    id="userBased"
                    name="1"
                    value={1}
                    checked={rateType === "1"}
                    onChange={(e) => setRateType(e.target.value)}
                  />
                </div>
              )}
              {tariffType !== "useBased" && (
                <div className="ml-2">
                  <CustomRadio
                    label={t("finance:fixedRate")}
                    id="fixed2"
                    name="2"
                    value={2}
                    checked={rateType === "2"}
                    onChange={(e) => setRateType(e.target.value)}
                  />
                </div>
              )}
            </div>

            {rateType === "1" ? <UserBased /> : <FixedRate />}
          </GeneralCard>
        </div>
        <div className="col-lg-8 mt-3 ">
          <GeneralCard title={t("finance:incomeEstimateTY")}>
            <ThisYear rateType={rateType} />
            <hr style={{padding: "10px 15px"}} />
            {/* <Note /> */}
            {note}
          </GeneralCard>
        </div>
        <div className="col-lg-4 mt-3 ">
          <GeneralCard title={t("finance:incomeEstimate")}><TooltipLabel id="inco" text={t("finance:incomeT")}/>
            <IncomeEstimates />
          </GeneralCard>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  waterTarrifs: state.waterTarrifsData.waterTarrifData.data,
  useBasedWaterTarrifs: state.waterTarrifsData.getUseBasedWaterTarrifs.data,
  supplySchedule: state.waterTarrifsData.waterTarrifData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
});

const mapDispatchToProps = {
  getWaterTarrifsAction: getWaterTarrifsAction,
  getFixedRateIncomeEstimatesAction: getFixedRateIncomeEstimatesAction,
  getUseBasedWaterTarrifsAction: getUseBasedWaterTarrifsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Tarrifrates);
