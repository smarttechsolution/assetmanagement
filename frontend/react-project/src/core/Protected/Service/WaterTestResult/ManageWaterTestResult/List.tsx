import { DeleteIcon, EditIconDark, ViewIcon } from "assets/images/xd";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import GeneralModal from "components/UI/GeneralModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { deleteWaterSupplyTestAction } from "store/modules/waterSupplyTest/deleteWaterSupplyTest";
import { getWaterSupplyTestAction } from "store/modules/waterSupplyTest/getWaterSupplyTest";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";

interface Props extends PropsFromRedux {
  setEditData: any;
  toggle: any;
}

const List = (props: Props) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [parameterModal, setParameterModal] = React.useState(false);
  const [parameterData, setParameterData] = React.useState<any>(null);

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.language && startDate && endDate) {
      dispatch(getWaterSupplyTestAction(props.language, startDate, endDate));
    } else {
      dispatch(getWaterSupplyTestAction(props.language));
    }
  }, [props.language, startDate, endDate]);

  const deleteTestParameters = async () => {
    try {
      const response = await props.deleteWaterSupplyTestAction(props.language, editId);
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

  return (
    <div className="row justify-content-end mt-4">
      <div className="col-md-3">
        <div className="form-group my-0 mr-3">
          <div className="row mt-1">
            <div className="col-4">
              <label htmlFor="">Date From</label>
            </div>
            <div className="col-8">
              {props.schemeDetails?.system_date_format === "nep" ? (
                <NepaliDatePicker
                  className="form-control"
                  name="name_en"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e);
                  }}
                />
              ) : (
                <EnglishDatePicker
                  name="eng"
                  value={startDate}
                  handleChange={(e) => {
                    setStartDate(formatDate(e));
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group my-0 mr-3">
          <div className="row mt-1">
            <div className="col-4">
              <label htmlFor="">Date To</label>
            </div>
            <div className="col-8">
              {props.schemeDetails?.system_date_format === "nep" ? (
                <NepaliDatePicker
                  className="form-control"
                  name="name_en"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e);
                  }}
                />
              ) : (
                <EnglishDatePicker
                  name="eng"
                  value={endDate}
                  handleChange={(e) => {
                    setEndDate(formatDate(e));
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
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
                {props.waterTestResultFetching ? (
                  <tr>
                    <td className="text-center" colSpan={3}>
                      Loading ...
                    </td>
                  </tr>
                ) : props.waterTestResult && props.waterTestResult?.length > 0 ? (
                  props.waterTestResult?.map((item, index) => (
                    <tr key={item.id}>
                      <td>{getNumberByLanguage(index + 1)}</td>
                      <td> {item.date}</td>

                      <td className="action justify-content-center">
                        <div
                          role="button"
                          onClick={() => {
                            setParameterModal(!parameterModal);
                            setParameterData(item);
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
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={3}>
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
                      <th>{t("home:ndwq")}</th>
                      <th>{t("home:value")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameterData &&
                      parameterData?.test_result_parameter?.map((item, index) => (
                        <tr key={item.id}>
                          <td>{getNumberByLanguage(index + 1)}</td>
                          <td> {item.name}</td>
                          <td> {item.NDWQS}</td>
                          <td> {item.value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GeneralModal>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  waterTestResult: state.waterSupplyTest.waterSupplyTestData.data,
  waterTestResultFetching: state.waterSupplyTest.waterSupplyTestData.isFetching,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
});

const mapDispatchToProps = {
  deleteWaterSupplyTestAction: deleteWaterSupplyTestAction,
  getWaterSupplyTestAction: getWaterSupplyTestAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
