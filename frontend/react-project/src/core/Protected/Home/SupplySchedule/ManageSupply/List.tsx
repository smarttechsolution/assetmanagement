import { DeleteIcon, EditActionIcon } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/deleteSupplySchedule";
import { getWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/getWaterSupplySchedule";
import { RootState } from "store/root-reducer";

interface Props extends PropsFromRedux {
  setEditData: any;
}

const List = (props: Props) => {
  const { t } = useTranslation(["home"]);
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } = useDeleteConfirmation();

  const deleteWaterSchedule = async () => {
    try {
      const response = await props.deleteWaterSupplyScheduleAction(props.language, editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t('home:deleteSuccess'));
        props.getWaterSupplyScheduleAction(props.language, "test-scheme");
        resetDeleteData()
      } else {
        toast.error(t('home:deleteError'));;
        resetDeleteData()
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
              <th>{t("home:day")}</th>
              <th>{t("home:supplyBelt")}</th>
              <th>{t("home:morning")}</th>
              <th>{t("home:evening")}</th>
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.supplySchedule?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td> {item.day}</td>
                <td> {item.supply_belts || "-"}</td>
                <td>
                  {item.morning_from_time} - {item.evening_to_time}
                </td>
                <td>
                  {item.evening_from_time} - {item.evening_to_time}
                </td>
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
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
});

const mapDispatchToProps = {
  getWaterSupplyScheduleAction,
  deleteWaterSupplyScheduleAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
