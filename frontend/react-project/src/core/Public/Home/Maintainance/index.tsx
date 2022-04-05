import classnames from "classnames";
import { GeneralCard } from "components/UI/GeneralCard";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { getMaintainanceCostAction } from "store/modules/report/maintainanceCost";
import { RootState } from "store/root-reducer";
import MaintainanceCostChart from "./MaintainanceCostChart";
import MaintainanceCostChartThisYear from "./MaintainanceCostChartThisYear";

interface Props extends PropsFromRedux {}

const Maintainance = (props: Props) => {
  const { t } = useTranslation(["home"]);
  const [activeTab, setActiveTab] = useState("1");
  const component = React.useRef<any>(null);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  React.useEffect(() => {
    if (props.schemeSlug) {
      if (activeTab === "1") {
        props.getMaintainanceCostAction(props.schemeSlug);
      } else {
        props.getMaintainanceCostAction(props.schemeSlug, true);
      }
    }
  }, [props.language, activeTab, props.schemeSlug]);

  return (
    <div className="container py-3 cash-book">
      <GeneralCard title={t("home:maintainance") + " " + t("home:cost")} print={true}>
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
                <Col sm="12">{activeTab === "1" && <MaintainanceCostChart />}</Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">{activeTab === "2" && <MaintainanceCostChartThisYear />}</Col>
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
  incomeExpenseData: state.reportData.incomeExpenseData.data,
  waterTarrifs: state.waterTarrifsData.waterTarrifData.data,
  waterSupplyData: state.waterSupplyData.waterScheduleData.data,
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency,
});

const mapDispatchToProps = {
  getMaintainanceCostAction: getMaintainanceCostAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Maintainance);
