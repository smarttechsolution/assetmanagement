import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import Button from "components/UI/Forms/Buttons";
import GeneralModal from "components/UI/GeneralModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { deleteComponentInfoAction } from "store/modules/componentInfo/deleteComponentInfo";
import { getComponentInfoByIdAction } from "store/modules/componentInfo/getComponentInfoById";
import {
  DashboardComponentInfoType,
  getDashboardComponentInfoAction,
} from "store/modules/maintainance/dashboardComponentInfo";
import { RootState } from "store/root-reducer";
import ComponentInfoForm from "./ComponentInfoForm";
import CostDataHeader, { CostData } from "./Components/CostData";
import NormalDataHeader, { NormalData } from "./Components/NormalData";
import RiskDataHeader, { RiskData } from "./Components/RiskData";
import { SRLWrapper } from "simple-react-lightbox";
import Thumbnail from "assets/images/thumbnail.png";


interface IProps extends PropsFromRedux {}

const AssetTable = (props: IProps) => {
  const { t } = useTranslation(["maintainance"]);
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const [editData, setEditData] = React.useState<any>(null);
  const [modalForm, setModalForm] = React.useState(false);

  const [showRisk, setShowRisk] = React.useState(false);
  const [showCost, setShowCost] = React.useState(false);

  const [tableData, setTableData] = React.useState<any>(null);

  const toggleComponentModal = () => {
    if (modalForm) {
      setEditData(null);
    }
    setModalForm(!modalForm);
  };

  React.useEffect(() => {
    if (props.schemeSlug) {
      props.getDashboardComponentInfoAction(props.language, props.schemeSlug);
    }
  }, [props.language, props.schemeSlug]);

  React.useEffect(() => {
    if (props.componentData) {
      const newGroupedData: any = {};

      props.componentData.forEach((data) => {
        if (data.component.category.name in newGroupedData) {
          newGroupedData[data.component.category.name].push(data);
        } else {
          newGroupedData[data.component.category.name] = [data];
        }
      });
      setTableData(newGroupedData);
    }
  }, [props.componentData]);

  const handleDelete = async () => {
    try {
      const response = await props.deleteComponentInfoAction(editId);
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getDashboardComponentInfoAction(props.language, props.schemeSlug);
        resetDeleteData();
      } else {
        toast.error(t("home:deleteError"));
        resetDeleteData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleEditClick = (id, component) => {
    props.getComponentInfoByIdAction(props.language, id).then((res) => {
      if (res.data) {
        setEditData({ ...res.data, component });
      }
    });
  };

  console.log(tableData, "newGroupedData");
  return (
    <div className="tabular">
      <table className="table-02">
        <tbody>
          <>
            <tr className="">
              <th scope="col" colSpan={7}>
                <Button
                  className="btn custom-btn mb-2"
                  text={t("maintainance:aci")}
                  type="submit"
                  onClick={toggleComponentModal}
                  // disabled={authorizing}
                  // loading={authorizing}
                />
              </th>
              <th
                scope="col"
                className={showRisk || showCost ? "placeholder" : "top-headers"}
                colSpan={3}
              >
                {!showRisk && !showCost && t("maintainance:mitigation")}
              </th>
              {/* <th
                scope="col"
                className={showRisk || showCost ? "placeholder" : "top-headers"}
                colSpan={3}
              >
                {!showRisk && !showCost && t("maintainance:responsible")}
              </th> */}
            </tr>
          </>

          <tr className="header">
            <th scope="col" className="bg-header" style={{ width: 350, borderRadius: "5px 0 0 0" }}>
              {t("maintainance:assetComponent")}
            </th>
            <th scope="col" className="bg-header" colSpan={1} style={{  }}>
              {t("maintainance:dopf")}
            </th>
            <th scope="col" className="bg-header" style={{  }}>
              {t("maintainance:interval")}
            </th>
            <th scope="col" className="bg-header" style={{  }}>
              {t("maintainance:responsible")}
            </th>
            <th scope="col" className="bg-header" style={{ borderRadius: "0 5px 0 0" }}>
              {t("home:action")}
            </th>

            {/* add responsible here */}

            {showCost ? (
              <CostDataHeader onClick={() => setShowCost(false)} />
            ) : showRisk ? (
              <>
                <RiskDataHeader onClick={() => setShowRisk(false)} />
              </>
            ) : (
              <th
                scope="col"
                rowSpan={2}
                className="expand-header risk-tab"
                role="button"
                onClick={() => setShowRisk(!showRisk)}
              >
                <span className="pill" role="button" onClick={() => setShowRisk(!showRisk)}>
                  {t("maintainance:risk")}
                </span>
                {t("maintainance:click")}
              </th>
            )}

            {showRisk || showCost ? (
              <></>
            ) : (
              <th
                scope="col"
                rowSpan={2}
                className="expand-header  cost-tab"
                role="button"
                onClick={() => setShowCost(!showCost)}
              >
                <span className="pill" role="button" onClick={() => setShowCost(!showCost)}>
                  {t("maintainance:cost")}
                </span>
                {t("maintainance:click")}
              </th>
            )}

            {showRisk ||
              (showCost ? (
                <></>
              ) : (
                <>
                  <NormalDataHeader />
                </>
              ))}
          </tr>

          {tableData &&
            Object.entries(tableData).map((item) => {
              return (
                <React.Fragment>
                  <tr>
                    <td colSpan={showCost ? 9 : 5} className="component-title">
                      {item[0]}
                    </td>
                  </tr>
                  {item[1] instanceof Array &&
                    item[1].map((data: DashboardComponentInfoType) => (
                      <tr>
                        <td>
                          <div className="d-flex">
                            <div className="component-image-wrapper">
                              <SRLWrapper >
                                <img src={data.componant_picture || Thumbnail} alt="" />
                              </SRLWrapper>
                            </div>
                            {data.component.name}
                          </div>
                        </td>
                        <td>{data.possible_failure}</td>
                        <td>{data.maintenance_interval} {data.interval_unit}</td>
                        <td>{data.responsible}</td>
                        <td className="action">
                          <div
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(data.id, data.component);
                              toggleComponentModal();
                            }}
                          >
                            <img src={EditIconDark} alt="" />
                          </div>
                          <div
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(data.id);
                            }}
                          >
                            <img src={DeleteIcon} alt="" />
                          </div>
                        </td>

                        {!showRisk && (
                          <td
                            className={`
                        ${
                          data.resulting_risk_score <= 4
                            ? "bg-green"
                            : data.resulting_risk_score <= 8
                            ? "bg-yellow"
                            : data.resulting_risk_score <= 12
                            ? "bg-orange"
                            : "bg-red"
                        }
                        `}
                            role="button"
                            onClick={() => setShowRisk(!showRisk)}
                          >
                            {data.resulting_risk_score}
                          </td>
                        )}
                        {showRisk || showCost ? (
                          <></>
                        ) : (
                          <td className="text-center">
                            {props.currency} {data.seggregated_or_unseggregated_cost}
                          </td>
                        )}
                        {showRisk || showCost ? (
                          <>
                            {showCost ? (
                              <CostData data={data} currency={props.currency} />
                            ) : showRisk ? (
                              <>
                                <RiskData data={data} onClick={() => setShowRisk(false)} />
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <>
                            <NormalData data={data} />
                          </>
                        )}
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
        </tbody>
      </table>

      <GeneralModal
        title={t("maintainance:addEditaci")}
        size="xl"
        open={modalForm}
        toggle={() => {
          if (modalForm) {
            setEditData(null);
          }
          toggleComponentModal();
        }}
      >
        <ComponentInfoForm editData={editData} setEditData={setEditData} toggle={setModalForm} />
      </GeneralModal>

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
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency,
  componentData: state.maintainanceData.dashboardComponentInfoData.data,
});

const mapDispatchToProps = {
  getDashboardComponentInfoAction: getDashboardComponentInfoAction,
  deleteComponentInfoAction: deleteComponentInfoAction,
  getComponentInfoByIdAction: getComponentInfoByIdAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AssetTable);
