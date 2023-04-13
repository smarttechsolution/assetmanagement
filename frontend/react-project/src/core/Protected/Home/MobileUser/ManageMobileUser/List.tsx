import { DeleteIcon, EditActionIcon } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteSchemeUserAction } from "store/modules/waterScheme/deleteWaterSchemeUser";
import { getSchemeUserAction } from "store/modules/waterScheme/getWaterSchemeUser";
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

  React.useEffect(() => {
    props.getSchemeUserAction();
  }, []);

  const deleteAppUsers = async () => {
    try {
      const response = await props.deleteSchemeUserAction(editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getSchemeUserAction();
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
              <th>{t("home:name")}</th>
              <th>{t("home:phone")}</th>
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.caretakerList?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td> {item.name}</td>
                <td> {getNumberByLanguage(item.phone_number) || "-"}</td>
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
        handleConfirmClick={() => deleteAppUsers()}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  caretakerList: state.waterSchemeData.getWaterSchemeUser.data,
});

const mapDispatchToProps = {
  getWaterSupplyScheduleAction,
  deleteSchemeUserAction,

  getSchemeUserAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
