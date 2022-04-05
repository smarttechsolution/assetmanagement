import { UserIcon } from "assets/images/xd";
import { getEnglishNumberFromNepali } from "i18n/i18n";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/root-reducer";

interface Props {
  first?: any;
  second?: any;
  title: any;
  subTitle: string | number;
  value: string | number;
  children?: any;
}

export const InfoCard = ({ children, title, subTitle, value, first, second }: Props) => {
  const language = useSelector((state: RootState) => state.i18nextData.languageType);

  const currency = useSelector(
    (state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.currency
  );

  console.log(getEnglishNumberFromNepali(value), "englishnumber");

  return (
    <div className="infoCard">
      <div className="infoCard-header">
        <h6 className="infoCard-header-title">{title}</h6>
      </div>

      <div className="infoCard-mid-content">
        {subTitle && <p className="infoCard-sub-title">{subTitle}</p>}

        {first ? (
          <h1
            className={`infoCard-price ${
              getEnglishNumberFromNepali(value) > 0
                ? "text-green"
                : getEnglishNumberFromNepali(value) < 0
                ? "text-danger"
                : ""
            } `}
            style={{ fontFamily: language === "en" ? " Roboto" : "" }}
          >
            {currency} {value}
          </h1>
        ) : second ? (
          <></>
        ) : (
          <h1 className="infoCard-price" style={{ fontFamily: language === "en" ? " Roboto" : "" }}>
            {value}
          </h1>
        )}
      </div>

      {children}
    </div>
  );
};
