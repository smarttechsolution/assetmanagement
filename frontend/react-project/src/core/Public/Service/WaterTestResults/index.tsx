import classnames from "classnames";
import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { getWaterTestResultsAction } from "store/modules/report/waterTestResults";
import { getTestParametersAction } from "store/modules/testParamters/getTestParameters";
import { RootState } from "store/root-reducer";
import VisualizationGraph from "./VisualizationGraph";
import VisualizationGraphThisYear from "./VisualizationGraphThisYear";
import { useTranslation } from "react-i18next";

interface Props extends PropsFromRedux {}

const WaterTestResults = (props: Props) => {
  const { t } = useTranslation(["home", "sidebar"]);

  const [activeTab, setActiveTab] = React.useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  React.useEffect(() => {
    if (props.schemeSlug) {
      props.getTestParametersAction(props.schemeSlug);
    }
  }, [props.schemeSlug]);

  React.useEffect(() => {
    if (props.schemeSlug) {
      if (activeTab === "1") {
        props.getWaterTestResultsAction(props.schemeSlug);
      } else {
        props.getWaterTestResultsAction(props.schemeSlug, true);
      }
    }
  }, [props.language, activeTab, props.schemeSlug]);

  return (
    <div className="container py-3 cash-book">
      <GeneralCard title={t("sidebar:qualityTestResult")} print={true}>
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
            <span className="info-text">{t("home:allAmountInRupee")} {props.currency}</span>
          </div>

          <TabContent activeTab={activeTab} className="mt-2">
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  {activeTab === "1" && (
                    <VisualizationGraph
                      compareKey="year_from"
                      defaultSelected={['ph']}
                      type="Year"
                    />
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  {activeTab === "2" && (
                    <VisualizationGraphThisYear
                      compareKey="month"
                      defaultSelected={['ph']}
                      type="Month"
                    />
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
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency,

});

const mapDispatchToProps = {
  getWaterTestResultsAction: getWaterTestResultsAction,
  getTestParametersAction: getTestParametersAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(WaterTestResults);
