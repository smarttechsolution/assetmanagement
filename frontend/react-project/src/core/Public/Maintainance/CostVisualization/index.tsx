import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import BarChart from "./BarChart";
import BarChartThisYear from "./BarChart/ChartThisYear";
import { RootState } from "store/root-reducer";
import { getMaintainanceCostAction } from "store/modules/report/maintainanceCost";
import { connect, ConnectedProps } from "react-redux";
import DonoughtChart from "./DonoughtChart";
import { getMaintainanceCostByYearAction } from "store/modules/report/maintainanceCostByYear";
import { useTranslation } from "react-i18next";

interface Props extends PropsFromRedux {}

const CostVisualization = (props: Props) => {
  const { t } = useTranslation(["home", "finance"]);

  const [activeTab, setActiveTab] = React.useState("1");

  const [selected, setSelected] = React.useState<string[]>([
    "expected_unsegregated",
    "expected_material",
  ]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  React.useEffect(() => {
    if (props.schemeSlug) {
      if (activeTab === "1") {
        props.getMaintainanceCostAction(props.schemeSlug);
        props.getMaintainanceCostByYearAction(props.schemeSlug);
      } else {
        props.getMaintainanceCostAction(props.schemeSlug, true);
        props.getMaintainanceCostByYearAction(props.schemeSlug, true);
      }
    }
  }, [activeTab, props.schemeSlug]);

  return (
    <div className="container py-3 cash-book">
      <GeneralCard
        title={t("sidebar:maintainance") + " " + t("sidebar:dataVisualization")}
        className="my-0 mt-3"
        print={true}
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
                  {activeTab === "1" && <BarChart selected={selected} setSelected={setSelected} />}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  {activeTab === "2" && (
                    <BarChartThisYear selected={selected} setSelected={setSelected} />
                  )}
                </Col>
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
  getMaintainanceCostAction: getMaintainanceCostAction,
  getMaintainanceCostByYearAction: getMaintainanceCostByYearAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CostVisualization);
