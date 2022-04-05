import { DeleteIcon, EditIconDark } from "assets/images/xd";
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
    dispatch(getWaterSupplyRecordAction(props.language));
  }, []);

  const deleteTestParameters = async () => {
    try {
      const response = await props.deleteWaterSupplyRecordAction(props.language, editId);
      console.log(response, "response");
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
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  waterSupplyRecordData: state.waterSupplyRecord.waterSupplyRecordData.data,
});

const mapDispatchToProps = {
  deleteWaterSupplyRecordAction: deleteWaterSupplyRecordAction,
  getWaterSupplyRecordAction: getWaterSupplyRecordAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
