import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { deleteIncomeCategoriesAction } from "store/modules/income/deleteIncomeCategory";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
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

  const deleteIncomeCategory = async () => {
    try {
      const response = await props.deleteIncomeCategoriesAction(editId);

      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getIncomeCategoryAction(props.schemeSlug);
        resetDeleteData();
      } else {
        if (response?.data?.error) {
          toast.error(response?.data?.error);
        } else {
          toast.error(t("home:deleteError"));
        }

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
              <th  style={{ borderRadius: "5px 0 0 0" }}>{t("home:sn")}</th>
              <th>{t("finance:categoryName")}</th>
              <th style={{ borderRadius: "0 5px 0 0" }}>{t("home:action")}</th>
            </tr>
          </thead>
          <tbody>
            {props.incomeCategories?.map((item, index) => (
              <tr key={item.id}>
                <td>{getNumberByLanguage(index + 1)}</td>
                <td> {item.name}</td>

                <td className="action text-right">
                  <div role="button" className="text-right" onClick={() => props.setEditData(item)}>
                    <img src={EditIconDark} alt="" />
                  </div>
                  <div
                    role="button"
                    className="text-right"
                    onClick={() => handleDeleteClick(item.id)}
                  >
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
        handleConfirmClick={() => deleteIncomeCategory()}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  incomeCategories: state.incomeData.getIncomeCategory.data,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
});

const mapDispatchToProps = {
  deleteIncomeCategoriesAction,
  getIncomeCategoryAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(List);
