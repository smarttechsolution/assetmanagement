import { EditIcon } from "assets/images/xd";
import GeneralModal from "components/UI/GeneralModal";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getSchemeDataAction } from "store/modules/waterScheme/getWaterSchemeData";
import { RootState } from "store/root-reducer";
import ManageSupplyBelts from "./ManageBeneficiaries";
import { GeneralCard } from "components/UI/GeneralCard";


interface IProps extends PropsFromRedux { }

const Beneficiaries = (props: IProps) => {
  const { t } = useTranslation(["home"]);

  const [modal, setModal] = React.useState(false);

  const toggleModal = () => setModal(!modal);

  React.useEffect(() => {
    if (props.langugae) {
      props.getSchemeDataAction(props.langugae);
    }
  }, [props.langugae]);

  return (
    <GeneralCard title={t("home:beneficiaryinfo")} className="text-left" action={toggleModal}>
      <div className="tableCard dashboard">
        <div className="table-scroll">
          <div className="data-table data-table-even-stripe">
            <table className="table" style={{borderRadius: "none!important"}}>
              <thead className="paddingHeader">
                <tr>
                  <th className="">{t("home:applyDate")}</th>
                  <th> {t("home:household")}</th>
                  <th> {t("home:institutions")}</th>
                  <th> {t("home:public")}</th>
                  <th> {t("home:commercial")}</th>
                  {/* <th className="action" role="button" onClick={() => toggleModal()}>
                    <img src={EditIcon} />
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {props.waterSchemeData &&
                  props.waterSchemeData instanceof Array &&
                  props.waterSchemeData?.map((item) => (
                    <tr key={item.id}>
                      <td>{getNumberByLanguage(item.apply_date)}</td>
                      <td>{getNumberByLanguage(item.household_connection)}</td>
                      <td>{getNumberByLanguage(item.institutional_connection)}</td>
                      <td>{getNumberByLanguage(item.public_connection)}</td>
                      <td>{getNumberByLanguage(item.commercial_connection)}</td>
                      {/* <td></td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <GeneralModal
          open={modal}
          toggle={toggleModal}
          title={t("home:benefinfo")}
          size="xl"
        >
          <ManageSupplyBelts toggle={setModal} />
        </GeneralModal>
      </div>
    </GeneralCard>
  );
};

const mapStateToProps = (state: RootState) => ({
  langugae: state.i18nextData.languageType,
  waterSchemeData: state.waterSchemeData.getWaterSchemeData.data,
});

const mapDispatchToProps = {
  getSchemeDataAction: getSchemeDataAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Beneficiaries);
