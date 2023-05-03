import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { deleteOtherExpensesAction } from "store/modules/otherExpenses/deleteOtherExpenses";
import { getOtherExpensesAction } from "store/modules/otherExpenses/getOtherExpenses";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import ConfirmationModal from "components/UI/ConfirmationModal";

interface Props extends PropsFromRedux {
  setEditData: any;
}

const OtherExpenseList = (props: Props) => {
  const { t } = useTranslation();
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } = useDeleteConfirmation();

  React.useEffect(() => {
    if (props.language) {
      props.getOtherExpensesAction(props.language);
    }
  }, [props.language]);

  const handleDelete = async () => {
    const response: any = await props.deleteOtherExpensesAction(props.language, editId);

    if (response.status === 204) {
      toast.success(t('home:deleteSuccess'));
      props.getOtherExpensesAction(props.language);
      resetDeleteData();
    } else {
      toast.error(t('home:deleteError'));;
      resetDeleteData();
    }
  };

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            <tr>
              <th>{t("home:sn")}</th>
              <th>{t("finance:transactionType")}</th>
              <th>{t("finance:expenseHeading")}</th>
              <th>{t("finance:yearlyExpnd")}</th>
              <th>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.otherExpenseList?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td> {item.category}</td>
                <td> {item.title}</td>

                <td>
                  {props.scheme?.currency}. {item.yearly_expense || "-"}
                </td>
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
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  otherExpenseList: state.otherExpensesData.getOtherExpenseData.data,
});

const mapDispatchToProps = {
  getOtherExpensesAction,
  deleteOtherExpensesAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(OtherExpenseList);
