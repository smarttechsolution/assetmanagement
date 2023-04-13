import { DeleteIcon, EditIconDark, CameraIcon } from "assets/images/xd";
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
import useDeleteConfirmation from "hooks/useDeleteConfirmation";
import toast from "components/React/ToastNotifier/ToastNotifier";
import { deleteIncomeAction } from "store/modules/income/deleteIncome";
import ManageIncomeCatagories from "../Income/ManageIncomeCategories";
import IncomeModal from "../Income/IncomeForm";
import ConfirmationModal from "components/UI/ConfirmationModal";
import { getIncomeAction } from "store/modules/income/getIcome";
import Button from "components/UI/Forms/Buttons";

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
    getIncomeTotalAction,
    geAllIncomeAction,
    getIncomeAction,
    getIncomeCategoryAction,
    getIncomeExpenseImageAction,
  } = props;
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  // const [modal, setModal] = useState(false);
  // const toggle = () => setModal(!modal);
  const [editData, setEditData] = useState<any>();
  const [categoriesModal, CategoriesModal] = useState(false);
  const [incomeModal, setIncomeModal] = useState(false);
  const toggle = () => CategoriesModal(!categoriesModal);

  const toggleIncomeModal = () => setIncomeModal(!incomeModal);



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
        getIncomeAction(
          language,
          schemeSlug,
          props.activeDate?.split("-")[0] ||
          getDefaultDate(schemeDetails?.system_date_format)?.split("-")[0],
          props.activeDate?.split("-")[1] ||
          getDefaultDate(schemeDetails?.system_date_format)?.split("-")[1]
        );
        geAllIncomeAction(language, schemeSlug, props.activeDate, props.endDate);
        getIncomeCategoryAction(schemeSlug);
        getIncomeTotalAction(language, schemeSlug, props.activeDate, props.endDate);
        getIncomeExpenseImageAction(language, schemeSlug, props.activeDate || ADToBS(new Date()));
      }
    }
  }, [language, props.activeDate, props.endDate, schemeSlug, schemeDetails, props.activeTab]);

  console.log(props.activeDate, props.activeDate, "<<<<<<<<<");
  console.log(incomeTotal, "inco----");


  const handleEdit = (data) => {
    setEditData(data);
    toggleIncomeModal();
  };

  const handleDelete = async () => {
    try {
      const response = await props.deleteIncomeAction(editId);
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getIncomeAction(props.language, props.schemeSlug);
        props.getIncomeTotalAction(props.language, props.schemeSlug)
        resetDeleteData();
      } else {
        toast.error(t("home:deleteError"));
        resetDeleteData();
      }
    } catch (error) {
      console.log(error, "error");
    }
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

        <div className="data-table table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>{t("cashbook:date")}</th>
                <th>{t("cashbook:description")}</th>
                {sortAplabetically(incomeCategories, "name")?.map((incomeCategory, index) => (
                  <th key={index}>{incomeCategory.name}</th>
                ))}
                <th className="text-center">{t("home:action")}</th>
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
                        console.log(handleDeleteClick(income.id), "Deleted Successful");

                      }}
                    >
                      <img src={DeleteIcon} alt="" />
                    </div>
                  </td>
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
                  <td></td>
                </tr>
              ))}


              {/* {props.sliderImages &&
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
                )} */}


            </tbody>
          </table>
        </div>



        <GeneralModal
          title={t("finance:incoCate")}
          size="lg"
          open={categoriesModal}
          toggle={toggle}
        >
          <ManageIncomeCatagories />
        </GeneralModal>
        <GeneralModal
          title={t("finance:incomeform")}
          size="lg"
          open={incomeModal}
          toggle={() => {
            if (incomeModal) {
              setEditData(null);
            }
            toggleIncomeModal();
          }}
        >
          <IncomeModal
            editData={editData}
            setEditData={setEditData}
            toggle={setIncomeModal}
            activeDate={props.activeDate}
          />
        </GeneralModal>

        <ConfirmationModal
          open={modal}
          handleModal={() => {
            toggleModal();
          }}
          handleConfirmClick={() => handleDelete()}
        />

        {/* <GeneralModal open={modal} toggle={toggle}>
          <Slider />
        </GeneralModal> */}
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
  getIncomeTotalAction: getIncomeTotalAction,
  deleteIncomeAction: deleteIncomeAction,
  getIncomeAction: getIncomeAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashbookTable);
