import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteComponentLogsAction } from "store/modules/componentLogs/deleteComponentLogs";
import { getComponentLogsAction } from "store/modules/componentLogs/getComponentLogs";
import { getComponentLogsByIdAction } from "store/modules/componentLogs/getComponentLogsById";
import { RootState } from "store/root-reducer";

interface Props extends PropsFromRedux {
  setEditData: any;
}

const ManageComponentLists = (props: Props) => {
  const { t } = useTranslation();

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  React.useEffect(() => {
    if (props.language) {
      props.getComponentLogsAction(props.language);
    }
  }, [props.language]);

  const handleDelete = async () => {
    const response: any = await props.deleteComponentLogsAction(editId);

    if (response.status === 204) {
      toast.success(t("home:deleteSuccess"));
      props.getComponentLogsAction(props.language);
    } else {
      toast.error(t("home:deleteError"));
    }
    toggleModal()
  };

  const handleEditClick = (id) => {
    props.getComponentLogsByIdAction(props.language, id);
  };

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>{t("home:sn")}</th>
              <th>{t("maintainance:component")}</th>
              <th>
                {t("home:maintainance")} {t("home:date")}
              </th>
              <th>{t("home:duration")}</th>
              <th>
                {t("home:total")} {t("home:cost")}
              </th>
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.componentInfoLogs?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td> {item.component_name}</td>
                <td> {item.maintenance_date}</td>
                <td> {item.duration}</td>
                <td> {item.cost_total}</td>

                <td className="action">
                  <div role="button" onClick={() => props.setEditData(item)}>
                    <img src={EditIconDark} alt="" />
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
        handleConfirmClick={() => handleDelete()}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  componentInfoLogs: state.componentLogs.getComponentLogs.data,
});

const mapDispatchToProps = {
  deleteComponentLogsAction: deleteComponentLogsAction,
  getComponentLogsAction: getComponentLogsAction,
  getComponentLogsByIdAction: getComponentLogsByIdAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ManageComponentLists);
