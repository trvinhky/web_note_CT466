import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import './eventList.scss'
import { Popconfirm, Select, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { convertDate, DATEFORMATFULL } from '~/utils/const';
import { Link, useNavigate } from 'react-router-dom';
import Work from '~/services/work';
import { GroupInfoDataItem, WorkInfoDataItem } from '~/types/dataType';
import { ParamsFuncAll } from '~/types/global';
import { useLoadingContext } from '~/utils/loadingContext';
import Empty from '~/assets/images/empty.gif'
import GroupInfoService from '~/services/groupInfo';
import WorkInfoService from '~/services/workInfo';

const { Paragraph } = Typography;

type SelectType = {
    value: string
    label: string
}

const EventList = () => {
    const currentYear = new Date().getFullYear() - 29

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfoDataItem[]>([])
    const [monthSelect, setMonthSelect] = useState<Number>(1)
    const [yearSelect, setYearSelect] = useState<Number>(currentYear)
    const [statusSelect, setStatusSelect] = useState<boolean>(false)
    const { setIsLoading } = useLoadingContext();
    const [listGroup, setListGroup] = useState<GroupInfoDataItem[]>([])
    const [groupSelect, setGroupSelect] = useState<string>('')
    const [groupOptions, setGroupOptions] = useState<SelectType[]>([])

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

    const years = Array.from({ length: 30 }, (_, i) => ({ value: currentYear + i, label: (currentYear + i).toString() }));

    const getListGroups = async () => {
        setIsLoading(true)
        try {
            const res = await GroupInfoService.getByUser(userInfo._id as String, true)
            if (res?.errorCode === 0 && Array.isArray(res?.data) && res?.data.length > 0) {
                setListGroup(res.data)
                let results: SelectType[] = []
                res.data.forEach((group) => {
                    results = [...results, {
                        value: group.groupId._id as string,
                        label: group.groupId.groupName as string
                    }]
                })
                setGroupOptions(results)
            }
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const getListEventByGroup = async (isInit: Boolean = true) => {
        setIsLoading(true)
        try {
            let result: WorkInfoDataItem[] = []

            if (listGroup.length > 0) {
                for (const group of listGroup) {
                    let params: ParamsFuncAll = {
                        groupId: group.groupId._id as String,
                        userId: userInfo._id as String,
                    }
                    if (!isInit) {
                        params = {
                            ...params,
                            status: statusSelect,
                            month: monthSelect,
                            year: yearSelect
                        }
                    }
                    const res = await WorkInfoService.getAll(params)
                    if (res?.errorCode === 0 && Array.isArray(res?.data)) {
                        result = [...result, ...res.data]
                    }
                }
            }
            setListEvent(result)
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const getEventByGroupId = async () => {
        setIsLoading(true)
        try {
            let result: WorkInfoDataItem[] = []

            if (groupSelect) {
                const res = await WorkInfoService.getAll({
                    groupId: groupSelect,
                    userId: userInfo._id as String,
                })
                if (res?.errorCode === 0 && Array.isArray(res?.data)) {
                    result = [...result, ...res.data]
                }
            }
            setListEvent(result)
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const handleChangeMonth = async (value: Number) => {
        setMonthSelect(value)
    };

    const handleChangeGroup = async (value: string) => {
        setGroupSelect(value)
    };

    const handleChangeYear = async (value: Number) => {
        setYearSelect(value)
    };

    const handleChangeStatus = async (value: boolean) => {
        setStatusSelect(value)
    };

    const getAuthId = (groupId: String) => {
        const authIdx = listGroup.findIndex((group) => group.groupId._id === groupId && group.groupInfoAdmin === true)
        if (authIdx !== -1) {
            return listGroup[authIdx].userId
        }
        return ''
    }

    useEffect(() => {
        document.title = 'Event List';

        (async () => {
            if (userInfo?._id) {
                await getListGroups()
            }
        })()
    }, [userInfo])

    useEffect(() => {
        (async () => {
            await getListEventByGroup(false)
        })()
    }, [monthSelect, yearSelect, statusSelect])

    useEffect(() => {
        (async () => {
            await getEventByGroupId()
        })()
    }, [groupSelect])

    useEffect(() => {
        (async () => {
            await getListEventByGroup()
        })()
    }, [listGroup])

    const handleDeleteEvent = async (workId: String, groupId: String) => {
        setIsLoading(true)
        if (!workId || !groupId) {
            setIsLoading(false)
            return
        }
        try {
            messageApi.open({
                key: 'updatable',
                type: 'loading',
                content: 'Loading...',
            });
            const resInfo = await WorkInfoService.delete(groupId, workId)
            const res = await Work.delete(workId)
            if (res?.errorCode === 0 && resInfo?.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                setListEvent(listEvent.filter((val) => val.groupId._id !== groupId && val.workId._id !== workId))
            } else {
                messageApi.open({
                    key: 'updatable',
                    type: 'error',
                    content: res.message,
                    duration: 2,
                });
            }
        } catch (e) {
            messageApi.open({
                key: 'updatable',
                type: 'error',
                content: 'Delete failed',
                duration: 2,
            });
        }
        setIsLoading(false)
    }

    const handleEdit = (userId: String, groupId: String, workId: String) => {
        navigate(`/edit?userId=${userId}&groupId=${groupId}&workId=${workId}`)
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
                        value={groupSelect}
                        style={{ width: 120 }}
                        onChange={handleChangeGroup}
                        options={groupOptions}
                    />
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
                                <Link to={`/detail?groupId=${val.groupId?._id}&workId=${val.workId._id}`}>{val.workId.workTitle}</Link>
                            </h4>
                            <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                                {val.workId.workDescription}
                            </Paragraph>
                            <div className="box">
                                <p className="time">
                                    {convertDate(val.workId.workDateStart as String, DATEFORMATFULL)} -  {convertDate(val.workId.workDateEnd as String, DATEFORMATFULL)}
                                </p>
                                {
                                    (userInfo._id === getAuthId(val.groupId._id as String))
                                    && (
                                        <div className="box-btn">
                                            <button
                                                className='box-btn__edit'
                                                onClick={() => handleEdit(userInfo._id as String, val.groupId._id as String, val.workId._id as String)}
                                            >
                                                <EditOutlined />
                                            </button>
                                            <Popconfirm
                                                title="Delete event"
                                                description="Do you want to delete this event?"
                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                onConfirm={() => handleDeleteEvent(val.workId._id as String, val.groupId._id as String)}
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