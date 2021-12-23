import React from "react";
import { Link } from "react-router-dom";
import { Table } from "reactstrap";

interface Props {}

const SampleTable = (props: Props) => {
  return (
    <div>
      <div className="card card-body table-responsive mt-3">
        <h6 className="mb-2">सवारी दर्ता सूची</h6>
        <Table className="table-02 table-striped">
          <thead>
            <tr>
              <th>Importer Type</th>
              <th>Company/Individual Name</th>
              <th>Vehicle Registered No.</th>
              <th>Category</th>
              <th>Manufacturer Name</th>
              <th>Make Year</th>
              <th className="text-right">कार्य</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Company</td>
              <td>Yamaha Motors</td>
              <td>BA 2 Kha 2289</td>
              <td>Car</td>
              <td>Yamaha</td>
              <td>2018</td>
              <td>
                <ul className="list list__inline justify-content-end">
                  <li>
                    <Link to="/vacancy-detail" className="btn btn-icon-only">
                      <i className="ic-show text-info"></i>
                    </Link>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>Company</td>
              <td>Honda Motors</td>
              <td>BA 4 Kha 8845</td>
              <td>Car</td>
              <td>Honda</td>
              <td>2018</td>
              <td>
                <ul className="list list__inline justify-content-end">
                  <li>
                    <Link to="/vacancy-detail" className="btn btn-icon-only">
                      <i className="ic-show text-info"></i>
                    </Link>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SampleTable;
