import { EditIcon } from "assets/images/xd";
import GeneralModal from "components/UI/GeneralModal";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { RootState } from "store/root-reducer";
import ManageSupplyBelts from "./ManageSupplyBelts";
import { useTranslation } from "react-i18next";

interface Props extends PropsFromRedux {}

const SupplyBelts = (props: Props) => {
  const { t } = useTranslation(["home"]);
  const [open, setOpen] = React.useState(false);

  const toggle = () => setOpen(!open);

  React.useEffect(() => {
    if ((props.language, props.schemeSlug)) {
      props.getSupplyBeltsAction(props.language, props.schemeSlug);
    }
  }, [props.language, props.schemeSlug]);

  return (
    <div className="tableCard dashboard">
      <div className="table-scroll">
        <div className="data-table data-table-even-stripe">
          <table className="table mt-2">
            <thead className="paddingHeader">
              <tr>
                <th className="">{t("home:supplyBelts")}</th> 
                <th> {t("home:beneficiary")} {t("home:households")}</th>
                <th> {t("home:beneficiary")}  {t("home:population")}</th>
                <th> {t("home:publicTaps")}</th>
                <th> {t("home:institutions")}</th>

                <th className="action" role="button" onClick={() => toggle()}>
                  <img src={EditIcon} />
                </th>
              </tr>
            </thead>
            <tbody>
              {props.supplyBeltsList && props.supplyBeltsList?.length > 0 ? (
                props.supplyBeltsList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td> {item.beneficiary_household}</td>
                    <td> {item.beneficiary_population}</td>
                    <td>{item.public_taps}</td>
                    <td>{item.institutional_connection}</td>
                    <td></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>{t("home:noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GeneralModal title={t("home:addEdit") + " " + t("home:supplyBelts")} open={open} toggle={toggle}>
        <ManageSupplyBelts toggle={toggle} />
      </GeneralModal>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  supplyBeltsList: state.supplyBeltsData.getSupplyBeltData.data,
});

const mapDispatchToProps = {
  getSupplyBeltsAction: getSupplyBeltsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SupplyBelts);
