import { GeneralCard } from "components/UI/GeneralCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import AssetTable from "./AssetTable";

interface IProps extends PropsFromRedux {}

const AssetComponent = (props: IProps) => {

  const {t} = useTranslation(['maintainance'])

  return (
    <div className="container py-3 assets">
      <GeneralCard title={t('sidebar:assetComponent')}>
        <AssetTable />
      </GeneralCard>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AssetComponent);
