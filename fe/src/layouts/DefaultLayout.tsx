import { ContactsOutlined, FormOutlined, HomeOutlined, SettingOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Row, Col, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import '~/assets/scss/default.scss'
import Header from "~/components/Header";
import { userInfoSelector } from "~/store/selectors";
import { actions } from "~/components/usersSlice";


const DefaultLayout = () => {
    const userInfo = useSelector(userInfoSelector)
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(actions.LogOut())
    }

    return (
        <>
            <header className="center">
                <div className="container">
                    <Header />
                </div>
            </header>
            <main className="center default">
                <div className="container">
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <div className="default-content">
                                <div className="default-avatar">
                                    <div className="center">
                                        <Avatar size={120} icon={<UserOutlined />} />
                                    </div>
                                    <span className="default-avatar__name">
                                        {userInfo && userInfo.userName}
                                    </span>
                                    <div className="center">
                                        <button
                                            className="default-avatar__logout"
                                            onClick={handleSignOut}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                                <nav className="default-nav">
                                    <Link to='/' className="default-nav__link">
                                        <HomeOutlined /> Home
                                    </Link>
                                    <Link to='/info' className="default-nav__link">
                                        <ContactsOutlined /> Info
                                    </Link>
                                    <Link to='/create-event' className="default-nav__link">
                                        <FormOutlined /> Create New Event
                                    </Link>
                                    <Link to='/event-list' className="default-nav__link">
                                        <UnorderedListOutlined /> Event List
                                    </Link>
                                    <Link to='/admin' className="default-nav__link">
                                        <SettingOutlined /> Admin
                                    </Link>
                                </nav>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className="default-content">
                                <Outlet />
                            </div>
                        </Col>
                    </Row>
                </div>
            </main>
        </>
    )
}

export default DefaultLayout