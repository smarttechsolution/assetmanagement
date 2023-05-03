import React, { useState } from "react";
import Form from "./Form";
import List from "./List";

interface Props {
  toggle: any
}

const ManageSupply = (props: Props) => {
  const [editData, setEditData] = useState<any>();

  return (
    <div className="row">
      <div className="col-12">
        <Form editData={editData} toggle={props.toggle} setEditData={setEditData}/>
      </div>
      <div className="col-12">
        <List setEditData={setEditData} />
      </div>
    </div>
  );
};

export default ManageSupply;
