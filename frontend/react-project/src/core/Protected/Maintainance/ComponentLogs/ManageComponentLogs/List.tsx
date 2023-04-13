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
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import Thumbnail from "assets/images/thumbnail.png";
import { postComponentLogsAction } from "store/modules/componentLogs/postComponentLogs";
import { updateComponentLogsAction } from "store/modules/componentLogs/updateComponentLogs";

interface Props extends PropsFromRedux {
  editData: any;
  setEditData: any;
  toggle: any;
  issueType?: any;
  setLogType?: Function;
}

const ManageComponentLists = (props: Props) => {
  const { t } = useTranslation();

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const [logTypeData, setLogTypeData] = React.useState<any>([]);
  const [issueLogScreen, setIssueLogScreen] = React.useState<Boolean>(true);
  const [issMaint, setIssMaint] = React.useState<any>([]);



  const handleLogStatus = (editData) => {
    
    if (editData.log_status === true) {
      props.updateComponentLogsAction(props.language, editData.id, {
        log_status: false,
        maintenance_date : editData.maintenance_date,
        is_cost_seggregated : editData.is_cost_seggregated
      });
      toast.success(t("home:updateSuccess"));

      console.log( "True");
      setLogTypeData(data => {
        return data?.map(d => {
          let log_status = d.log_status;
          let maintenance_date = d.maintenance_date;
          let is_cost_seggregated = d.is_cost_seggregated;
          if(d.id === editData.id) {
            log_status = false;
            maintenance_date = editData.maintenance_date;
            is_cost_seggregated = editData.is_cost_seggregated;
          }
          return  {...d, log_status};
        });
      })

    } else if (editData.log_status === false) {
      props.updateComponentLogsAction(props.language, editData.id, {
        log_status: true,
        maintenance_date : editData.maintenance_date,
        is_cost_seggregated : editData.is_cost_seggregated
      });

      toast.success(t("home:updateSuccess"));
      console.log( "False");

      setLogTypeData(data => {
        return data?.map(d => {
          let log_status = d.log_status;
          let maintenance_date = d.maintenance_date;
          let is_cost_seggregated = d.is_cost_seggregated;
          if(d.id === editData.id) {
            log_status = true;
            maintenance_date = editData.maintenance_date;
            is_cost_seggregated = editData.is_cost_seggregated
          }
          return  {...d, log_status};
        });
      })
    }
  }



  React.useEffect(() => {
    if (props.language) {
      props.getComponentLogsAction(props.language);
      // console.log(props.getComponentLogsAction, "Subharaj====================");
      
    }
  }, [props.language]);

  React.useEffect(() => {


    if (props.componentInfoLogs) {
      if (props.issueType) {
        const issueLogs = props.componentInfoLogs.filter((item) => item.log_type === "Issue");
        setLogTypeData(issueLogs);
        setIssueLogScreen(true);
        setIssMaint(`${t("home:issue")} ${t("home:date")}`)
      } else {
        const maintainanceLog = props.componentInfoLogs.filter(
          (item) => item.log_type !== 'Issue'
        );
        setLogTypeData(maintainanceLog);
        setIssueLogScreen(false);
        setIssMaint(`${t("home:maintainance")} ${t("home:date")}`)
      }
    }
  }, [props.componentInfoLogs, props.issueType]);

  // if (props.componentInfoLogs) {
  //   if (props.issueType) {
  //     const issue
  //   }
  // }

  const handleDelete = async () => {
    const response: any = await props.deleteComponentLogsAction(editId);

    if (response.status === 204) {
      toast.success(t("home:deleteSuccess"));
      props.getComponentLogsAction(props.language);
      console.log(props.getComponentLogsAction, "dddddddddddd00000000000000000");
      
    } else {
      toast.error(t("home:deleteError"));
    }
    toggleModal();
  };

  const handleEditClick = (id) => {
    props.getComponentLogsByIdAction(props.language, id);
  };

  // const handleLogStatus =(e) => {
  //   e.target.checked
  //   if( e.target.checked){
  //     // resolved api hit
  //     // const logstat= props.postComponentLogsAction(editId)
  //   }else{
  //     // unresolved api hit
  //   }
  // }

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>{t("home:sn")}</th>
              <th style={{ width: "32%" }}>{t("maintainance:assetComponent")}</th>
              <th>
              {issMaint}
                {/* {t("home:maintainance")} {t("home:date")} */}
                {/* {props.logType ? (`${t("home:issue")} ${t("home:date")}`) : (`${t("home:maintainance")} ${t("home:date")}`)} */}
              </th>
              <th>{t("home:interval")}</th>
              <th>
                {t("home:total")} {t("home:cost")}
              </th>
              {issueLogScreen && <th>{t("finance:logstatus")}</th>}
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {logTypeData?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td>
                  <div className="d-flex ml-3">
                    <div className="component-image-wrapper overflow-hidden">
                      <SimpleReactLightbox>
                        <SRLWrapper>
                          {[item.component_image].flat().map((src, i) => {
                            return <a href={src} key={i}>
                              {/* <img src={src || Thumbnail} alt="" /> */}
                              <img src={src && src || Thumbnail} alt="" />
                            </a>;
                          })}
                          {![item.component_image].flat().length && <img src={Thumbnail} alt="" />}
                        </SRLWrapper>
                      </SimpleReactLightbox>
                    </div>
                    <div className="mt-3 pl-2">
                      {item.component_name}
                    </div>
                  </div>
                </td>
                <td> {item.maintenance_date}</td>
                <td> {item.duration} {item.interval_unit}</td>
                <td> {item.total}</td>

                {issueLogScreen &&
                  <td>
                    {item.log_status ?
                      <button className="btn-resolved"
                      onClick={() => {
                        handleLogStatus(item);
                      }}
                      >
                        <span className="d-flex align-items-center justify-content-center" >
                          Resolved
                        </span>
                      </button>
                      :
                      <button className="btn-unresolved"
                      onClick={() => {
                        handleLogStatus(item);
                      }}
                      >
                        <span className="d-flex align-items-center justify-content-center">
                          Unresolved
                        </span>
                      </button>
                    }</td>
                }

                <td className="action">
                  <div
                    role="button"
                    onClick={() => {
                      props.setEditData(item);
                      props.toggle();
                      props.setLogType?.(item.log_type == 'Issue');
                    }}
                  >
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
  postComponentLogsAction: postComponentLogsAction,
  updateComponentLogsAction: updateComponentLogsAction
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ManageComponentLists);
