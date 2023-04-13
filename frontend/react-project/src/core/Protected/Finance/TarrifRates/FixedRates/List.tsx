import { DeleteIcon, EditIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteWaterTariffAction } from "store/modules/waterTarrifs/deleteWaterTariff";
import { getUsIncomeEstimateThisYearAction } from "store/modules/waterTarrifs/getIncomeEstimateThisYear";
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
      const response = await props.deleteWaterTariffAction(editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getWaterTarrifsAction(props.language, props.schemeSlug, "fixed");
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

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th style={{ borderRadius: "5px 0 0 0" }}> {t("home:sn")}</th>
              <th>{t("home:applyDate")}</th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:roht")} </th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:roit")} </th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:ropt")}</th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:roct")}</th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:epcht")}</th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:epcit")}</th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:epcpt")}</th>
              <th style={{ whiteSpace: "break-spaces" }}>{t("finance:epcct")}</th>
              <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.waterTarrifs && props.waterTarrifs?.length > 0 ? (
              props.waterTarrifs?.map((item, index) => (
                <tr key={item.id}>
                  <td>{getNumberByLanguage(index + 1)}</td>
                  <td> {getNumberByLanguage(item.apply_date)}</td>
                  <td>
                    {props.scheme?.currency}. {getNumberByLanguage(item.rate_for_household) || "-"}{" "}
                    {t("finance:permonth")}
                  </td>
                  <td>
                    {props.scheme?.currency}.{" "}
                    {getNumberByLanguage(item.rate_for_institution) || "-"} {t("finance:permonth")}
                  </td>
                  <td>
                    {props.scheme?.currency}. {getNumberByLanguage(item.rate_for_public) || "-"}{" "}
                    {t("finance:permonth")}
                  </td>
                  <td>
                    {props.scheme?.currency}. {getNumberByLanguage(item.rate_for_commercial) || "-"}{" "}
                    {t("finance:permonth")}
                  </td>
                  <td>
                    {getNumberByLanguage(item.estimated_paying_connection_household) || "-"} %
                  </td>
                  <td>
                    {getNumberByLanguage(item.estimated_paying_connection_institution) || "-"} %
                  </td>
                  <td>{getNumberByLanguage(item.estimated_paying_connection_public) || "-"} %</td>
                  <td>
                    {getNumberByLanguage(item.estimated_paying_connection_commercial) || "-"} %
                  </td>
                  <td className="action">
                    <div role="button" onClick={() => props.setEditData(item)}>
                      <img src={EditIconDark} alt="" />
                    </div>
                    <div role="button" onClick={() => handleDeleteClick(item.id)}>
                      <img src={DeleteIcon} alt="" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No Data Available
                </td>
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
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  waterTarrifs: state.waterTarrifsData.waterTarrifData.data,
});

const mapDispatchToProps = {
  getWaterTarrifsAction,
  deleteWaterTariffAction,
  getUsIncomeEstimateThisYearAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UseBasedList);
