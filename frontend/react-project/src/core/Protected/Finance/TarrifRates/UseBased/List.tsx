import { DeleteIcon, EditIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteUseBasedWaterTariffAction } from "store/modules/waterTarrifs/deleteUseBasedWaterTariff";
import { getUsIncomeEstimateThisYearAction } from "store/modules/waterTarrifs/getIncomeEstimateThisYear";
import { getUseBasedWaterTarrifsAction } from "store/modules/waterTarrifs/getUseBasedWaterTarrifs";
import { getWaterTarrifsAction } from "store/modules/waterTarrifs/getWaterTarrifs";
import { RootState } from "store/root-reducer";

interface Props extends PropsFromRedux {
  setEditData;
}

const UseBasedList = (props: Props) => {
  const { t } = useTranslation();
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const deleteTariffRate = async () => {
    try {
      const response = await props.deleteUseBasedWaterTariffAction(editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getUseBasedWaterTarrifsAction(props.language, props.schemeSlug);
        props.getUsIncomeEstimateThisYearAction(props.schemeSlug);

        resetDeleteData();
      } else {
        toast.error(t("home:deleteError"));
        resetDeleteData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  let count = 0;
  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th style={{ borderRadius: "5px 0 0 0" }}>{t("home:sn")}</th>
              <th style={{}}>{t("finance:appliedDate")}</th>
              <th style={{}}>{t("finance:unitRange")}</th>
              <th style={{}}>{t("home:rate")}</th> <th style={{}}>{t("finance:epcs")}</th>
              <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.waterTarrifs && props.waterTarrifs?.length > 0 ? (
              props.waterTarrifs?.map((item, index) => {
                return (
                  <React.Fragment key={item.apply_date}>
                    {item.used_based_units?.map((tariff, index) => {
                      count = count + 1;
 
                      return (
                        <tr key={tariff.id}>
                          <td>{getNumberByLanguage(count)}</td>
                          <td> {getNumberByLanguage(item.apply_date)}</td>
                          <td>
                            {" "}
                            {getNumberByLanguage(tariff.unit_from)} -{" "}
                            {getNumberByLanguage(tariff.unit_to)} {t("home:units")}
                          </td>
                          <td>
                            {props.scheme?.currency}. {getNumberByLanguage(tariff.rate) || "-"} |{" "}
                            {t("home:unit")}
                          </td>
                          <td style={{}}>
                            {getNumberByLanguage(tariff.estimated_paying_connection)}
                          </td>
                          <td className="action">
                            <div role="button" onClick={() => props.setEditData({ tariff, item })}>
                              <img src={EditIconDark} alt="" />
                            </div>
                            <div role="button" onClick={() => handleDeleteClick(tariff.id)}>
                              <img src={DeleteIcon} alt="" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No Data Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        open={modal}
        handleModal={() => toggleModal()}
        handleConfirmClick={() => deleteTariffRate()}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  waterTarrifs: state.waterTarrifsData.getUseBasedWaterTarrifs.data,
  supplySchedule: state.waterTarrifsData.waterTarrifData.data,
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
});

const mapDispatchToProps = {
  getWaterTarrifsAction,
  deleteUseBasedWaterTariffAction,
  getUseBasedWaterTarrifsAction,
  getUsIncomeEstimateThisYearAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UseBasedList);
