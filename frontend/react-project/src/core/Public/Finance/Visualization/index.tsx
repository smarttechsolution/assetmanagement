import classnames from "classnames";
import { GeneralCard } from "components/UI/GeneralCard";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { getActualCumulativeAction } from "store/modules/report/actualCumilitiveCashFlow";
import { getExpenseByCategoryAction } from "store/modules/report/expenseByCategory";
import { getExpenseCumulativeAction } from "store/modules/report/expenseCumilitiveCashFlow";
import { getIncomeByCategoryAction } from "store/modules/report/incomeByCategory";
import { getIncomeExpenseAction } from "store/modules/report/incomeExpense";
import { RootState } from "store/root-reducer";
import DonoughtChart from "./DonoughtChart";
import LineChart from "./LineChart";
import LineChartThisYear from "./LineChart/LineChartThisYear";

interface Props extends PropsFromRedux {}

const Visualization = (props: Props) => {
  const { t } = useTranslation(["home", "finance"]);

  const [activeTab, setActiveTab] = useState("1");

  const [selected, setSelected] = useState<string[]>(["actual_income", "actual_expense"]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (props.schemeSlug) {
      props.getIncomeByCategoryAction(props.schemeSlug);
      props.getExpenseByCategoryAction(props.schemeSlug);
    }
  }, [props.schemeSlug]);

  React.useEffect(() => {
    if (props.schemeSlug) {
      if (activeTab === "1") {
        props.getIncomeExpenseAction(props.language, props.schemeSlug);
        // props.getActualCumulativeAction(props.schemeSlug);
        props.getExpenseCumulativeAction(props.schemeSlug);
      } else {
        props.getIncomeExpenseAction(props.language, props.schemeSlug, true);
        // props.getActualCumulativeAction(props.schemeSlug, true);
        props.getExpenseCumulativeAction(props.schemeSlug, true);
      }
    }
  }, [props.language, activeTab, props.schemeSlug]);

  return (
    <div className="container py-3 cash-book">
      <GeneralCard title={t("finance:FinancialDataVisualization")} className="my-0 mt-3" print={true}>
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
                  {t("home:allTime")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  {t("home:thisYear")}
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          <TabContent activeTab={activeTab} className="mt-2">
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <LineChart selected={selected} setSelected={setSelected} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">{activeTab === "2" && <LineChartThisYear selected={selected} setSelected={setSelected} />}</Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </GeneralCard>

      <div className="my-5">
        <DonoughtChart />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
});

const mapDispatchToProps = {
  getIncomeExpenseAction: getIncomeExpenseAction,
  getActualCumulativeAction: getActualCumulativeAction,
  getExpenseCumulativeAction: getExpenseCumulativeAction,

  getIncomeByCategoryAction: getIncomeByCategoryAction,
  getExpenseByCategoryAction: getExpenseByCategoryAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Visualization);
