import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { deleteComponentAction } from "store/modules/component/deleteComponent";
import { getComponentAction } from "store/modules/component/getComponent";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import ConfirmationModal from "components/UI/ConfirmationModal";

interface Props extends PropsFromRedux {
  setEditData: any;
}

const ComponentList = (props: Props) => {
  const { t } = useTranslation();

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  React.useEffect(() => {
    props.getComponentAction();
  }, []);

  const handleDelete = async () => {
    const response: any = await props.deleteComponentAction(editId);

    if (response.status === 204) {
      toast.success(t("home:deleteSuccess"));
      props.getComponentAction();
      resetDeleteData();
    } else {
      toast.error(t("home:deleteError"));
      resetDeleteData();
    }

    if(response.status === 403){
      toast.success(t("home:deleteSuccess"));
      resetDeleteData();
    }
  };

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th style={{ borderRadius: "5px 0 0 0" }}>{t("home:sn")}</th>
              <th>{t("maintainance:category")}</th>
              <th>{t("maintainance:component")}</th>
              <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.componentList?.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td> {item.category?.name}</td>
                <td> {item.name}</td>

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
  componentList: state.component.getComponent.data,
});

const mapDispatchToProps = {
  getComponentAction: getComponentAction,
  deleteComponentAction: deleteComponentAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ComponentList);
