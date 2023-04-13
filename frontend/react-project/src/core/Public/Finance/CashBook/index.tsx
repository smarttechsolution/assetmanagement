import classnames from "classnames";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import { ADToBS } from "components/React/Datepicker/Datepickerutils";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import CustomRadio from "components/UI/CustomRadio";
import { GeneralCard } from "components/UI/GeneralCard";
import { getMonthByLanguageAndScheme } from "i18n/i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import CashbookExpenditureTable from "./CashbookExpenditureTable";
import CashbookIncomeTable from "./CashbookTable";
import CashbookIncomeTableByDate from "./CashBookByDate/CashbookTable";
import CashbookExpenseTableByDate from "./CashBookByDate/CashbookExpenditureTable";
import { act } from "react-dom/test-utils";

interface Props extends PropsFromRedux {}

const CashBook = (props: Props) => {
  const [activeTab, setActiveTab] = useState("1");
  const [cashbookType, setCashbookType] = useState("byMonth");
  const [activeDate, setActiveDate] = useState<any>("");
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [startDay, setStartDay] = useState<any>("");
  const [endDay, setEndDay] = useState<any>("");

  React.useEffect(() => {
    var cashbookStartDay = startDate.split("-")[0];
    if (cashbookStartDay != null) {
      setStartDay(cashbookStartDay);
    } else {
    }
    console.log(cashbookStartDay,"______________________________-");

    var cashbookEndDay = endDate.split("-")[0];
    if (cashbookEndDay !=null) {
      setEndDay(cashbookEndDay);
    } else {
    }
    console.log(cashbookEndDay,"______________________________-");
  })

  React.useEffect(() => {
    if (props.schemeDetails) {
      if (props.schemeDetails?.system_date_format === "nep") {
        setActiveDate(ADToBS(new Date())); 
      } else {
        setActiveDate(formatDate(new Date())); 
      }
    }
  }, [props.schemeDetails]);


  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const { t } = useTranslation(["cashbook"]);

  return (
    <div className="container py-3 cash-book">
      <GeneralCard
        title={`${t("cashbook:cashbook")}  
        ${
          cashbookType === "byMonth"
            ? `
          (${
            activeDate
              ? getMonthByLanguageAndScheme(
                  activeDate.split("-")[1],
                  props.schemeDetails?.system_date_format
                )
              : ""
          })
          `
            : `
            (${
              startDate
                ? getMonthByLanguageAndScheme(
                    startDate.split("-")[1],
                    props.schemeDetails?.system_date_format
                  )
                : ""
            } ${startDay} -  ${
                endDate
                  ? getMonthByLanguageAndScheme(
                      endDate.split("-")[1],
                      props.schemeDetails?.system_date_format
                    )
                  : ""
              } ${endDay} )
            `
        }

        `}
      >
        <div className="cash-content">
          <div className="flex-between">
            <Nav tabs style={{ flex: 1 }}>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  {t("cashbook:income")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  {t("cashbook:expenditure")}
                </NavLink>
              </NavItem>
            </Nav>

            <div className="row justify-content-end" style={{ flex: 2 }}>
              {cashbookType === "byDate" && (
                <>
                  <div className="col-4">
                    <div className="form-group my-0 mr-3">
                      <div className="row">
                        <div className="col-4">
                          <label htmlFor="">Date From</label>
                        </div>
                        <div className="col-8">
                          {props.schemeDetails?.system_date_format === "nep" ? (
                            <NepaliDatePicker
                              className="form-control"
                              name="name_en"
                              value={startDate}
                              onChange={(e) => {
                                setStartDate(e);
                              }}
                            />
                          ) : (
                            <EnglishDatePicker
                              name="eng"
                              value={startDate}
                              handleChange={(e) => {
                                setStartDate(formatDate(e));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group my-0 mr-3">
                      <div className="row">
                        <div className="col-4">
                          <label htmlFor="">Date To</label>
                        </div>
                        <div className="col-8">
                          {props.schemeDetails?.system_date_format === "nep" ? (
                            <NepaliDatePicker
                              className="form-control"
                              name="name_en"
                              value={endDate}
                              onChange={(e) => {
                                setEndDate(e);
                              }}
                            />
                          ) : (
                            <EnglishDatePicker
                              name="eng"
                              value={endDate}
                              handleChange={(e) => {
                                setEndDate(formatDate(e));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {cashbookType === "byMonth" && (
                <>
                  <div className="col-6">
                    <div className="form-group my-0 mr-3">
                      <div className="row">
                        <div className="col-4">
                          <label htmlFor="">Select Month</label>
                        </div>
                        <div className="col-8">
                          {props.schemeDetails?.system_date_format === "nep" ? (
                            <NepaliDatePicker
                              className="form-control"
                              name="name_en"
                              value={startDate}
                              onChange={(e) => {
                                setActiveDate(e);
                              }}
                            />
                          ) : (
                            <EnglishDatePicker
                              name="eng"
                              value={startDate}
                              handleChange={(e) => {
                                setActiveDate(formatDate(e));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="col-4">
                <div className="d-flex">
                  <div className="mr-2">
                    <CustomRadio
                      label={t("finance:byDate")}
                      id="byDate"
                      name="byDate"
                      value={"byDate"}
                      checked={cashbookType === "byDate"}
                      onChange={(e) => setCashbookType(e.target.value)}
                    />
                  </div>
                  <div className="ml-2">
                    <CustomRadio
                      label={t("finance:byMonth")}
                      id="byMonth"
                      name="byMonth"
                      value={"byMonth"}
                      checked={cashbookType === "byMonth"}
                      onChange={(e) => setCashbookType(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TabContent activeTab={activeTab} className="mt-2">
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  {activeTab === "1" && (
                    <>
                      {cashbookType === "byMonth" ? (
                        <CashbookIncomeTable activeDate={activeDate} activeTab={activeTab} />
                      ) : (
                        <CashbookIncomeTableByDate
                          activeDate={startDate}
                          endDate={endDate}
                          activeTab={activeTab}
                        />
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  {activeTab === "2" && (
                    <>
                      {cashbookType === "byMonth" ? (
                        <CashbookExpenditureTable activeDate={activeDate} activeTab={activeTab} />
                      ) : (
                        <CashbookExpenseTableByDate
                          activeDate={startDate}
                          endDate={endDate}
                          activeTab={activeTab}
                        />
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </GeneralCard>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CashBook);
