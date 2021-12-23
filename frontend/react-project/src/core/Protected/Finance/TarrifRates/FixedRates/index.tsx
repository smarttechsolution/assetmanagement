import React from "react";
import FixedRateForm from "./Form";
import FixedRateList from "./List";

interface Props {}

const FixedRate = (props: Props) => {
  const [editData, setEditData] = React.useState<any>();

  return (
    <div>
      <FixedRateForm editData={editData} setEditData={setEditData} />
      <FixedRateList setEditData={setEditData} />
    </div>
  );
};

export default FixedRate;
