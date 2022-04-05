import Button from "components/UI/Forms/Buttons";
import GeneralModal from "components/UI/GeneralModal";
import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { GeneralCard } from "components/UI/GeneralCard";
import QualityTestParameters from "../QualityTestParameters";
import WaterTestResults from "../WaterTestResult";

interface Props {}

const ManageComponentLists = (props: Props) => {
  const { t } = useTranslation(); 
  const [activeTab, setActiveTab] = React.useState("1");
 

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="container my-3">
      <div className="row">
        <div className="col-lg-12">
          <GeneralCard title={t("sidebar:quality")}>
            <div className="cash-content">
              <div className="flex-between">
                <Nav tabs style={{ flex: 1 }}>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        toggleTab("1");
                      }}
                    >
                      {t("home:qtp")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggleTab("2");
                      }}
                    >
                      {t("home:wtr")}
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>

              <TabContent activeTab={activeTab} className="mt-2">
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                     <QualityTestParameters/>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <WaterTestResults/>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </GeneralCard>
        </div>
      </div>
    </div>
  );
};

export default ManageComponentLists;
