<<<<<<< HEAD
import { CameraIcon } from "assets/images/xd";
=======
import { DeleteIcon, EditIconDark, CameraIcon } from "assets/images/xd";
>>>>>>> ams-final
import GeneralModal from "components/UI/GeneralModal";
import Slider from "components/UI/Slider";
import { getMonthByLanguageAndScheme } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Table } from "reactstrap";
import { geAllExpenditureAction } from "store/modules/expenditure/getAllExpenditure";
import { getExpenditureCategoryAction } from "store/modules/expenditure/getExpenditureCategory";
<<<<<<< HEAD
=======
import { getExpenditureTotalAction } from "store/modules/expenditure/getExpenditureTotal";
>>>>>>> ams-final
import { getPreviousExpenditureTotalAction } from "store/modules/expenditure/getPreviousExpenditureTotal";
import { RootState } from "store/root-reducer";
import { getDefaultDate } from "utils/utilsFunction/date-converter";
import { sortAplabetically } from "utils/utilsFunction/sorting";
<<<<<<< HEAD
=======
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import toast from "components/React/ToastNotifier/ToastNotifier";
import { deleteExpenditureAction } from "store/modules/expenditure/deleteExpense";
import ConfirmationModal from "components/UI/ConfirmationModal";
import ManageExpenditureCatagories from "../Expenditure/ManageExpenditureCategories";
import ExpenseForm from "../Expenditure/ExpenseForm";
import Button from "components/UI/Forms/Buttons";

>>>>>>> ams-final

interface Props extends PropsFromRedux {
  activeDate: string;
  endDate: string;
  activeTab: string;
}

const CashbookExpenditureTable = (props: Props) => {
  const {
    expenditureData,
    expenditureCategories,
    language,
    schemeSlug,
    schemeDetails,
    previousExpenditureTotal,
<<<<<<< HEAD
    getExpenditureAction,
    getExpenditureCategoryAction,
    getPreviousExpenditureTotalAction,
  } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
=======
    expenditureTotal,
    geExpenditureAction,
    getExpenditureCategoryAction,
    getExpenditureTotalAction,
    // getPreviousExpenditureTotalAction,
  } = props;

  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  // const [modal, setModal] = useState(false);
  // const toggle = () => setModal(!modal);

  const [editData, setEditData] = useState<any>();
  const [categoriesModal, setCategoriesModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const toggle = () => setCategoriesModal(!categoriesModal);
  const toggleIncomeModal = () => {
    setExpenseModal(!expenseModal);
  };
>>>>>>> ams-final

  useEffect(() => {
    if (language && schemeSlug && schemeDetails && props.activeTab) {
      if (props.activeTab === "2") {
<<<<<<< HEAD
        getExpenditureAction(language, schemeSlug, props.activeDate, props.endDate);
        getExpenditureCategoryAction(schemeSlug);
=======
        geExpenditureAction(language, schemeSlug, props.activeDate, props.endDate);
        getExpenditureCategoryAction(schemeSlug);
        getExpenditureTotalAction(language, schemeSlug, props.activeDate, props.endDate);
>>>>>>> ams-final
      }
    }
  }, [language, props.activeDate, props.endDate, schemeSlug, schemeDetails, props.activeTab]);

  const { t } = useTranslation(["cashbook"]);

  console.log(schemeDetails, "schemeDetails");
<<<<<<< HEAD
=======
  console.log(expenditureTotal, "EXPENDITURE TOTAL");

  const handleEdit = (data) => {
    setEditData(data);
    toggleIncomeModal();
  };

  const handleDelete = async () => {
    try {
      const response = await props.deleteExpenditureAction(editId);
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.geExpenditureAction(props.language, props.schemeSlug);
        resetDeleteData();
      } else {
        toast.error(t("home:deleteError"));
        resetDeleteData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
>>>>>>> ams-final

  return (
    <>
      <div className="mt-3">
<<<<<<< HEAD
=======
        <div className="row my-3">
          <div className="col-6 text-left">
            <Button
              className="btn custom-btn  mr-3"
              text={t("finance:addTxn")}
              onClick={toggleIncomeModal}
            // disabled={authorizing}
            // loading={authorizing}
            />
          </div>
          <div className="col-6 text-right">
            <Button
              className="btn custom-btn  mr-3"
              text={t("finance:manageIC")}
              // disabled={authorizing}
              // loading={authorizing}
              onClick={toggle}
            />
          </div>
        </div>
>>>>>>> ams-final
        <div className="data-table table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>{t("cashbook:date")}</th>
                <th>{t("cashbook:description")}</th>
                {sortAplabetically(expenditureCategories, "name")?.map((incomeCategory, index) => (
                  <th key={index}>{incomeCategory.name}</th>
                ))}
<<<<<<< HEAD
=======
                <th className="text-center">Action</th>
>>>>>>> ams-final
              </tr>
            </thead>
            <tbody>
              {expenditureData?.map((income, index) => (
<<<<<<< HEAD
                <tr onClick={toggle} key={index}>
=======
                <tr key={index}> {/* onClick={toggle} include infront of key={index}*/}
>>>>>>> ams-final
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
<<<<<<< HEAD
                </tr>
              ))}

              <tr>
=======
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
              {expenditureTotal && expenditureTotal?.map((income, index) => (
                <tr key={index}>
                  <td></td>
                  <td>{t("cashbook:total")}</td>
                  <td>{income.total_expense}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}

              {/* <tr>
>>>>>>> ams-final
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
<<<<<<< HEAD
              </tr>

              {props.sliderImages &&
=======
              </tr> */}


              {/* {props.sliderImages &&
>>>>>>> ams-final
                props.sliderImages instanceof Array &&
                props.sliderImages?.length > 0 && (
                  <>
                    <tr role="button" onClick={() => setModal(true)}>
                      <td>
                        <img src={CameraIcon} alt="" /> &nbsp;&nbsp; Paper Cashbook Image -{" "}
                        {getMonthByLanguageAndScheme(
                          props.activeDate?.split("-")[1],
                          props.schemeDetails?.system_date_format
                        )}
                      </td>
                    </tr>
                  </>
<<<<<<< HEAD
                )}
=======
                )} */}
>>>>>>> ams-final
            </tbody>
          </table>
        </div>

<<<<<<< HEAD
        <GeneralModal open={modal} toggle={toggle}>
          <Slider />
        </GeneralModal>
=======

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

        {/* <GeneralModal open={modal} toggle={toggle}>
          <Slider />
        </GeneralModal> */}
>>>>>>> ams-final
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  sliderImages: state.incomeData.getIncomeExpenseImgae.data,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  expenditureData: state.expenditureData.getAllExpenditureData.data,
  expenditureCategories: state.expenditureData.getExpenditureCategory.data,
  previousExpenditureTotal: state.expenditureData.getPreviousExpenditureTotal.data,
<<<<<<< HEAD
});

const mapDispatchToProps = {
  getExpenditureAction: geAllExpenditureAction,
  getExpenditureCategoryAction: getExpenditureCategoryAction,
  getPreviousExpenditureTotalAction: getPreviousExpenditureTotalAction,
=======
  expenditureTotal: state.expenditureData.getExpenditureTotal.data
});

const mapDispatchToProps = {
  geExpenditureAction: geAllExpenditureAction,
  getExpenditureCategoryAction: getExpenditureCategoryAction,
  getPreviousExpenditureTotalAction: getPreviousExpenditureTotalAction,
  getExpenditureTotalAction: getExpenditureTotalAction,
  deleteExpenditureAction: deleteExpenditureAction,
>>>>>>> ams-final
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashbookExpenditureTable);
