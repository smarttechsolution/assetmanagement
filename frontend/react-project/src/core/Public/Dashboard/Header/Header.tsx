import { ADToBS } from "components/React/Datepicker/Datepickerutils";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getNumberByLanguage, i18nLanguages } from "../../../../i18n/i18n";
import { switchI18nLanguage } from "../../../../store/modules/i18n/i18n";
import { logoutAction, RootState } from "../../../../store/root-reducer";
import NEP from "assets/images/USAFLAG.png";
import ENG from "assets/images/NPFLAG.png";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import useAuthentication from "services/authentication/AuthenticationService";

interface Props {
  sidebarToggle: boolean;
  setsidebarToggle: (state: boolean) => void;
}
const Header = (props: Props) => {
  const { sidebarToggle, setsidebarToggle } = props;
  const { isAuthenticated } = useAuthentication();

  const i18nextData = useSelector((state: RootState) => state.i18nextData, shallowEqual);
  const languageFormat = useSelector(
    (state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.system_date_format
  );
  const dispatch = useDispatch();

  const userDetails = useSelector((state: RootState) => state.userDetails);

  const initLogout = () => dispatch(logoutAction());

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const togglesidebar = () => setsidebarToggle(!sidebarToggle);

  console.log(languageFormat, "languageFormat");
  return (
    <header className="header">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <a className="ic-menu text-white toggler" onClick={togglesidebar}></a>
        </div>

        <div className="list list__inline list-separator">
          <div className="d-flex align-items-center">
            <i className="ic-calendar  mr-1"> </i>

            <span className="des">
              {languageFormat === "nep"
                ? getNumberByLanguage(ADToBS(new Date()))
                : getNumberByLanguage(new Date().toLocaleDateString())}
            </span>
          </div>
          {isAuthenticated() && (
            <Dropdown isOpen={dropdownOpen} toggle={toggle} tag="div" className="ml-3">
              <DropdownToggle className="auth" tag="a" role="button">
                <div className="textbox mr-2">
                  <h6 className="username">{userDetails?.name}</h6>
                </div>
                <i className="ic-dropdown"></i>
              </DropdownToggle>
              <DropdownMenu right>
                 
                <DropdownItem onClick={initLogout} className="dropdown-item text-danger">
                  <i className="ic-logout"> </i>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          <div className="d-flex align-items-center">
            <a
              className="btn p-0 des"
              onClick={() => {
                const switchlang = i18nLanguages.find((lang) => lang !== i18nextData.languageType);
                if (switchlang) {
                  dispatch(switchI18nLanguage(switchlang));
                }
              }}
            >
              {
                {
                  en: <img src={ENG} className="header-img" />,
                  nep: <img src={NEP} className="header-img" />,
                }[i18nextData.languageType]
              }
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
