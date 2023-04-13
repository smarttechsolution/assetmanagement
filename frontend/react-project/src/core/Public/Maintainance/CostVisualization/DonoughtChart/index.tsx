import GeneralChart from "components/UI/Charts/General";
import { GeneralCard } from "components/UI/GeneralCard";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import DataTable from "./DataTable";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";

type ActualPlannedDistribution = {
  this_year: { value: number; name: string; itemStyle?: { color: string } }[];
  all_time: { value: number; name: string; itemStyle?: { color: string } }[];
};

interface Props extends PropsFromRedux {}

const DonoughtChart = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const [actualDistriBution, setActualDisttribution] = useState<ActualPlannedDistribution>();
  const [plannedDistriBution, setPlannedDisttribution] = useState<ActualPlannedDistribution>();

  const [actualTableData, setActualTableData] = useState<any>();
  const [plannedTableData, setPlannedTableData] = useState<any>();

  useEffect(() => {
    console.log(props.maintainanceCostByYear, "actualTableData");

    const seriesActualData: ActualPlannedDistribution = {
      this_year: [
        {
          value: props.maintainanceCostByYear?.this_year_actual_cost?.labour_cost__sum || 0,
          name: "Labour Cost",
          itemStyle: { color: "#2680eb" },
        },
        {
          value: props.maintainanceCostByYear?.this_year_actual_cost?.material_cost__sum || 0,
          name: "Consumable Cost",
          itemStyle: { color: "#69a7f1" },
        },
        {
          value: props.maintainanceCostByYear?.this_year_actual_cost?.replacement_cost__sum || 0,
          name: "Replacement Cost",
          itemStyle: { color: "#accef7" },
        },
        {
          value: props.maintainanceCostByYear?.this_year_actual_cost?.cost_total__sum || 0,
          name: "Unsegregated Cost",
          itemStyle: { color: "#e5f1ff" },
        },
      ],
      all_time: [
        {
          value: props.maintainanceCostByYear?.all_time_actual_cost?.labour_cost__sum || 0,
          name: "Labour Cost",
          itemStyle: { color: "#2680eb" },
        },
        {
          value: props.maintainanceCostByYear?.all_time_actual_cost?.material_cost__sum || 0,
          name: "Consumable Cost",
          itemStyle: { color: "#69a7f1" },
        },
        {
          value: props.maintainanceCostByYear?.all_time_actual_cost?.replacement_cost__sum || 0,
          name: "Replacement Cost",
          itemStyle: { color: "#accef7" },
        },
        {
          value: props.maintainanceCostByYear?.all_time_actual_cost?.cost_total__sum || 0,
          name: "Unsegregated Cost",
          itemStyle: { color: "#e5f1ff" },
        },
      ],
    };

    const seriesPlannedData: ActualPlannedDistribution = {
      this_year: [
        {
          value: props.maintainanceCostByYear?.this_year_expected_cost?.labour_cost || 0,
          name: "Labour Cost",
          itemStyle: { color: "#eb9126" },
        },
        {
          value: props.maintainanceCostByYear?.this_year_expected_cost?.material_cost || 0,
          name: "Consumable Cost",
          itemStyle: { color: "#f1b369" },
        },
        {
          value: props.maintainanceCostByYear?.this_year_expected_cost?.replacement_cost || 0,
          name: "Replacement Cost",
          itemStyle: { color: "#f7d5ac" },
        },
        {
          value: props.maintainanceCostByYear?.this_year_expected_cost?.unsegregated_cost || 0,
          name: "Unsegregated Cost",
          itemStyle: { color: "#ffefdb" },
        },
      ],
      all_time: [
        {
          value: props.maintainanceCostByYear?.all_time_expected_cost?.labour_cost || 0,
          name: "Labour Cost",
          itemStyle: { color: "#eb9126" },
        },
        {
          value: props.maintainanceCostByYear?.all_time_expected_cost?.material_cost || 0,
          name: "Consumable Cost",
          itemStyle: { color: "#f1b369" },
        },
        {
          value: props.maintainanceCostByYear?.all_time_expected_cost?.replacement_cost || 0,
          name: "Replacement Cost",
          itemStyle: { color: "#f7d5ac" },
        },
        {
          value: props.maintainanceCostByYear?.all_time_expected_cost?.unsegregated_cost || 0,
          name: "Unsegregated Cost",
          itemStyle: { color: "#ffefdb" },
        },
      ],
    };

    const actualTableData = [
      {
        name: "Labour Cost",
        value: {
          this_year: props.maintainanceCostByYear?.this_year_actual_cost?.labour_cost__sum || 0,
          all_time: props.maintainanceCostByYear?.all_time_actual_cost?.labour_cost__sum || 0,
        },
      },
      {
        name: "Consumable Cost",
        value: {
          this_year: props.maintainanceCostByYear?.this_year_actual_cost?.material_cost__sum || 0,
          all_time: props.maintainanceCostByYear?.all_time_actual_cost?.material_cost__sum || 0,
        },
      },
      {
        name: "Replacement Cost",
        value: {
          this_year:
            props.maintainanceCostByYear?.this_year_actual_cost?.replacement_cost__sum || 0,
          all_time: props.maintainanceCostByYear?.all_time_actual_cost?.replacement_cost__sum || 0,
        },
      },
      {
        name: "Unsegregated Cost",
        value: {
          this_year: props.maintainanceCostByYear?.this_year_actual_cost?.cost_total__sum || 0,
          all_time: props.maintainanceCostByYear?.all_time_actual_cost?.cost_total__sum || 0,
        },
      },
    ];

    const plannedTableData = [
      {
        name: "Labour Cost",
        value: {
          this_year: props.maintainanceCostByYear?.this_year_expected_cost?.labour_cost || 0,
          all_time: props.maintainanceCostByYear?.all_time_expected_cost?.labour_cost || 0,
        },
      },
      {
        name: "Consumable Cost",
        value: {
          this_year: props.maintainanceCostByYear?.this_year_expected_cost?.material_cost || 0,
          all_time: props.maintainanceCostByYear?.all_time_expected_cost?.material_cost || 0,
        },
      },
      {
        name: "Replacement Cost",
        value: {
          this_year: props.maintainanceCostByYear?.this_year_expected_cost?.replacement_cost || 0,
          all_time: props.maintainanceCostByYear?.all_time_expected_cost?.replacement_cost || 0,
        },
      },
      {
        name: "Unsegregated Cost",
        value: {
          this_year: props.maintainanceCostByYear?.this_year_expected_cost?.unsegregated_cost || 0,
          all_time: props.maintainanceCostByYear?.all_time_expected_cost?.unsegregated_cost || 0,
        },
      },
    ];

    setActualTableData(actualTableData);
    setPlannedTableData(plannedTableData);

    setActualDisttribution(seriesActualData);
    setPlannedDisttribution(seriesPlannedData);
  }, [props.incomeByCategory, props.expenseByCategory, props.maintainanceCostByYear]);

  var colorPalette = ["#2680eb", "#69a7f1", "#accef7", "#cde2fa"];

  var colorPalette2 = ["#eb9126", "#f1b369", "#f7d5ac", "#fae6cd"];

  // console.log(plannedDistriBution, "<<<<<<<<<<<plannedTableData")

  return (
    <div className="row">
      <div className="col-lg-6">
        <GeneralCard
          title={t("home:maintenanceCostDistributionActual")}
          className="mr-md-3 mt-2"
          print={true}
        >
          <GeneralChart
            minHeight={250}
            options={{
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
              },
              legend: {
                bottom: "-2%",
                // top: "10%",
                // orient: "vertical",
                formatter: "{name}",
              },

              series: [
                {
                  name: t("home:thisYear"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["25%", "45%"],
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `${props.currency}  ${
                        getNumberByLanguage(
                          props.maintainanceCostByYear?.this_year_actual_cost
                            ?.this_year_actual_cost_total
                        ) || 0
                      }`;
                    },
                  },
                  data: actualDistriBution?.this_year,
                  color: colorPalette,
                },
                {
                  name: t("home:allTime"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["75%", "45%"],
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `${props.currency}  ${
                        getNumberByLanguage(
                          props.maintainanceCostByYear?.all_time_actual_cost
                            ?.all_time_actual_cost_total
                        ) || 0
                      }`;
                    },
                  },
                  data: actualDistriBution?.all_time,
                  color: colorPalette,
                },
              ],
            }}
          />
          <DataTable
            tableData={actualTableData}
            headers={[t("home:thisYear"), t("home:allTime")]}
          />
        </GeneralCard>
      </div>
      <div className="col-lg-6">
        <GeneralCard
          title={t("home:maintenanceCostDistributionExpected")}
          className="ml-md-3  mt-2"
          print={true}
        >
          <GeneralChart
            minHeight={250}
            options={{
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
              },

              legend: {
                bottom: "-2%",
                // top: "10%",
                // orient: "vertical",
                formatter: "{name}",
              },

              series: [
                {
                  name: t("home:thisYear"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["25%", "45%"],
                  //   itemStyle: {
                  //     borderRadius: 5,
                  //   },
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `${props.currency}  ${
                        getNumberByLanguage(
                          props.maintainanceCostByYear?.this_year_expected_cost
                            ?.all_time_expected_cost_total
                        ) || 0
                      }`;
                    },
                  },

                  data: plannedDistriBution?.this_year,
                  color: colorPalette2,
                },
                {
                  name: t("home:allTime"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["75%", "45%"],
                  //   itemStyle: {
                  //     borderRadius: 5,
                  //   },
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `${props.currency}  ${
                        getNumberByLanguage(
                          props.maintainanceCostByYear?.all_time_expected_cost
                            ?.all_time_expected_cost_total
                        ) || 0
                      }`;
                    },
                  },
                  data: plannedDistriBution?.all_time,
                  color: colorPalette2,
                },
              ],
            }}
          />
          <DataTable
            tableData={plannedTableData}
            headers={[t("home:thisYear"), t("home:allTime")]}
          />
        </GeneralCard>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  incomeByCategory: state.reportData.incomeByCategoryData.data,
  expenseByCategory: state.reportData.expenseByCategoryData.data,
  maintainanceCost: state.reportData.maintainanceCostData.data,
  maintainanceCostByYear: state.reportData.maintainanceCostByYearData.data,
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DonoughtChart);
