import { DeleteIcon, EditActionIcon } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteSupplyBeltAction } from "store/modules/supplyBelts/deleteSupplyBelt";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { getWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/getWaterSupplySchedule";
import { RootState } from "store/root-reducer";

interface Props extends PropsFromRedux {
  setEditData: any;
  toggle: any;
}

const List = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } = useDeleteConfirmation();

 

  const deleteWaterSchedule = async () => {
    try {
      const response = await props.deleteSupplyBeltAction(props.language, editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t('home:deleteSuccess'));
        props.getSupplyBeltsAction(props.language, props.schemeSlug);
        resetDeleteData();
      } else {
        toast.error(t('home:deleteError'));;
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
              <th>{t("home:name")}</th>
              <th>{t("home:coverageArea")}</th>
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.supplyBeltsList?.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td> {item.name}</td>
                <td> {item.belt_type || "-"}</td>

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
  supplyBeltsList: state.supplyBeltsData.getSupplyBeltData.data,
});

const mapDispatchToProps = {
  getWaterSupplyScheduleAction,
  deleteSupplyBeltAction: deleteSupplyBeltAction,
  getSupplyBeltsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
