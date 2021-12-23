import Header from 'core/Public/Dashboard/Header/Header';
import Sidebar from 'core/Public/Dashboard/Sidebar/Sidebar';
import React, { ReactElement, useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux';
import FallbackLoader from '../../../components/React/FallbackLoader/FallbackLoader';
import PrivateRoute from '../../../routes/PrivateRoute/PrivateRoute';
import { initUser } from '../../../store/modules/oauthservice/initapi';
import { RootState } from '../../../store/root-reducer';
import { parseJwt } from '../../../utils/parse-jwt/parse-jwt'; 

interface Props extends PropsFromRedux {
    children: CustomRoute[];
}

function Boundary(props: Props): ReactElement {
    const { children, initUser, initUserData: { data: userData } } = props;

    const [sidebarToggle, setsidebarToggle] = useState(false);
    const [userAdmin, setuserAdmin] = useState(false);
    const [userImporter, setuserImporter] = useState(false);
    const [isUserRoleChecking, setisUserRoleChecking] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    const checkRole = (role: string) => {
        if (role.includes("ADMIN")) {
            setuserAdmin(true);
            setuserImporter(false);
        } else if (role === "IMPORTER_USER") {
            setuserImporter(true);
            setuserAdmin(false);
        } else {
            setuserImporter(false);
            setuserAdmin(false);
        }
        setisUserRoleChecking(false);
    }

    useEffect(() => {
        initUser();
    }, [initUser]);

    useEffect(() => {
        if (userData) {
            checkRole(userData.role)
            setIsProfileComplete(userData.profileSetup)
        }

    }, [userData])

    return (
        <div className={`app theme-dark-blue ${sidebarToggle ? "toggled" : ""}`} style={{ position: "relative" }}>

             
                <Sidebar sidebarToggle={sidebarToggle} setsidebarToggle={setsidebarToggle} />
            
            <main className="stickyHeader">
                <Header sidebarToggle={sidebarToggle} setsidebarToggle={setsidebarToggle} />

                {isUserRoleChecking ?
                    <FallbackLoader />
                    :
                    <div className="inner">
                        <PrivateRoute
                            appRoutes={
                                userAdmin ?
                                    children.filter((path) => path.type === "internal")
                                    :
                                    userImporter ?
                                        children.filter((path) => path.type === "importer")
                                        :
                                        children.filter((path) => path.type === "external")
                            }
                            redirectPath={[
                                userImporter ? (isProfileComplete ? { to: "/importer-detail", from: '/' } : { to: "/importer-registration", from: '/' }) : null,
                                userAdmin ? { to: "/admin/userappoval/pending", from: '/' } : null
                            ]}
                        />
                    </div>
                }
            </main>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    initUserData: state.outhService.initUserData
})

const mapDispatchToProps = {
    initUser: initUser
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Boundary)