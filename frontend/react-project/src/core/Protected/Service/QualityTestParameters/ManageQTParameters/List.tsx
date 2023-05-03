import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import React from "react";
import { connect, ConnectedProps, useDispatch, useSelector } from "react-redux";
import { deleteTestParametersAction } from "store/modules/testParamters/deleteTestParameters";
import { deleteMultipleTestParametersAction } from "store/modules/testParamters/deleteMultipleTestParameters";
import { getTestParametersAction } from "store/modules/testParamters/getTestParameters";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import ConfirmationModal from "components/UI/ConfirmationModal";
import { Alert } from "reactstrap";
import CustomCheckBox from "components/UI/CustomCheckbox";

interface Props extends PropsFromRedux {
  setEditData: any;
  toggle: any;
}

const List = (props: Props) => {
  const { t } = useTranslation();
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  // const [isCheckAll, setIsCheckAll] = React.useState(false);
  // const [idSelected, setIdSelected] = React.useState<Array<number>>([]);

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

  // const handleSelectAll = () => {

  //   const isCheckedAll = testParameters?.length === idSelected?.length;
    
  //   setIsCheckAll(!isCheckedAll);
  //   if(!isCheckedAll){
  //     setIdSelected(testParameters.map(item => item.id))
  //   }else{
  //     setIdSelected([])
  //   }
  // };

  // const selectParameters = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedId = parseInt(event.target.value);

  //   if (idSelected.includes(selectedId)) {
  //     const newIds = idSelected.filter((id) => id !== selectedId);
  //     setIdSelected(newIds)
  //     console.log(newIds, "Checkbox is UnChecked");

  //   } else {
  //     const newIds = [...idSelected];
  //     newIds.push(selectedId);
  //     setIdSelected(newIds)      
  //     console.log(newIds, "Checkbox is Checked");
  //   }
  // }

  // const handleDelete = async (idSelected) => {
  //   try {
  //     const response = await props.deleteTestParametersAction(idSelected);
  //     if (response.status === 204) {
  //       toast.success(t("home:deleteSuccess"));
  //       props.getTestParametersAction();
  //     } else {
  //       toast.error(t("home:deleteError"));
  //     }
  //   } catch (error) {
  //     console.log(error, "error");
  //   }
  // };

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        {/* {idSelected.length ?
          <div id="dlt-status">
            <Alert className="d-flex justify-content-between align-items-center"
              style={{ border: "1px solid rgba(158, 160, 160, 0.5)", minHeight: "60px" }}>

              <p style={{ fontSize: "14px", fontWeight: "400", color:"#000" }}>
                <strong> {idSelected.length} </strong>Item Selected</p>
              <h5 className="des" style={{color: "#000"}}>Are you sure you want to delete ?</h5>

              <div role="button" id="dlt-btn">
                <img src={DeleteIcon} alt="DLT" className="ml-2" style={{ color: "darkred" }}
                  onClick={() => handleDelete(idSelected)} />
              </div>
            </Alert>
          </div> 
          : null
        } */}
        <table className="table mt-2">
          <thead>
            <tr>
              {/* <th>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="selectAll"
                  onChange={() => handleSelectAll()}
                  checked={testParameters?.length === idSelected?.length}
                  id="selectAll"
                  style={{ marginTop: "-19px", marginLeft: "0" }}
                />
              </th> */}

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
                  {/* <td>
                    <input
                      value={item.id}
                      type="checkbox"
                      id="checked-data"
                      className="form-check-input ml-0"
                      onChange={selectParameters}
                      checked={idSelected.includes(item.id) ? true : false}
                    />
                  </td> */}
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
      // handleConfirmClick={() => handleDelete(idSelected)}
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
  deleteMultipleTestParametersAction,
  getTestParametersAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);