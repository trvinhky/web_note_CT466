import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import './eventList.scss'
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { WorkerInfo } from '~/types/dataType';
import Worker from '~/services/worker'
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { handleTime } from '~/utils/const';

const EventList = () => {
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkerInfo[]>([])

    const handleChangeTime = (value: string) => {
        console.log(`selected ${value}`);
    };

    const handleChangeType = (value: string) => {
        console.log(`selected ${value}`);
    };

    useEffect(() => {
        const getAllEvent = async () => {
            if (userInfo) {
                try {
                    const res = await Worker.getAll({ userId: (userInfo._id || userInfo.id) as String })

                    if (res.errorCode === 0 && Array.isArray(res.data)) {
                        setListEvent(res.data)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getAllEvent()
    }, [userInfo])

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
                {
                    listEvent.length > 0 && listEvent.map((val) => (
                        <li className="event-list__item" key={val._id as string}>
                            <span
                                className={`mark mark--${val.workId?.markId?.markName?.toLocaleLowerCase()}`}
                            >
                                {val.workId?.markId?.markName}
                            </span>
                            <h4 className="name">
                                {val.workId?.workTitle}
                            </h4>
                            <div className="box">
                                <p className="time">
                                    {handleTime(val.workId?.workDateStart as Date)} -  {handleTime(val.workId?.workDateEnd as Date)}
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
                    ))
                }
            </ul>
        </div>
    )
}

export default EventList