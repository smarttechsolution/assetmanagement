import { UserIcon } from "assets/images/xd";
import { GeneralCard } from "components/UI/GeneralCard";
import GeneralModal from "components/UI/GeneralModal";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getSchemeUserAction } from "store/modules/waterScheme/getWaterSchemeUser";
import { RootState } from "store/root-reducer";
import ManageMobileUser from "./ManageMobileUser";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";

interface Props extends PropsFromRedux { }

const MobileUser = (props: Props) => {
  const { t } = useTranslation(["home"]);
  const [open, setOpen] = React.useState(false);

  const toggle = () => setOpen(!open);

  React.useEffect(() => {
    props.getSchemeUserAction();
  }, []);

  return (
    <GeneralCard title={t("home:mobileAppUsers")} action={toggle}>
      <div className="mobile">
        <div className="mobile-content">
          {props.caretakerList &&
            props.caretakerList instanceof Array &&
            props.caretakerList.map((item) => {
              return <div className="mobile-user" key={item.id}>
                <div className="mobile-user-info">
                  <img src={UserIcon} alt="" className="img" />
                  <div className="details">
                    <h6 className="name">{item.name}</h6>
                    {item.is_care_taker === true && <p className="designation">{t("home:caretaker")}</p>}
                    {item.is_administrative_staff === true && <p className="designation">{t("home:administrative")}</p>}
                    {item.general_manager === true && <p className="designation">{t("home:general")}</p>}
                    {item.Other === true && <p className="designation">{t("home:other")}</p>}

                  </div>
                </div>
                <div className="mobile-user-contact">
                  <p className="contact"> {getNumberByLanguage(item.phone_number)}</p>
                </div>
              </div>
            })}
        </div>
      </div>

      <GeneralModal
        title={t("home:mobileAppUser")}
        open={open}
        toggle={toggle}
      >
        <ManageMobileUser toggle={toggle} />
      </GeneralModal>
    </GeneralCard>
  );
};

const mapStateToProps = (state: RootState) => ({
  caretakerList: state.waterSchemeData.getWaterSchemeUser.data,
});

const mapDispatchToProps = {
  getSchemeUserAction: getSchemeUserAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MobileUser);
