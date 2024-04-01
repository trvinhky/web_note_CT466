import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import './eventList.scss'
import { Popconfirm, Select, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { convertDate, DATEFORMATFULL } from '~/utils/const';
import { Link, useNavigate } from 'react-router-dom';
import Work from '~/services/work';
import { WorkInfo } from '~/types/dataType';
import { QueryValue } from '~/types/global';
import { useLoadingContext } from '~/utils/loadingContext';
import Empty from '~/assets/images/empty.gif'

const { Paragraph } = Typography;

const EventList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfo[]>([])
    const [monthSelect, setMonthSelect] = useState<Number>(1)
    const [yearSelect, setYearSelect] = useState<Number>(2000)
    const [statusSelect, setStatusSelect] = useState<boolean>(false)
    const { setIsLoading } = useLoadingContext();

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

    const years = Array.from({ length: 30 }, (_, i) => ({ value: 2000 + i, label: (2000 + i).toString() }));

    const getDatafilter = async (query: QueryValue) => {
        if (!userInfo) return
        setIsLoading(true)
        try {
            const res = await Work.getAll({
                ...query,
                userId: userInfo._id as String
            })

            if (res?.errorCode === 0 && Array.isArray(res.data)) {
                setListEvent(res.data)
            } else {
                setListEvent([])
            }
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const getDataQuery = async () => {
        await getDatafilter({
            month: monthSelect,
            year: yearSelect,
            status: statusSelect as Boolean
        } as QueryValue)
    }

    useMemo(() => {
        (async () => await getDataQuery())()
    }, [monthSelect, statusSelect, yearSelect])

    const handleChangeMonth = async (value: Number) => {
        setMonthSelect(value)
    };

    const handleChangeYear = async (value: Number) => {
        setYearSelect(value)
    };

    const handleChangeStatus = async (value: boolean) => {
        setStatusSelect(value)
    };

    useEffect(() => {
        document.title = 'Event List';

        (async () => {
            setIsLoading(true)
            if (userInfo) {
                try {
                    const res = await Work.getAll({
                        userId: userInfo._id as String
                    })

                    if (res?.errorCode === 0 && Array.isArray(res.data)) {
                        setListEvent(res.data)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            setIsLoading(false)
        })()
    }, [userInfo])

    const handleDeleteEvent = async (id: String) => {
        if (!id) return
        setIsLoading(true)
        try {
            messageApi.open({
                key: 'updatable',
                type: 'loading',
                content: 'Loading...',
            });
            const res = await Work.delete(id)
            if (res?.errorCode === 0) {
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
        setIsLoading(false)
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
                        value={monthSelect}
                        style={{ width: 120 }}
                        onChange={handleChangeMonth}
                        options={months}
                    />
                    <Select
                        value={yearSelect}
                        style={{ width: 120 }}
                        onChange={handleChangeYear}
                        options={years}
                    />
                    <Select
                        value={statusSelect}
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
                                <Link to={`/detail?userId=${val.userId?._id}&workDateEnd=${val.workDateEnd}`}>{val.workTitle}</Link>
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
                                            <Popconfirm
                                                title="Delete event"
                                                description="Do you want to delete this event?"
                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                onConfirm={() => handleDeleteEvent(val._id as String)}
                                            >
                                                <button className='box-btn__delete'>
                                                    <DeleteOutlined />
                                                </button>
                                            </Popconfirm>
                                        </div>
                                    )
                                }
                            </div>
                        </li>
                    ))
                }
            </ul>
            {listEvent?.length <= 0 &&
                <div className="event-empty">
                    <img src={Empty} alt="empty" />
                </div>
            }
        </div>
    )
}

export default EventList