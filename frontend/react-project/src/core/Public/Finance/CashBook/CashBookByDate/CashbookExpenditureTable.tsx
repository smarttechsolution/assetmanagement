import { CameraIcon } from "assets/images/xd";
import GeneralModal from "components/UI/GeneralModal";
import Slider from "components/UI/Slider";
import { getMonthByLanguageAndScheme } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Table } from "reactstrap";
import { geAllExpenditureAction } from "store/modules/expenditure/getAllExpenditure";
import { getExpenditureCategoryAction } from "store/modules/expenditure/getExpenditureCategory";
import { getPreviousExpenditureTotalAction } from "store/modules/expenditure/getPreviousExpenditureTotal";
import { RootState } from "store/root-reducer";
<<<<<<< HEAD
import { getDefaultDate } from "utils/utilsFunction/date-converter";
=======
import { getExpenditureTotalAction } from 'store/modules/expenditure/getExpenditureTotal';
// import { getDefaultDate } from "utils/utilsFunction/date-converter";
>>>>>>> ams-final
import { sortAplabetically } from "utils/utilsFunction/sorting";

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
<<<<<<< HEAD
    previousExpenditureTotal,
    getExpenditureAction,
    getExpenditureCategoryAction,
    getPreviousExpenditureTotalAction,
  } = props;

=======
    expenditureTotal,
    // expenseType,
    getExpenditureAction,
    getExpenditureCategoryAction,
    // getPreviousExpenditureTotalAction,
    getExpenditureTotalAction
  } = props;



>>>>>>> ams-final
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (language && schemeSlug && schemeDetails && props.activeTab) {
      if (props.activeTab === "2") {
        getExpenditureAction(language, schemeSlug, props.activeDate, props.endDate);
        getExpenditureCategoryAction(schemeSlug);
<<<<<<< HEAD
=======
        // getPreviousExpenditureTotalAction(language, schemeSlug, props.activeDate, props.endDate)
        getExpenditureTotalAction(language, schemeSlug, props.activeDate, props.endDate)



>>>>>>> ams-final
      }
    }
  }, [language, props.activeDate, props.endDate, schemeSlug, schemeDetails, props.activeTab]);

  const { t } = useTranslation(["cashbook"]);

<<<<<<< HEAD
  console.log(schemeDetails, "schemeDetails");
=======
  console.log(expenditureTotal, "expensi");

>>>>>>> ams-final

  return (
    <>
      <div className="mt-3">
        <Table className="table-02 table-hover">
          <thead>
            <tr>
              <th>{t("cashbook:date")}</th>
              <th>{t("cashbook:description")}</th>
              {sortAplabetically(expenditureCategories, "name")?.map((incomeCategory, index) => (
                <th key={index}>{incomeCategory.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenditureData?.map((income, index) => (
<<<<<<< HEAD
              <tr onClick={toggle} key={index}>
=======
              <tr key={index}>
>>>>>>> ams-final
                <td>{language === "en" ? income.date : income.date_np}</td>
                <td>{income.title}</td>
                {sortAplabetically(expenditureCategories, "name")?.map((incomeCategory, index) => {
                  if (income.category.name === incomeCategory.name) {
                    return (
                      <td key={index}>
                        {props.schemeDetails?.currency} {income.income_amount}
                      </td>
                    );
                  } else {
                    return <td key={index}>-</td>;
                  }
                })}
              </tr>
            ))}

<<<<<<< HEAD
            <tr>
              <td></td>
              <td>{t("cashbook:total")}</td>
              {sortAplabetically(expenditureCategories, "name")?.map((incomeCategory, index) => {
                const findData = previousExpenditureTotal?.present_month_data?.find(
                  (prev) => prev.expense_category_name === incomeCategory.name
=======
            {/* <tr>
              <td></td>
              <td>{t("cashbook:total")}</td>
              {sortAplabetically(expenditureCategories, "name")?.map((incomeCategory, index) => {
                const findData = expenseType?.total_data?.find(
                  // (prev) => prev.expense_category_name === incomeCategory.name
                  (prev) => prev.total_expense
>>>>>>> ams-final
                );
                if (findData) {
                  return (
                    <td key={index}>
<<<<<<< HEAD
                      {props.schemeDetails?.currency} {findData.total_expense_amount}
=======
                      {props.schemeDetails?.currency} {findData.total_expense}
>>>>>>> ams-final
                    </td>
                  );
                } else {
                  return <td key={index}>-</td>;
                }
              })}
<<<<<<< HEAD
            </tr>
=======
            </tr> */}

            {expenditureTotal && Array.isArray(expenditureTotal) && expenditureTotal?.map((income, index) => (
                <tr key={index}> 
                  <td></td>
                  <td>{t("cashbook:total")}</td>
                  <td>{income.total_expense}</td>
                </tr>
              ))}

            {/* <tr>
              <td></td>
              <td>{t("cashbook:total")}</td>
              {expenditureTotal && Array.isArray(expenditureTotal) && expenditureTotal?.map((income, index) => {
                if (income.total_expense != null) {
                  return (
                    <td key={index}>
                      {props.schemeDetails?.currency} {income.total_expense}
                    </td>
                  );
                } else {
                  return <td key={index}>-</td>;
                }
                // <td>{income.total_expense}</td>
              })}
            </tr> */}
>>>>>>> ams-final

            {props.sliderImages &&
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
              )}
          </tbody>
        </Table>

        <GeneralModal open={modal} toggle={toggle}>
          <Slider />
        </GeneralModal>
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
<<<<<<< HEAD
  previousExpenditureTotal: state.expenditureData.getPreviousExpenditureTotal.data,
});

=======
  expenditureTotal: state.expenditureData.getExpenditureTotal.data,
  // expenseType: state.expenditureData.getExpenditureTotalAction.data
});


>>>>>>> ams-final
const mapDispatchToProps = {
  getExpenditureAction: geAllExpenditureAction,
  getExpenditureCategoryAction: getExpenditureCategoryAction,
  getPreviousExpenditureTotalAction: getPreviousExpenditureTotalAction,
<<<<<<< HEAD
=======
  getExpenditureTotalAction: getExpenditureTotalAction
>>>>>>> ams-final
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashbookExpenditureTable);
