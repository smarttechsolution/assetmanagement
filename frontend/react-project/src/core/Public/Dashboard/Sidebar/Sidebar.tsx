import {
  CashbookIcon,
  FinanceIcon,
  HomeIcon,
  MaintainIcon,
  ServiceIcon,
  VisualizationIcon,
  Notifications,
} from "assets/images/xd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";
import { NavItem, UncontrolledCollapse } from "reactstrap";
import useAuthentication from "services/authentication/AuthenticationService";
import { RootState } from "store/root-reducer";

interface Props {
  sidebarToggle: boolean;
  setsidebarToggle: (state: boolean) => void;
}
const Sidebar = (props: Props) => {
  const history = useHistory();
  const { isAuthenticated } = useAuthentication();

  const { sidebarToggle, setsidebarToggle } = props;
  const togglesidebar = () => setsidebarToggle(!sidebarToggle);

  const slug = useSelector(
    (state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.slug
  );
  const schemeDetails = useSelector(
    (state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data
  );

  const { t } = useTranslation(["sidebar"]);

  const internalSidebarItems = [
    { name: "home", title: t("sidebar:home"), link: "/auth/home", icon: HomeIcon },
    {
      name: "finance",
      title: t("sidebar:finance"),
      icon: FinanceIcon,
      link: "",
      children: [
        {
          name: "tarrifrate",
          title: t("sidebar:tariffRates"),
          link: "/auth/tarrif-rates",
          icon: VisualizationIcon,
        },
        {
          name: "otherexpense",
          title: `${t("sidebar:otherParam")}`,
          link: "/auth/other-expense",
          icon: CashbookIcon,
        },
        {
          name: "inflationParams",
          title: `${t("sidebar:inflationParam")}`,
          link: "/auth/inflation-parameters",
          icon: CashbookIcon,
        },
        {
          name: "cashbook",
          title: t("sidebar:cashbook"),
          link: "/auth/cash-book",
          icon: CashbookIcon,
        },
      ],
    },
    {
      name: "maintainance",
      title: t("sidebar:maintainance"),
      icon: MaintainIcon,
      link: "",
      children: [
        {
          name: "manageComponent",
          title: `${t("sidebar:componentCategories")}`,
          link: "/auth/manage-categories",
          icon: MaintainIcon,
        },
        {
          name: "assetcomponents",
          title: t("sidebar:assetComponent"),
          link: "/auth/asset-components",
          icon: MaintainIcon,
        },
        {
          name: "componentLogs",
          title: t("sidebar:componentLogs"),
          link: "/auth/component-logs",
          icon: MaintainIcon,
        },
      ],
    },
    {
      name: "service",
      title: t("sidebar:service"),
      icon: ServiceIcon,
      link: "",
      children: [
        {
          name: "waterSupplyRecord",
          title: `${t("sidebar:waterSupplyRecord")}`,
          link: "/auth/water-supply-record",
          icon: ServiceIcon,
        },
        // {
        //   name: "waterTestResult",
        //   title: `${t("sidebar:waterTestResult")}`,
        //   link: "/auth/water-test-result",
        //   icon: ServiceIcon,
        // },
        {
          name: "service",
          title: t("sidebar:quality"),
          link: "/auth/water-quality-test",
          icon: ServiceIcon,
        },
      ],
    },

    {
      name: "notification",
      title: t("home:notifications"),
      link: "/auth/update-notification",
      icon: Notifications,
    },

    // {
    //   name: "service",
    //   title: t("sidebar:service"),
    //   icon: ServiceIcon,
    //   link: "",
    //   children: [
    //     {
    //       name: "qualityTestParameters",
    //       title: t("home:qtp"),
    //       link: "/auth/water-quality-test",
    //       icon: ServiceIcon,
    //     },
    //   ],
    // },

    // {
    //   name: "notification",
    //   title: t("home:notifications"),
    //   icon: Notifications,
    //   link: "",
    //   children: [
    //     {
    //       name: "createNotifications",
    //       title: t("home:updateNotifications"),
    //       link: "/auth/update-notification",
    //       icon: Notifications,
    //     },
    //     // {
    //     //   name: "updateNotifications",
    //     //   title: t("home:updateNotifications"),
    //     //   link: "/update-notification",
    //     //   icon: Notifications,
    //     // },
    //   ],
    // },
  ];

  const sidebarItems = [
    {
      name: "home",
      title: t("sidebar:home"),
      link: "/scheme/" + slug + "/home",
      icon: HomeIcon,
    },
    {
      name: "finance",
      title: t("sidebar:finance"),
      icon: FinanceIcon,
      link: "",
      children: [
        {
          name: "visualization",
          title: t("sidebar:visualization"),
          link: "/scheme/" + slug + "/visualization",
          icon: VisualizationIcon,
        },
        {
          name: "cashbook",
          title: t("sidebar:cashbook"),
          link: "/scheme/" + slug + "/cash-book",
          icon: CashbookIcon,
        },
      ],
    },
    {
      name: "maintainance",
      title: t("sidebar:maintainance"),
      icon: MaintainIcon,
      link: "",
      children: [
        {
          name: "costvisualization",
          title: t("sidebar:dataVisualization"),
          link: "/scheme/" + slug + "/cost-visualization",
          icon: MaintainIcon,
        },
        {
          name: "assetcomponents",
          title: t("sidebar:assetComponent"),
          link: "/scheme/" + slug + "/asset-components",
          icon: MaintainIcon,
        },
      ],
    },
    {
      name: "service",
      title: t("sidebar:service"),
      icon: ServiceIcon,
      link: "",
      children: [
        {
          name: "supplyvisualization",
          title: t("sidebar:supplyVisualization"),
          link: "/scheme/" + slug + "/supply-visualization",
          icon: ServiceIcon,
        },
        {
          name: "qualityTestResults",
          title: t("qualityTestResult"),
          link: "/scheme/" + slug + "/quality-test-results",
          icon: ServiceIcon,
        },
      ],
    },
  ];

  const checkParentActive = (item) => {
    let active = false;

    item.children.forEach((child) => {
      if (window.location.href.indexOf(child.link) > -1) {
        active = true;
      }
    });
    return active;
  };

  const finalSidebarItems =
    window.location.href?.includes("auth") && isAuthenticated()
      ? internalSidebarItems
      : sidebarItems;

  return (
    <aside className="sidebar">
      <div className=" my-3">
        <div className="align-vertical justify-content-between">
          <div>
            <h6 className="ml-2 sidebar-text des sidebar-brand">
              {schemeDetails?.scheme_name || "-"}
            </h6>
            <span className="ml-2  sidebar-text mt-0 sidebar-brand small">
              {schemeDetails?.location || "-"}
            </span>
          </div>
          <div role="button" className="toggler-close" onClick={togglesidebar}>
            <h6 className="ic-menu"></h6>
          </div>
        </div>
      </div>

      <ul className="list list-sidebar">
        {finalSidebarItems.map((item) => {
          if (item.children) {
            return (
              <React.Fragment key={item.name}>
                <li>
                  <Link
                    id={item.name}
                    to="#"
                    className={`${checkParentActive(item) ? "active" : ""}`}
                  >
                    <img src={item.icon} alt="" className="menu_icon" />
                    {item.title}
                  </Link>
                </li>
                <li key={item.name}>
                  <UncontrolledCollapse
                    toggler={`#${item.name}`}
                    className="ml-3 menu__collapsable-sub collapse"
                  >
                    {item.children.map((subitem) => (
                      <Link
                        to={subitem.link}
                        className={`${window.location.href?.includes(subitem.link) ? "active" : ""
                          }`}
                      >
                        <img src={subitem.icon} alt="" className="menu_icon" /> {subitem.title}
                      </Link>
                    ))}
                  </UncontrolledCollapse>
                </li>
              </React.Fragment>
            );
          } else {
            return (
              <li key={item.name}>
                <NavLink
                  to={item.link}
                  activeClassName={`${window.location.href?.includes(item.link) ? "active" : ""}`}
                >
                  <img src={item.icon} alt="" className="menu_icon" /> {item.title}
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
      <div className="side-footer">
        {/* <p> Design & Develop by smarttech </p> */}
        <div className="footer-link">
          <NavItem>
            <div>
              Developed by :<a href="http://smarttech.com.np/" target="_blank" style={{fontSize:"0.77rem"}}> Smart Tech</a>
            </div>
            <div>
              Contact: <a href="mailto:info@smarttech.com.np" style={{fontSize: "0.77rem"}}>info@smarttech.com.np</a>
            </div>
          </NavItem>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
