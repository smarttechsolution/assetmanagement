import { EditIcon } from "assets/images/xd";
import GeneralModal from "components/UI/GeneralModal";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/getWaterSupplySchedule";
import { RootState } from "store/root-reducer";
import ManageSupply from "./ManageSupply";

export const formatTime = (time) => {
  const splitTime = time?.split(":");
  return splitTime[0] + ":" + splitTime[1];
};

interface Props extends PropsFromRedux {}

const SupplySchedule = (props: Props) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  React.useEffect(() => {
    if (props.schemeSlug) {
      props.getWaterSupplyScheduleAction(props.language, props.schemeSlug);
    }
  }, [props.language, props.schemeSlug]);

  const { t } = useTranslation();

  return (
    <div className="home-right-card">
      <div className="home-right-header">
        <h6 className="home-right-title">{t("home:supplySchedule")}</h6>
        <div className="action" role="button" onClick={toggle}>
          <img className="action" src={EditIcon} alt="" />
        </div>
      </div>

      {props.supplySchedule &&
        props.supplySchedule instanceof Array &&
        props.supplySchedule.map((item, index) => (
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

      <GeneralModal
        title={t("home:supplyschd")}
        open={open}
        toggle={toggle}
      >
        <ManageSupply toggle={toggle} />
      </GeneralModal>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
});

const mapDispatchToProps = {
  getWaterSupplyScheduleAction: getWaterSupplyScheduleAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SupplySchedule);
