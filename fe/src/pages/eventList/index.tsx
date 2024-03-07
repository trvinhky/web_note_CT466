import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import './eventList.scss'
import { Select } from 'antd';

const EventList = () => {
    const handleChangeTime = (value: string) => {
        console.log(`selected ${value}`);
    };

    const handleChangeType = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <div className='event'>
            <div className="event-top">
                <h1 className="event-title">
                    Event List
                </h1>
                <div className="event-group">
                    <Select
                        defaultValue="month"
                        style={{ width: 120 }}
                        onChange={handleChangeTime}
                        options={[
                            { value: 'month', label: 'month' },
                            { value: 'year', label: 'year' },
                        ]}
                    />
                    <Select
                        defaultValue="member"
                        style={{ width: 120 }}
                        onChange={handleChangeType}
                        options={[
                            { value: 'member', label: 'member' },
                            { value: 'author', label: 'author' },
                        ]}
                    />
                </div>
            </div>
            <ul className="event-list">
                <li className="event-list__item">
                    <span className="mark mark--normal">Normal</span>
                    <h4 className="name">
                        bao cao nien luan
                    </h4>
                    <div className="box">
                        <p className="time">
                            2024-01-31 00:05:00 - 2024-02-01 11:59:59
                        </p>
                        <div className="box-btn">
                            <button className='box-btn__edit'>
                                <EditOutlined />
                            </button>
                            <button className='box-btn__delete'>
                                <DeleteOutlined />
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default EventList