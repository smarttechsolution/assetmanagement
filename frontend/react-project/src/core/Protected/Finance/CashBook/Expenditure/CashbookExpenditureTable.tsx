import { DeleteIcon, EditIconDark } from "assets/images/xd";
import toast from "components/React/ToastNotifier/ToastNotifier";
import ConfirmationModal from "components/UI/ConfirmationModal";
import Button from "components/UI/Forms/Buttons";
import GeneralModal from "components/UI/GeneralModal";
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Table } from "reactstrap";
import { deleteExpenditureAction } from "store/modules/expenditure/deleteExpense";
import { getExpenditureAction } from "store/modules/expenditure/getExpenditure";
import { getExpenditureCategoryAction } from "store/modules/expenditure/getExpenditureCategory";
import { getPreviousExpenditureTotalAction } from "store/modules/expenditure/getPreviousExpenditureTotal";
import { RootState } from "store/root-reducer";
import { getDefaultDate } from "utils/utilsFunction/date-converter";
import { sortAplabetically } from "utils/utilsFunction/sorting";
import ExpenseForm from "./ExpenseForm";
import ManageExpenditureCatagories from "./ManageExpenditureCategories";

interface Props extends PropsFromRedux {
  activeDate: string;
  activeTab: string;
}

const CashbookExpenditureTable = (props: Props) => {
  const [editData, setEditData] = useState<any>();
  const [categoriesModal, setCategoriesModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const toggle = () => setCategoriesModal(!categoriesModal);
  const toggleIncomeModal = () => {
    setExpenseModal(!expenseModal);
  };

  const {
    expenditureData,
    expenditureCategories,
    language,
    schemeSlug,
    schemeDetails,
    previousExpenditureTotal,
    getExpenditureAction,
    getExpenditureCategoryAction,
    getPreviousExpenditureTotalAction,
  } = props;

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  // 2020 = 2020
  // props.activeDate?.split("-")[1] =9

  useEffect(() => {
    if (language && schemeSlug && schemeDetails && props.activeTab) {
      if (props.activeTab === "2") {
        getExpenditureAction(
          language,
          schemeSlug,
          props.activeDate?.split("-")[0] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[0],
          props.activeDate?.split("-")[1] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[1]
        );
        getExpenditureCategoryAction(schemeSlug);
        getPreviousExpenditureTotalAction(
          language,
          schemeSlug,
          props.activeDate?.split("-")[0] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[0],
          props.activeDate?.split("-")[1] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[1]
        );
      }
    }
  }, [language, props.activeDate, schemeSlug, schemeDetails, props.activeTab]);

  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      const response = await props.deleteExpenditureAction(editId);
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getExpenditureAction(props.language, props.schemeSlug);
        resetDeleteData();
      } else {
        toast.error(t("home:deleteError"));
        resetDeleteData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    toggleIncomeModal();
  };

  return (
    <>
      <div className="mt-3">
        <div className="row my-3">
          <div className="col-6 text-left">
            <Button
              className="btn custom-btn  mr-3"
              text={t("finance:addTxn")}
              onClick={toggleIncomeModal}
            />
          </div>
          <div className="col-6 text-right">
            <Button
              className="btn custom-btn  mr-3"
              text={t("finance:manageEC")}
              // disabled={authorizing}
              // loading={authorizing}
              onClick={toggle}
            />
          </div>
        </div>
        <div className="data-table table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>{t("cashbook:date")}</th>
                <th>{t("cashbook:description")}</th>
                {sortAplabetically(expenditureCategories, "name")?.map((category, index) => (
                  <th key={index}>{category.name}</th>
                ))}
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>{t("cashbook:from-prev-month")}</td>
                {sortAplabetically(expenditureCategories, "name")?.map((incomeCategory, index) => {
                  const findData = previousExpenditureTotal?.previous_month_data?.find(
                    (prev) => prev.expense_category_name === incomeCategory.name
                  );
                  if (findData) {
                    return (
                      <td key={index}>
                        {props.schemeDetails?.currency} {findData.total_expense_amount}
                      </td>
                    );
                  } else {
                    return <td key={index}>-</td>;
                  }
                })}
              </tr>

              {expenditureData?.map((income, index) => (
                <tr key={index}>
                  <td>{language === "en" ? income.date : income.date_np}</td>
                  <td>{income.title}</td>
                  {sortAplabetically(expenditureCategories, "name")?.map(
                    (incomeCategory, index) => {
                      if (income.category.name === incomeCategory.name) {
                        return (
                          <td key={index}>
                            {props.schemeDetails?.currency} {income.income_amount}
                          </td>
                        );
                      } else {
                        return <td key={index}>-</td>;
                      }
                    }
                  )}
                  <td className="action">
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(income);
                      }}
                    >
                      <img src={EditIconDark} alt="" />
                    </div>
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(income.id);
                      }}
                    >
                      <img src={DeleteIcon} alt="" />
                    </div>
                  </td>
                </tr>
              ))}

              <tr>
                <td></td>
                <td>{t("cashbook:total")}</td>
                {sortAplabetically(expenditureCategories, "name")?.map((incomeCategory, index) => {
                  const findData = previousExpenditureTotal?.present_month_data?.find(
                    (prev) => prev.expense_category_name === incomeCategory.name
                  );
                  if (findData) {
                    return (
                      <td key={index}>
                        {props.schemeDetails?.currency} {findData.total_expense_amount}
                      </td>
                    );
                  } else {
                    return <td key={index}>-</td>;
                  }
                })}
                <td></td>
              </tr>

              {/* {props.sliderImages &&
              props.sliderImages instanceof Array &&
              props.sliderImages?.length > 0 && (
                <>
                  <tr role="button" onClick={() => setCategoriesModal(true)}>
                    <td>
                      <img src={CameraIcon} alt="" /> &nbsp;&nbsp; Paper Cashbook Image -{" "}
                      {getMonthByLanguageAndScheme(
                        "" + 9,
                        // getDefaultDate(schemeDetails?.system_date_format)?.split("-")[1],
                        props.schemeDetails?.system_date_format
                      )}
                    </td>
                  </tr>
                </>
              )} */}
            </tbody>
          </table>
        </div>

        <GeneralModal
          title={t("finance:manageform")}
          open={categoriesModal}
          toggle={toggle}
          size="lg"
        >
          <ManageExpenditureCatagories />
        </GeneralModal>

        <GeneralModal
          title={t("finance:expenseform")}
          size="lg"
          open={expenseModal}
          toggle={() => {
            if (expenseModal) {
              setEditData(null);
            }
            toggleIncomeModal();
          }}
        >
          <ExpenseForm
            editData={editData}
            setEditData={setEditData}
            toggle={setExpenseModal}
            activeDate={props.activeDate}
          />
        </GeneralModal>

        <ConfirmationModal
          open={modal}
          handleModal={() => toggleModal()}
          handleConfirmClick={() => handleDelete()}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  sliderImages: state.incomeData.getIncomeExpenseImgae.data,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  expenditureData: state.expenditureData.getExpenditureData.data,
  expenditureCategories: state.expenditureData.getExpenditureCategory.data,
  previousExpenditureTotal: state.expenditureData.getPreviousExpenditureTotal.data,
});

const mapDispatchToProps = {
  getExpenditureAction: getExpenditureAction,
  deleteExpenditureAction: deleteExpenditureAction,
  getExpenditureCategoryAction: getExpenditureCategoryAction,
  getPreviousExpenditureTotalAction: getPreviousExpenditureTotalAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashbookExpenditureTable);
