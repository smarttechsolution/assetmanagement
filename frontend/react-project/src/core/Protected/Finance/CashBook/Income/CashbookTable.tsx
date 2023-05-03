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
import { deleteIncomeAction } from "store/modules/income/deleteIncome";
import { getIncomeAction } from "store/modules/income/getIcome";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
import { getPreviousIncomeTotalAction } from "store/modules/income/getPreviousIncomeTotal";
import { RootState } from "store/root-reducer";
import { getDefaultDate } from "utils/utilsFunction/date-converter";
import { sortAplabetically } from "utils/utilsFunction/sorting";
import IncomeModal from "./IncomeForm";
import ManageIncomeCatagories from "./ManageIncomeCategories";

interface Props extends PropsFromRedux {
  activeDate: string;
  activeTab: string;
}

const CashbookTable = (props: Props) => {
  const {
    incomeData,
    incomeCategories,
    language,
    schemeSlug,
    schemeDetails,
    previousIncomeTotal,
    getIncomeAction,
    getIncomeCategoryAction,
    getPreviousIncomeTotalAction,
  } = props;
  const { editId, modal, handleDeleteClick, resetDeleteData, toggleModal } =
    useDeleteConfirmation();

  const [editData, setEditData] = useState<any>();
  const [categoriesModal, CategoriesModal] = useState(false);
  const [incomeModal, setIncomeModal] = useState(false);
  const toggle = () => CategoriesModal(!categoriesModal);

  const toggleIncomeModal = () => setIncomeModal(!incomeModal);

  useEffect(() => {
    if (language && schemeSlug && schemeDetails && props.activeTab) {
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
      }
    }
  }, [language, schemeSlug, props.activeDate, schemeDetails, props.activeTab]);

  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      const response = await props.deleteIncomeAction(editId);
      if (response.status === 204) {
        toast.success(t("home:deleteSuccess"));
        props.getIncomeAction(props.language, props.schemeSlug);
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
              <tr role="button">
                <td></td>
                <td>{t("cashbook:previous-month-data")}</td>
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
                <tr role="button" key={index}>
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

              <tr role="button">
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
                <td></td>
              </tr>

              {/* <tr role="button" onClick={() => setModal(true)}>
              <td>
                <img src={CameraIcon} alt="" /> &nbsp;&nbsp; Paper Cashbook Image
              </td>
            </tr> */}
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
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  incomeData: state.incomeData.getIncomeData.data,
  incomeCategories: state.incomeData.getIncomeCategory.data,
  previousIncomeTotal: state.incomeData.getPreviousIncomeTotal.data,
});

const mapDispatchToProps = {
  getIncomeAction: getIncomeAction,
  deleteIncomeAction: deleteIncomeAction,
  getIncomeCategoryAction: getIncomeCategoryAction,
  getPreviousIncomeTotalAction: getPreviousIncomeTotalAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashbookTable);
