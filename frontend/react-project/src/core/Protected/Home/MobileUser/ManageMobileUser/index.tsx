import React, { useState } from "react";
import Form from "./Form";
import List from "./List";

interface Props {
  toggle: any
}

const ManageMobileUser = (props: Props) => {
  const [editData, setEditData] = useState<any>();

  return (
    <div className="row">
      <div className="col-12">
        <Form editData={editData} setEditData={setEditData} toggle={props.toggle} />
      </div>
      <div className="col-12">
        <List setEditData={setEditData} toggle={props.toggle}/>
      </div>
    </div>
  );
};

export default ManageMobileUser;
