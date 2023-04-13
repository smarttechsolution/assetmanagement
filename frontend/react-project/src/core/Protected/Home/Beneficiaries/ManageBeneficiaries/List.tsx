import { DeleteIcon, EditActionIcon } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteWaterSchemeDataAction } from "store/modules/waterScheme/deleteWaterSchemeData";
import { getSchemeDataAction } from "store/modules/waterScheme/getWaterSchemeData";
import { getWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/getWaterSupplySchedule";
import { RootState } from "store/root-reducer";

interface Props extends PropsFromRedux {
  setEditData: any;
  toggle: any;
}

const List = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const deleteWaterSchedule = async () => {
    try {
      const response = await props.deleteWaterSchemeDataAction(props.language, editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getSchemeDataAction(props.language);
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
              <th>{t("home:sn")}</th>
              <th> {t("home:applyDate")}</th>
              <th>{t("home:houseConn")}</th>
              <th>{t("home:instConn")}</th>
              <th>{t("home:publicConn")}</th>
              <th>{t("home:commercialConn")}</th>
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.waterSchemeData?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td> {getNumberByLanguage(item.apply_date)}</td>
                <td> {getNumberByLanguage(item.household_connection) || "-"}</td>
                <td> {getNumberByLanguage(item.institutional_connection) || "-"}</td>
                <td> {getNumberByLanguage(item.public_connection) || "-"}</td>
                <td> {getNumberByLanguage(item.commercial_connection) || "-"}</td>

                <td className="action">
                  <div role="button" onClick={() => props.setEditData(item)}>
                    <img src={EditActionIcon} alt="" />
                  </div>
                  <div role="button" onClick={() => handleDeleteClick(item.id)}>
                    <img src={DeleteIcon} alt="" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        open={modal}
        handleModal={() => toggleModal()}
        handleConfirmClick={() => deleteWaterSchedule()}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
  waterSchemeData: state.waterSchemeData.getWaterSchemeData.data,
});

const mapDispatchToProps = {
  getWaterSupplyScheduleAction,
  deleteWaterSchemeDataAction,
  getSchemeDataAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
