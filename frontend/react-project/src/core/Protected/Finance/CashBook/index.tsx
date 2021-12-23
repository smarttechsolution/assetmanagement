import classnames from "classnames";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import { ADToBS } from "components/React/Datepicker/Datepickerutils";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import { GeneralCard } from "components/UI/GeneralCard";
import { getMonthByLanguage, getMonthByLanguageAndScheme } from "i18n/i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import CashbookExpenditureTable from "./Expenditure/CashbookExpenditureTable";
import CashbookTable from "./Income/CashbookTable";

interface Props extends PropsFromRedux {}

const CashBook = (props: Props) => {
  const [activeTab, setActiveTab] = useState("1");
  const [activeDate, setActiveDate] = useState<any>("");

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

        (${
          activeDate ? getMonthByLanguageAndScheme(activeDate.split("-")[1], props.schemeDetails?.system_date_format) : ""
        })`}
      >
        <div className="cash-content">
          <div className="flex-between">
            <Nav tabs>
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

            <div>
              <div className="form-group my-0 mr-3">
                {props.schemeDetails?.system_date_format === "nep" ? (
                  <NepaliDatePicker
                    className="form-control"
                    name="name_en"
                    value={activeDate}
                    onChange={(e) => {
                      setActiveDate(e);
                    }}
                  />
                ) : (
                  <EnglishDatePicker
                    name="eng"
                    value={activeDate}
                    handleChange={(e) => {
                      setActiveDate(formatDate(e));
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <TabContent activeTab={activeTab} className="mt-2">
            <TabPane tabId="1">
              <Row>
                <Col sm="12">{activeTab === "1" && <CashbookTable activeDate={activeDate} activeTab={activeTab} />}</Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <CashbookExpenditureTable activeDate={activeDate} activeTab={activeTab} />
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
