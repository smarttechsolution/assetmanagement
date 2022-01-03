import React from "react";
import Form from "./Form";
import List from "./List";

interface Props {}

const ManageComponentLists = (props: Props) => {
  const [editData, setEditData] = React.useState<any>();

  return (
    <div>
      <Form editData={editData} setEditData={setEditData} />

      <List setEditData={setEditData} />
    </div>
  );
};

export default ManageComponentLists;