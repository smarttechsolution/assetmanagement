import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import React from "react";
import { connect, ConnectedProps, useDispatch, useSelector } from "react-redux";
import { deleteTestParametersAction } from "store/modules/testParamters/deleteTestParameters";
import { getTestParametersAction } from "store/modules/testParamters/getTestParameters";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import ConfirmationModal from "components/UI/ConfirmationModal";

interface Props extends PropsFromRedux {
  setEditData: any;
  toggle: any;
}

const List = (props: Props) => {
  const { t } = useTranslation();
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTestParametersAction());
  }, []);

  const testParameters = useSelector(
    (state: RootState) => state.testParamtersData.testParametersData.data
  );

  const deleteTestParameters = async () => {
    try {
      const response = await props.deleteTestParametersAction(editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getTestParametersAction();
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
              <th style={{ borderRadius: "5px 0 0 0" }}>{t("home:sn")}</th>
              <th>{t("home:parameter")}</th>
              <th>{t("home:units")}</th>
              <th>{t("home:ndwq")}</th>
              <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {testParameters &&
              testParameters?.map((item, index) => (
                <tr key={item.id}>
                  <td>{getNumberByLanguage(index + 1)}</td>
                  <td> {item.parameter_name}</td>
                  <td> {item.unit || "-"}</td>
                  <td>{item.NDWQS_standard || "-"}</td>

                  <td className="action justify-content-center">
                    <div role="button" onClick={() => props.setEditData(item)}>
                      <img src={EditIconDark} alt="" className="mr-4" />
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
        handleConfirmClick={() => deleteTestParameters()}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
});

const mapDispatchToProps = {
  deleteTestParametersAction,
  getTestParametersAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
