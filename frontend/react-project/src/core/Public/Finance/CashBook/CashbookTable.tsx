import { CameraIcon } from "assets/images/xd";
import { ADToBS } from "components/React/Datepicker/Datepickerutils";
import GeneralModal from "components/UI/GeneralModal";
import Slider from "components/UI/Slider";
import { getMonthByLanguageAndScheme } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Table } from "reactstrap";
import { getIncomeAction } from "store/modules/income/getIcome";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
import { getIncomeExpenseImageAction } from "store/modules/income/getIncomeExpenseImgae";
import { getPreviousIncomeTotalAction } from "store/modules/income/getPreviousIncomeTotal";
import { RootState } from "store/root-reducer";
import { getDefaultDate } from "utils/utilsFunction/date-converter";
import { sortAplabetically } from "utils/utilsFunction/sorting";

interface Props extends PropsFromRedux {
  activeDate: string;
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
    incomeExpenseImage,
    getIncomeAction,
    getIncomeCategoryAction,
    getPreviousIncomeTotalAction,
    getIncomeExpenseImageAction,
  } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  console.log(props.activeDate, "props.activeDateprops.activeDate");

  useEffect(() => {
    if (language && schemeSlug && schemeDetails && props.activeTab && props.activeDate) {
      if (props.activeTab === "1") {
        getIncomeAction(
          language,
          schemeSlug,
          props.activeDate?.split("-")[0] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[0],
          props.activeDate?.split("-")[1] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[1]
        );
        getIncomeCategoryAction(schemeSlug);
        getPreviousIncomeTotalAction(
          language,
          schemeSlug,
          props.activeDate?.split("-")[0] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[0],
          props.activeDate?.split("-")[1] ||
            getDefaultDate(schemeDetails?.system_date_format)?.split("-")[1]
        );
        getIncomeExpenseImageAction(language, schemeSlug, props.activeDate || ADToBS(new Date()));
      }
    }
  }, [language, props.activeDate, schemeSlug, schemeDetails, props.activeTab]);

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
            <tr>
              <td></td>
              <td>{t("cashbook:from-prev-month")}</td>
              {sortAplabetically(incomeCategories, "name")?.map((incomeCategory, index) => {
                const findData = previousIncomeTotal?.previous_month_data?.find(
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
            </tr>

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

            <tr>
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
            </tr>
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
  incomeData: state.incomeData.getIncomeData.data,
  incomeCategories: state.incomeData.getIncomeCategory.data,
  previousIncomeTotal: state.incomeData.getPreviousIncomeTotal.data,
  incomeExpenseImage: state.incomeData.getIncomeExpenseImgae.data,
});

const mapDispatchToProps = {  
  getIncomeAction: getIncomeAction,
  getIncomeCategoryAction: getIncomeCategoryAction,
  getPreviousIncomeTotalAction: getPreviousIncomeTotalAction,
  getIncomeExpenseImageAction: getIncomeExpenseImageAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashbookTable);
