import { TeamOutlined, UserOutlined } from "@ant-design/icons"
import { Col, Row } from "antd"
import { useEffect, useState } from "react"
import EventForm from "~/components/EventForm"
import './createEvent.scss'

const CreateEvent = () => {
    const [itemActive, setItemActive] = useState(false)

    useEffect(() => {
        document.title = 'Create New Event'
    }, [])

    return (
        <Row>
            <Col md={4} xs={24} sm={24}>
                <ul className="create-list">
                    <li
                        className="create-list__item"
                        onClick={() => setItemActive(false)}
                    >
                        <UserOutlined /> Single
                    </li>
                    <li
                        className="create-list__item"
                        onClick={() => setItemActive(true)}
                    >
                        <TeamOutlined /> Groups
                    </li>
                </ul>
            </Col>
            <Col md={20} xs={24} sm={24}>
                <EventForm isGroups={itemActive} />
            </Col>
        </Row>
    )
}

export default CreateEvent