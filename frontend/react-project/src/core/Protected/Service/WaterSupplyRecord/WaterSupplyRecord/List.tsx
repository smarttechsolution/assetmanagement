import { DeleteIcon, EditIconDark } from "assets/images/xd";
<<<<<<< HEAD
import toast from "components/React/ToastNotifier/ToastNotifier";
import React from "react";
import { connect, ConnectedProps, useDispatch, useSelector } from "react-redux";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import ConfirmationModal from "components/UI/ConfirmationModal";
import { getWaterSupplyRecordAction } from "store/modules/waterSupplyRecord/getWaterSupplyRecord";
import { deleteWaterSupplyRecordAction } from "store/modules/waterSupplyRecord/deleteWaterSupplyRecord";
=======
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import CustomCheckBox from "components/UI/CustomCheckbox";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { deleteWaterSupplyRecordAction } from "store/modules/waterSupplyRecord/deleteWaterSupplyRecord";
import { getWaterSupplyRecordAction } from "store/modules/waterSupplyRecord/getWaterSupplyRecord";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
>>>>>>> ams-final

interface Props extends PropsFromRedux {
  setEditData: any;
  toggle: any;
}

const List = (props: Props) => {
<<<<<<< HEAD
=======
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");


  const [ids, setIds] = useState<Array<number>>([]);

>>>>>>> ams-final
  const { t } = useTranslation();
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const dispatch = useDispatch();

<<<<<<< HEAD
  React.useEffect(() => {
    dispatch(getWaterSupplyRecordAction(props.language));
  }, []);
=======
  useEffect(() => {
    if (props.language && startDate && endDate) {
      dispatch(getWaterSupplyRecordAction(props.language, startDate, endDate));
    } else {
      dispatch(getWaterSupplyRecordAction(props.language));
    }
  }, [props.language, startDate, endDate]);
>>>>>>> ams-final

  const deleteTestParameters = async () => {
    try {
      const response = await props.deleteWaterSupplyRecordAction(props.language, editId);
<<<<<<< HEAD
      console.log(response, "response");
=======
      // console.log(response, "response");
>>>>>>> ams-final
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getWaterSupplyRecordAction(props.language);
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
<<<<<<< HEAD
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th style={{ borderRadius: "5px 0 0 0" }}>{t("home:sn")}</th>
              <th>{t("home:supplyDate")}</th>
              <th>{t("home:totalSupply")}</th> 
              <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.waterSupplyRecordData &&
              props.waterSupplyRecordData?.map((item, index) => (
                <tr key={item.id}>
                  <td>{getNumberByLanguage(index + 1)}</td>
                  <td> {item.supply_date}</td>
                  <td> {item.total_supply || "-"}</td>

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
=======
    <div className="row justify-content-end mt-4">
      <div className="col-md-3">
        <div className="form-group my-0 mr-3">
          <div className="row mt-1">
            <div className="col-4">
              <label htmlFor="" style={{ width: "115%" }}>{t("finance:datefrom")}:</label>
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
              <label htmlFor="">{t("finance:dateto")}:</label>
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
                  {/* <th>{t("home:supplystartDate")}</th> */}
                  <th>{t("home:supplyDate")}</th>
                  {/* <th>{t("home:supplyendDate")}</th> */}
                  <th>{t("home:totalSupply")} {t("home:inliters")}</th>
                  <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
                </tr>
              </thead>
              <tbody>
                {props.waterSupplyRecordDataLoading ? (
                  <tr>
                    <td className="text-center" colSpan={4}>
                      Loading ...
                    </td>
                  </tr>
                ) : props.waterSupplyRecordData && props.waterSupplyRecordData?.length > 0 ? (
                  props.waterSupplyRecordData?.map((item, index) => (
                    <tr key={item.id}>
                      <td>{getNumberByLanguage(index + 1)}</td>
                      <td> {item.supply_date}</td>
                      {/* <td>{item.supply_end_date}</td> */}
                      <td> {item.total_supply || "-"}</td>

                      <td className="action justify-content-center">
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
                    <td className="text-center" colSpan={4}>
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
        </div>
      </div>
>>>>>>> ams-final
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  waterSupplyRecordData: state.waterSupplyRecord.waterSupplyRecordData.data,
<<<<<<< HEAD
=======
  waterSupplyRecordDataLoading: state.waterSupplyRecord.waterSupplyRecordData.isFetching,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
>>>>>>> ams-final
});

const mapDispatchToProps = {
  deleteWaterSupplyRecordAction: deleteWaterSupplyRecordAction,
  getWaterSupplyRecordAction: getWaterSupplyRecordAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
