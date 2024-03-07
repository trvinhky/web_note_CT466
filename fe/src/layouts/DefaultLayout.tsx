import { ContactsOutlined, FormOutlined, HomeOutlined, SettingOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Row, Col, Avatar } from "antd";
import { Link, Outlet } from "react-router-dom";
import '~/assets/scss/default.scss'
import Header from "~/components/Header";


const DefaultLayout = () => {
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
                                        Peter
                                    </span>
                                    <div className="center">
                                        <button className="default-avatar__logout">
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