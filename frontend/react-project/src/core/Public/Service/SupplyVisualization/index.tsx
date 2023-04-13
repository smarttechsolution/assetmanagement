import React from "react";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import { ADToBS, BSToAD } from "components/React/Datepicker/Datepickerutils";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import { GeneralCard } from "components/UI/GeneralCard";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getWaterSupplyReportAction } from "store/modules/report/waterSupply";
import { getSchemeYearIntervalsAction } from "store/modules/waterScheme/getYearIntervals";
import { RootState } from "store/root-reducer";
import { allTimeOptions, thisYearOptions, thisMonthOptions, thisWeekOptions } from "./datas";
import VisualizationBarGraph from "./VisualizationBarGraph";
import VisualizationBarGraphThisWeek from "./VisualizationBarGraphThisWeek";
import VisualizationGraph from "./VisualizationGraph";
import VisualizationGraphThisYear from "./VisualizationGraphThisYear";
import formatDate, { getDefaultDate } from "utils/utilsFunction/date-converter";

interface Props extends PropsFromRedux {}

const SupplyVIsualization = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const [yearOptions, setYearOptions] = React.useState<any>([]);
  const [selectedYear, setSelectedYear] = React.useState<any>("");

  const [activeTab, setActiveTab] = React.useState("1");
  const [activeDate, setActiveDate] = React.useState<any>("");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  React.useEffect(() => {
    if (props.language && props.schemeSlug) {
      props.getSchemeYearIntervalsAction(props.language, props.schemeSlug);
    }
  }, [props.language, props.schemeSlug]);

  React.useEffect(() => {
    if (props.intervalData) {
      const intervalData = props.intervalData.map((item) => ({
        value: item.id,
        label: `${item.start_date} - ${item.end_date}`,
      }));
      setYearOptions(intervalData);
    }
  }, [props.intervalData]);

  React.useEffect(() => {
    if (props.schemeSlug && props.schemeDetails) {
      if (activeTab === "1") {
        props.getWaterSupplyReportAction(props.schemeSlug);
      } else if (activeTab === "2") {
        props.getWaterSupplyReportAction(props.schemeSlug, `this_year=${selectedYear || 1}`);
      } else if (activeTab === "3") {
        props.getWaterSupplyReportAction(
          props.schemeSlug,
          `year=${
            activeDate?.split("-")[0] ||
            getDefaultDate(props.schemeDetails?.system_date_format)?.split("-")[0]
          }&this_month=${
            activeDate?.split("-")[1] ||
            getDefaultDate(props.schemeDetails?.system_date_format)?.split("-")[1]
          }`
        );
      } else if (activeTab === "4") {
        props.getWaterSupplyReportAction(
          props.schemeSlug,
          `this_week=true&date_from=${formatDate(activeDate || new Date())}&date_to=${formatDate(
            new Date(new Date(activeDate || new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)
          )}`
        );
      }
    }
  }, [props.language, activeTab, props.schemeSlug, selectedYear, activeDate, props.schemeDetails]);

  console.log(activeDate, "asdasdasdasdasdasd");
  return (
    <div className="container py-3 cash-book customCase">
      <GeneralCard title={t("sidebar:supplyVisualization")} print={true}>
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
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => {
                    toggle("3");
                  }}
                >
                  {t("home:thisMonth")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "4" })}
                  onClick={() => {
                    toggle("4");
                  }}
                >
                  {t("home:thisWeek")}
                </NavLink>
              </NavItem>
              {activeTab !== "1" && (
                <NavItem>
                  <div className="form-group my-0 py-0 pl-4">
                    {activeTab === "2" ? (
                      <div className="flex-grow-1" style={{ width: 200 }}>
                        <StyledSelect
                          name="this_year"
                          options={yearOptions}
                          value={yearOptions?.find((item) => item.value === selectedYear)}
                          onChange={(e: any) => {
                            setSelectedYear(e.value?.value);
                          }}
                        />
                      </div>
                    ) : (
                      <>
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
                            value={activeDate || new Date()}
                            handleChange={(e) => {
                              setActiveDate(formatDate(e));
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </NavItem>
              )}
            </Nav>
            {/* <span className="info-text">
              {t("home:allAmountInRupee")} {props.currency}
            </span> */}
          </div>

          <TabContent activeTab={activeTab} className="mt-2">
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  {activeTab === "1" && (
                    <VisualizationGraph
                      type="Year"
                      compareKey="date_from"
                      defaultSelected={["total_supply_avg"]}
                      options={allTimeOptions}
                      key="allTimeGraph"
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
                      type="Month"
                      defaultSelected={["total_supply_avg"]}
                      options={thisYearOptions}
                      selectedYear={selectedYear}
                      key="yearGraph"
                    />
                  )}
                </Col>{" "}
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="12">
                  {activeTab === "3" && (
                    <VisualizationBarGraph
                      compareKey="supply_date"
                      defaultSelected={["total_supply"]}
                      options={thisMonthOptions}
                      key="thisMonthGraph"
                    />
                  )}
                </Col>{" "}
              </Row>
            </TabPane>
            <TabPane tabId="4">
              <Row>
                <Col sm="12">
                  {activeTab === "4" && (
                    <VisualizationBarGraphThisWeek
                      compareKey="supply_date"
                      defaultSelected={["total_supply_avg"]}
                      options={thisWeekOptions}
                      key={"thisWeek"}
                    />
                  )}
                </Col>{" "}
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
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  intervalData: state.waterSchemeData.getYearIntervals.data,
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency,
});

const mapDispatchToProps = {
  getWaterSupplyReportAction: getWaterSupplyReportAction,
  getSchemeYearIntervalsAction: getSchemeYearIntervalsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SupplyVIsualization);
