import { DeleteIcon, EditIconDark, ViewIcon } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import GeneralModal from "components/UI/GeneralModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { deleteWaterSupplyTestAction } from "store/modules/waterSupplyTest/deleteWaterSupplyTest";
import { getWaterSupplyTestAction } from "store/modules/waterSupplyTest/getWaterSupplyTest";
import { RootState } from "store/root-reducer";

interface Props extends PropsFromRedux {
  setEditData: any;
  toggle: any;
}

const List = (props: Props) => {
  const { t } = useTranslation();

  const [parameterModal, setParameterModal] = React.useState(false);
  const [parameterData, setParameterData] = React.useState<any>(null);

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getWaterSupplyTestAction(props.language));
  }, []);

  const deleteTestParameters = async () => {
    try {
      const response = await props.deleteWaterSupplyTestAction(props.language,editId);
      console.log(response, "response");
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getWaterSupplyTestAction(props.language);
        resetDeleteData();
      } else {
        toast.error(t("home:deleteError"));
        resetDeleteData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  console.log(parameterData, "parameterDataparameterData")

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th style={{ borderRadius: "5px 0 0 0" }}>{t("home:sn")}</th>
              <th>{t("home:date")}</th>
              <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.waterTestResult &&
              props.waterTestResult?.map((item, index) => (
                <tr key={item.id}>
                  <td>{getNumberByLanguage(index + 1)}</td>
                  <td> {item.date}</td>

                  <td className="action justify-content-center">
                    <div
                      role="button"
                      onClick={() => {
                        setParameterModal(!parameterModal);
                        setParameterData(item)
                      }}
                    >
                      <img src={ViewIcon} alt="" className="mr-4" />
                    </div>
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

      <GeneralModal
        title={t("home:qtp")}
        size="xl"
        open={parameterModal}
        toggle={() => {
          setParameterModal(!parameterModal);
        }}
      >
        <div className="data-table">
          <div className="table-responsive">
            <table className="table mt-2">
              <thead>
                <tr>
                  <th style={{ borderRadius: "5px 0 0 0" }}>{t("home:sn")}</th>
                  <th>{t("home:parameter")}</th>
                  <th>{t("home:value")}</th> 
                </tr>
              </thead>
              <tbody>
                {parameterData &&
                  parameterData?.test_result_parameter?.map((item, index) => (
                    <tr key={item.id}>
                      <td>{getNumberByLanguage(index + 1)}</td>
                      <td> {item.name}</td>
                      <td> {item.value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </GeneralModal>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  waterTestResult: state.waterSupplyTest.waterSupplyTestData.data,
});

const mapDispatchToProps = {
  deleteWaterSupplyTestAction: deleteWaterSupplyTestAction,
  getWaterSupplyTestAction: getWaterSupplyTestAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
