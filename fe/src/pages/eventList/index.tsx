import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import './eventList.scss'
import { Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { handleTime } from '~/utils/const';
import { Link } from 'react-router-dom';
import Work from '~/services/work';
import { WorkInfo } from '~/types/dataType';

const EventList = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfo[]>([])

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
                    const res = await Work.getAll({
                        userId: userInfo._id as String
                    })

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

    const handleDeleteEvent = async (id: String) => {
        const check = confirm("Do you want to delete this event?")
        if (!check || !id) return
        try {
            messageApi.open({
                key: 'updatable',
                type: 'loading',
                content: 'Loading...',
            });
            const res = await Work.delete(id)
            if (res.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                setListEvent(listEvent.filter((val) => val._id === id))
            } else {
                messageApi.open({
                    key: 'updatable',
                    type: 'error',
                    content: res.message,
                    duration: 2,
                });
            }
        } catch (e) {
            console.log(e)
            messageApi.open({
                key: 'updatable',
                type: 'error',
                content: 'Delete failed',
                duration: 2,
            });
        }
    }

    return (
        <div className='event'>
            {contextHolder}
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
                            <h4 className="name">
                                <Link to={`/detail/${val._id}`}>{val.workTitle}</Link>
                            </h4>
                            <div className="box">
                                <p className="time">
                                    {handleTime(val.workDateStart as String)} -  {handleTime(val.workDateEnd as String)}
                                </p>
                                {
                                    (userInfo._id === val.userId?._id)
                                    && (
                                        <div className="box-btn">
                                            <button className='box-btn__edit'>
                                                <EditOutlined />
                                            </button>
                                            <button
                                                className='box-btn__delete'
                                                onClick={() => handleDeleteEvent(val._id as String)}
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default EventList