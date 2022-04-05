import classnames from "classnames";
import { GeneralCard } from "components/UI/GeneralCard";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { getIncomeExpenseAction } from "store/modules/report/incomeExpense";
import { RootState } from "store/root-reducer";
import IncomeExpendGraph from "./IncomeExpendGraph";
import IncomeExpendGraphThisYear from "./IncomeExpendGraphThisYear";

interface Props extends PropsFromRedux {}

const IncomeExpend = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const component = React.useRef<any>(null);

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  React.useEffect(() => {
    if (props.schemeSlug) {
      if (activeTab === "1") {
        props.getIncomeExpenseAction(props.language, props.schemeSlug);
      } else {
        props.getIncomeExpenseAction(props.language, props.schemeSlug, true);
      }
    }
  }, [props.language, activeTab, props.schemeSlug]);

  return (
    <div className="container py-3 cash-book">
      <GeneralCard title={t("home:incomeExpenditure")} print={true} >
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
            <span className="info-text">
              {t("home:allAmountInRupee")} {props.currency}
            </span>
          </div>

          <TabContent activeTab={activeTab} className="mt-2" ref={component}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">{activeTab === "1" && <IncomeExpendGraph />}</Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">{activeTab === "2" && <IncomeExpendGraphThisYear />}</Col>
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
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency,
  incomeExpenseData: state.reportData.incomeExpenseData.data,
});

const mapDispatchToProps = {
  getIncomeExpenseAction: getIncomeExpenseAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomeExpend);
