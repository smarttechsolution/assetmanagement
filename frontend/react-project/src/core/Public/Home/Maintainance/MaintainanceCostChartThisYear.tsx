import GeneralChart from "components/UI/Charts/General";
import { getFiscalYearData, getMonthByLanguageAndScheme, getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { MaintainanceCostSingleType } from "store/modules/report/maintainanceCost";
import { RootState } from "store/root-reducer";

export type TotalDataYear = {
  date: number;
  actualCost: number;
  unsegregated: number;
  material: number;
  labour: number;
  replacement: number;
};

export type TotalYearType = {
  date: number;
  value: number | null;
};

export type CustomSingleData = {
  value: string | number;
  itemStyle: { color: string };
};

export type IncomeExpenseType = {
  unsegregated: CustomSingleData[];
  material: CustomSingleData[];
  labor: CustomSingleData[];
  replacement: CustomSingleData[];
  total?: TotalYearType[];
};

interface Props extends PropsFromRedux {}

const MaintainanceCostChartThisYear = (props: Props) => {
  const { t } = useTranslation();

  const [year, setYear] = useState<(string | number)[]>();
  const [actualCost, setActualCost] = useState<IncomeExpenseType | null>(null);
  const [expectedCost, setExpectedCost] = useState<IncomeExpenseType | null>(null);

  useEffect(() => {
    if (props.maintainanceCost && props.intervalData) {
      const fiscalYearArray = getFiscalYearData(
        props.intervalData,
        props.schemeDetails?.system_date_format
      );

      const sortAndMapArray = (
        array: MaintainanceCostSingleType[],
        monthKey: string,
        key: string,
        color: string
      ) => {
        return fiscalYearArray?.map((item) => {
          const findElement = array?.find((inc) => {
            return +inc[monthKey] < 10
              ? +inc[monthKey]?.toString()?.replace("0", "") === +item
              : +inc[monthKey] === +item;
          });
          return {
            value: findElement ? findElement[key] : 0,
            itemStyle: { color },
          };
        });
      };

      const yearData = fiscalYearArray?.map((item) => {
        return getMonthByLanguageAndScheme(item, props.schemeDetails?.system_date_format);
      });

      const actualCost = {
        unsegregated: sortAndMapArray(
          props.maintainanceCost.actual_cost,
          "maintenance_date__month",
          "unsegregated_cost",
          "#e69f00"
        ),
        material: sortAndMapArray(
          props.maintainanceCost.actual_cost,
          "maintenance_date__month",
          "material_cost",
          "#56b4e9"
        ),
        labor: sortAndMapArray(
          props.maintainanceCost.actual_cost,
          "maintenance_date__month",
          "labour_cost",
          "#f0e442"
        ),
        replacement: sortAndMapArray(
          props.maintainanceCost.actual_cost,
          "maintenance_date__month",
          "replacement_cost",
          "#ea75b6"
        ),

        total: props.maintainanceCost.actual_cost.map((item) => ({
          date: item.maintenance_date__month,
          value: item.actual_cost_total || 0,
        })),
      };

      const expectedCost = {
        unsegregated: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "next_action__month",
          "unsegregated_cost",
          "#009e73"
        ),
        material: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "next_action__month",
          "material_cost",
          "#000000"
        ),
        labor: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "next_action__month",
          "labour_cost",
          "#d55e00"
        ),
        replacement: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "next_action__month",
          "replacement_cost",
          "#0072b2"
        ),
        total: props.maintainanceCost.expected_cost.map((item) => ({
          date: item.maintenance_date__month,
          value: item.actual_cost_total || 0,
        })),
      };

      setYear(yearData);
      setActualCost(actualCost);
      setExpectedCost(expectedCost);
    }
  }, [props.maintainanceCost, props.intervalData]);

  return (
    <>
      <GeneralChart
        minHeight={350}
        options={{
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            // formatter: handleCustomTooltip,
          },
          legend: {
            show: false,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "8%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: year,
            axisLabel: {
              formatter: function (data) {
                return data?.replace("Year", "") || " ";
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: function (name) {
                return getNumberByLanguage(name);
              },
            },
          },
          series: [
            {
              name: `${t("home:expected")} ${t("home:unsegregated")}`,
              type: "bar",
              stack: "bar",
              areaStyle: {
                color: "red",
              },
              data: expectedCost?.unsegregated,
            },
            {
              name: `${t("home:expected")} ${t("home:consumable")}`,
              type: "bar",
              stack: "bar",
              data: expectedCost?.material,
            },
            {
              name: `${t("home:expected")} ${t("home:labour")}`,
              type: "bar",
              stack: "bar",
              data: expectedCost?.labor,
            },
            {
              name: `${t("home:expected")} ${t("home:replacement")}`,
              type: "bar",
              stack: "bar",
              data: expectedCost?.labor,
            },
            {
              name: `${t("home:actual")} ${t("home:unsegregated")}`,
              type: "bar",
              stack: "bar2",
              data: actualCost?.unsegregated,
            },
            {
              name: `${t("home:actual")} ${t("home:consumable")}`,
              type: "bar",
              stack: "bar2",
              data: actualCost?.material,
            },
            {
              name: `${t("home:actual")} ${t("home:labour")}`,
              type: "bar",
              stack: "bar2",
              data: actualCost?.labor,
            },
            {
              name: `${t("home:actual")} ${t("home:replacement")}`,
              type: "bar",
              stack: "bar2",
              data: actualCost?.replacement,
            },
          ],
        }}
      />

      <div className="cost-desc table-responsive mt-4">
        <table>
          <tr className="expected">
            <td>
              <h5>{t("home:expectedCost")}</h5>
            </td>
            <td>
              <h6>
                <span className="unseg"></span>
                {t("home:unsegregated")} {t("home:cost")}
              </h6>
            </td>
            <td>
              <h6>
                <span className="material"></span>
                {t("home:maintainanceCost")}
              </h6>
            </td>
            <td>
              <h6>
                <span className="labour"></span>
                {t("home:labour")} {t("home:cost")}
              </h6>
            </td>
            <td>
              <h6>
                <span className="replacement"></span>
                {t("home:replacement")} {t("home:cost")}
              </h6>
            </td>
          </tr>
          <tr className="actual">
            <td>
              <h5>{t("home:actualCost")}</h5>
            </td>
            <td>
              <h6>
                <span className="unseg"></span>
                {t("home:unsegregated")} {t("home:cost")}
              </h6>
            </td>
            <td>
              <h6>
                <span className="material"></span>
                {t("home:maintainanceCost")}
              </h6>
            </td>
            <td>
              <h6>
                <span className="labour"></span>
                {t("home:labour")} {t("home:cost")}
              </h6>
            </td>
            <td>
              <h6>
                <span className="replacement"></span>
                {t("home:replacement")} {t("home:cost")}
              </h6>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  language: state.i18nextData.languageType,
  maintainanceCost: state.reportData.maintainanceCostData.data,
  waterTarrifs: state.waterTarrifsData.waterTarrifData.data,
  intervalData: state.waterSchemeData.getYearIntervals.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MaintainanceCostChartThisYear);
