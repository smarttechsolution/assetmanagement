import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { deleteInflationParametersAction } from "store/modules/inflationParameters/deleteInflationParameters";
import { getInflationParametersAction } from "store/modules/inflationParameters/getInflationParameters";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import ConfirmationModal from "components/UI/ConfirmationModal";

interface Props extends PropsFromRedux {
  setEditData: any;
}

const UseBasedList = (props: Props) => {
  const { t } = useTranslation();

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } = useDeleteConfirmation();

  React.useEffect(() => {
    if (props.language) {
      props.getInflationParametersAction(props.language);
    }
  }, [props.language]);

  const handleDelete = async () => {
    const response: any = await props.deleteInflationParametersAction(props.language, editId);

    if (response.status === 204) {
      toast.success(t('home:deleteSuccess'));
      props.getInflationParametersAction(props.language);
    } else {
      toast.error(t('home:deleteError'));;
    }
  };

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>{t("home:sn")}</th>
              <th>{t("finance:inflation")}</th>
              <th>{t("finance:editState")}</th>
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.inflationParametersList?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td> {item.rate}</td>
                <td> {item.dis_allow_edit ? "Disallow" : "Allow"}</td>

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
  inflationParametersList: state.inflationParametersData.getInflationParameters.data,
});

const mapDispatchToProps = {
  deleteInflationParametersAction: deleteInflationParametersAction,
  getInflationParametersAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UseBasedList);
