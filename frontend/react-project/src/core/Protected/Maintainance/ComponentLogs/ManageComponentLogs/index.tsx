import Button from "components/UI/Forms/Buttons";
import GeneralModal from "components/UI/GeneralModal";
import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import Form from "./Form";
import List from "./List";
import classnames from "classnames";

interface Props {}

const ManageComponentLists = (props: Props) => {
  const { t } = useTranslation();
  const [editData, setEditData] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("1");

  const toggle = () => setOpen(!open);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <GeneralModal
        title={t("home:addEdit") + " " + t("maintainance:componentLogs")}
        open={open}
        toggle={toggle}
      >
        <Form editData={editData} setEditData={setEditData} toggle={toggle} />
      </GeneralModal>

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
                {t("maintainance:issueLog")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  toggleTab("2");
                }}
              >
                {t("maintainance:maintainLog")}
              </NavLink>
            </NavItem>
          </Nav>
        </div>

        <TabContent activeTab={activeTab} className="mt-2">
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <div className="text-right">
                  <Button
                    className="btn custom-btn mt-2"
                    text={t("home:add") + " " + t("maintainance:componentLogs")}
                    type="submit"
                    onClick={toggle}
                  />
                </div>

                <List setEditData={setEditData} toggle={toggle} issueType={true} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <div className="text-right">
                  <Button
                    className="btn custom-btn mt-2"
                    text={t("home:add") + " " + t("maintainance:componentLogs")}
                    type="submit"
                    onClick={toggle}
                  />
                </div>

                <List setEditData={setEditData} toggle={toggle} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default ManageComponentLists;
