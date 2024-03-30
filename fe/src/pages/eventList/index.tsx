import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import './eventList.scss'
import { Select, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { convertDate, DATEFORMATFULL } from '~/utils/const';
import { Link, useNavigate } from 'react-router-dom';
import Work from '~/services/work';
import { WorkInfo } from '~/types/dataType';

const { Paragraph } = Typography;

const EventList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfo[]>([])

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    const years = Array.from({ length: 30 }, (_, i) => ({ value: 1900 + i, label: (1900 + i).toString() }));

    const handleChangeMonth = (value: Number) => {
        console.log(`selected ${value}`);
    };

    const handleChangeYear = (value: Number) => {
        console.log(`selected ${value}`);
    };

    const handleChangeStatus = (value: boolean) => {
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

    const handleEdit = (userId: String, workDateEnd: String) => {
        navigate(`/edit?userId=${userId}&workDateEnd=${workDateEnd}`)
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
                        defaultValue={1}
                        style={{ width: 120 }}
                        onChange={handleChangeMonth}
                        options={months}
                    />
                    <Select
                        defaultValue={1900}
                        style={{ width: 120 }}
                        onChange={handleChangeYear}
                        options={years}
                    />
                    <Select
                        defaultValue={false}
                        style={{ width: 120 }}
                        onChange={handleChangeStatus}
                        options={[
                            { value: false, label: 'Doing' },
                            { value: true, label: 'Complete' },
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
                            <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                                {val.workDescription}
                            </Paragraph>
                            <div className="box">
                                <p className="time">
                                    {convertDate(val.workDateStart as String, DATEFORMATFULL)} -  {convertDate(val.workDateEnd as String, DATEFORMATFULL)}
                                </p>
                                {
                                    (userInfo._id === val.userId?._id)
                                    && (
                                        <div className="box-btn">
                                            <button
                                                className='box-btn__edit'
                                                onClick={() => handleEdit(val.userId?._id as String, val.workDateEnd as String)}
                                            >
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