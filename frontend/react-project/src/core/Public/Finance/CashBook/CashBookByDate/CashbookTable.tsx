import { CameraIcon } from "assets/images/xd";
import { ADToBS } from "components/React/Datepicker/Datepickerutils";
import GeneralModal from "components/UI/GeneralModal";
import Slider from "components/UI/Slider";
import { getMonthByLanguageAndScheme } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Table } from "reactstrap";
import { geAllIncomeAction } from "store/modules/income/getAllIncome";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
import { getIncomeExpenseImageAction } from "store/modules/income/getIncomeExpenseImgae";
import { getIncomeTotalAction } from "store/modules/income/getIncomeTotal";
import { RootState } from "store/root-reducer";
import { getDefaultDate } from "utils/utilsFunction/date-converter";
import { sortAplabetically } from "utils/utilsFunction/sorting";

interface Props extends PropsFromRedux {
  activeDate: string;
  endDate: string;
  activeTab: string;
}

const CashbookTable = (props: Props) => {
  const { t } = useTranslation(["cashbook"]);

  const {
    incomeData,
    incomeCategories,
    language,
    schemeSlug,
    schemeDetails,
    previousIncomeTotal,
    incomeTotal,
    geAllIncomeAction,
    getIncomeCategoryAction,
    getIncomeExpenseImageAction,
    getIncomeTotalAction,
  } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (
      language &&
      schemeSlug &&
      schemeDetails &&
      props.activeTab &&
      props.activeDate &&
      props.endDate
    ) {
      if (props.activeTab === "1") {
        geAllIncomeAction(language, schemeSlug, props.activeDate, props.endDate);
        getIncomeTotalAction(language, schemeSlug, props.activeDate, props.endDate);
        getIncomeCategoryAction(schemeSlug);
        getIncomeExpenseImageAction(language, schemeSlug, props.activeDate || ADToBS(new Date()));
      }
    }
  }, [language, props.activeDate, props.endDate, schemeSlug, schemeDetails, props.activeTab]);

  console.log(props.activeDate, props.activeDate, "<<<<<<<<<");

  console.log(incomeTotal, "inc-----");
  

  return (
    <>
      <div className="mt-3">
        <Table className="table-02 table-hover">
          <thead>
            <tr>
              <th>{t("cashbook:date")}</th>
              <th>{t("cashbook:description")}</th>
              {sortAplabetically(incomeCategories, "name")?.map((incomeCategory, index) => (
                <th key={index}>{incomeCategory.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incomeData?.map((income, index) => (
              <tr key={index}>
                <td>{language === "en" ? income.date : income.date_np}</td>
                <td>{income.title}</td>
                {sortAplabetically(incomeCategories, "name")?.map((incomeCategory, index) => {
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

            {/* <tr>
              <td></td>
              <td>{t("cashbook:total")}</td>
              {sortAplabetically(incomeCategories, "name")?.map((incomeCategory, index) => {
                const findData = previousIncomeTotal?.present_month_data?.find(
                  (prev) => prev.income_category_name === incomeCategory.name
                );
                if (findData) {
                  return (
                    <td key={index}>
                      {props.schemeDetails?.currency} {findData.total_income_amount}
                    </td>
                  );
                } else {
                  return <td key={index}>-</td>;
                }
              })}
            </tr> */}
            {incomeTotal && incomeTotal?.map((income, index) => (
                <tr key={index}> 
                  <td></td>
                  <td>{t("cashbook:total")}</td>
                  <td>{income.total_income}</td>
                  <td></td>
                </tr>
              ))}


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
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  incomeData: state.incomeData.getAllIncomeData.data,
  incomeCategories: state.incomeData.getIncomeCategory.data,
  previousIncomeTotal: state.incomeData.getPreviousIncomeTotal.data,
  incomeExpenseImage: state.incomeData.getIncomeExpenseImgae.data,
  incomeTotal: state.incomeData.getIncomeTotal.data
});

const mapDispatchToProps = {
  geAllIncomeAction: geAllIncomeAction,
  getIncomeCategoryAction: getIncomeCategoryAction,
  getIncomeExpenseImageAction: getIncomeExpenseImageAction,
  getIncomeTotalAction: getIncomeTotalAction
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashbookTable);
