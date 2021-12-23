import React from "react";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import { RootState } from "store/root-reducer";

interface Props {
  years: any;
  tableData: any;
  type: string
}

const DataTable = (props: Props) => {
  const currency = useSelector((state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.currency)


  return (
    <div className="mt-3 income-expend">
      <div className="table-responsive">
        <Table className="table-02">
          <tbody>
            <tr>
              <td>{props.type}</td>
              {props.years?.map((year, index) => (
                <td key={index}>{year?.replace("Year","")}</td>
              ))}
            </tr>
            {props.tableData?.map((item, index) => (
              <tr key={index}>
                <td>
                  <span
                    className="income-title"
                    style={{ borderBottom: `5px solid ${item.color}` }}
                  >
                    {item.name}
                  </span>
                </td>
                {item.data?.map((data, index) => (
                  <td key={index}>{currency} {data}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
