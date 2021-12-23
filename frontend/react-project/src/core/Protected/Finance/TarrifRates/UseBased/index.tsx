import React from "react";
import UseBasedForm from "./Form";
import UseBasedList from "./List";

interface Props {}

const UseBased = (props: Props) => {
  const [editData, setEditData] = React.useState<any>();


  return (
    <div>
      <UseBasedForm editData={editData}  setEditData={setEditData}/>

      <UseBasedList setEditData={setEditData} />
    </div>
  );
};

export default UseBased;
