import '~/assets/scss/header.scss'
import Logo from './Logo'
import { useEffect, useState } from 'react';
import { Badge, Drawer, message, notification, Typography } from 'antd';
import { BarsOutlined, BellFilled, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, FormOutlined, HistoryOutlined, HomeOutlined, InfoCircleOutlined, LogoutOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { userInfoSelector } from '~/store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { GroupInfoDataItem, WorkInfoDataItem } from '~/types/dataType';
import { Link, useNavigate } from 'react-router-dom';
import { actions } from '~/store/usersSlice';
import { useLoadingContext } from '~/utils/loadingContext';
import NotFound from '~/assets/images/notification.jpg'
import GroupInfoService from '~/services/groupInfo';
import WorkInfoService from '~/services/workInfo';

const { Paragraph } = Typography;

interface Notification {
    message: string;
    description: string;
    key: string;
}

const Header = () => {
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfoDataItem[]>([])
    const [listEventComing, setListEventComing] = useState<WorkInfoDataItem[]>([])
    const [messageApi, contextHolder] = message.useMessage();
    const [listGroup, setListGroup] = useState<GroupInfoDataItem[]>([])
    const dispatch = useDispatch();
    const { setIsLoading } = useLoadingContext();
    const [api, contextHolderNotification] = notification.useNotification();
    const [notificationList, setNotificationList] = useState<Notification[]>([])
    const [groupsWait, setGroupsWait] = useState<GroupInfoDataItem[]>([])
    const navigate = useNavigate();

    const getListGroups = async (isRes = true) => {
        try {
            const res = await GroupInfoService.getByUser(userInfo._id as String, isRes)
            if (res?.errorCode === 0 && Array.isArray(res?.data) && res?.data.length > 0) {
                if (isRes) {
                    setListGroup(res.data)
                } else {
                    setGroupsWait(res.data)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getListEventByGroup = async () => {
        try {
            let result: WorkInfoDataItem[] = []

            if (listGroup.length > 0) {
                for (const group of listGroup) {
                    const res = await WorkInfoService.getAllCurrent(
                        group.groupId._id as String
                        , userInfo._id as String
                    )
                    if (res?.errorCode === 0 && Array.isArray(res.data)) {
                        result = [...result, ...res.data]
                    }
                }
            }
            setListEvent(result)
        } catch (e) {
            console.log(e)
        }
    }

    const getEventComing = async () => {
        try {
            let result: WorkInfoDataItem[] = []

            if (listGroup.length > 0) {
                for (const group of listGroup) {
                    const res = await WorkInfoService.getAllCurrent(
                        group.groupId._id as String
                        , userInfo._id as String
                        , 7
                    )
                    if (res?.errorCode === 0 && Array.isArray(res?.data)) {
                        result = [...result, ...res.data]
                    }
                }
            }
            setListEventComing(result)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        (async () => {
            if (userInfo?._id) {
                await getListGroups()
                await getListGroups(false)
            } else {
                navigate('/form')
            }
        })()
    }, [])

    useEffect(() => {
        const callAPITime = setTimeout(() => {
            (async () => {
                await getListEventByGroup()
            })()
        }, 60000)

        return () => clearTimeout(callAPITime)

    }, [listGroup])

    const handleSignOut = () => {
        dispatch(actions.LogOut())
    }

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onCloseMenu = () => {
        setOpenMenu(false);
    };

    const openNotification = (message: String, description: String, keyNo: String) => {
        const key = `${keyNo}`;
        api.open({
            message,
            description,
            key,
            icon: (
                <ExclamationCircleOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
            duration: 3
        });
    };

    const updateStatusWork = async (groupId: String, workId: String) => {
        setIsLoading(true)
        try {
            const res = await WorkInfoService.update({
                userId: userInfo._id as String,
                groupId,
                workId,
                workInfoStatus: true
            })
            if (res?.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                await getListEventByGroup()
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
                content: 'failed',
                duration: 2,
            });
        }
        setIsLoading(false)
    }

    useEffect(() => {
        notificationList.forEach(notification => {
            openNotification(notification.message, notification.description, notification.key);
        });
    }, [notificationList]);

    const handleNotification = (data: WorkInfoDataItem) => {
        const time = new Date(data?.workId.workDateEnd as string).getTime()
        if (time >= new Date().getTime()) {
            const message = data?.workId.workTitle as string;
            const description = data?.workId.workDescription as string;
            const key = data._id as string;
            setNotificationList(prevList => [...prevList, { message, description, key }]);
        }
    }

    useEffect(() => {
        if (listEvent?.length > 0) {
            listEvent.forEach((event) => {
                handleNotification(event)
            })
        }
    }, [listEvent])

    useEffect(() => {
        (async () => {
            await getEventComing()
        })()
    }, [listGroup])

    useEffect(() => {
        if (listEventComing?.length > 0) {
            listEventComing.forEach((event) => {
                handleNotification(event)
            })
        }
    }, [listEventComing])

    const fillerElementListEvent = (groupId: String, workId: String) => {
        setListEvent(
            listEvent.filter((val) => val.workId._id !== workId && val.groupId._id !== groupId)
        )
    }

    const handleCheckEvent = async (groupId: String, workId: String) => {
        await updateStatusWork(groupId, workId)
        fillerElementListEvent(groupId, workId)
    }

    const convertHoursLeft = (date: String) => {
        const now = new Date();
        const targetDate = new Date(date as string);
        const timeDifference = targetDate.getTime() - now.getTime();
        const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));

        const day = Math.floor(hoursLeft / 24) * -1
        const hours = (hoursLeft % 24) * -1

        if (day !== 0) {
            return `${day} days ${hours} hours ${hoursLeft >= 0 ? 'left' : 'ago'}`
        }
        return hours + " hours left"
    }

    const handleAcceptGroup = async (groupId: String) => {
        setIsLoading(true)
        try {
            const res = await GroupInfoService.update({
                userId: userInfo._id as String,
                groupId,
            })
            if (res?.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                await getListGroups(false)
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
                content: 'failed',
                duration: 2,
            });
        }
        setIsLoading(false)
    }

    const handleCancelGroup = async (groupId: String) => {
        setIsLoading(true)
        try {
            const res = await GroupInfoService.delete({
                userId: userInfo._id as String,
                groupId,
            })
            if (res?.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                await getListGroups(false)
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
                content: 'failed',
                duration: 2,
            });
        }
        setIsLoading(false)
    }

    return (
        <div className='header'>
            {contextHolder}
            {contextHolderNotification}
            <div className="header-logo">
                <Logo />
            </div>
            <nav className="header-nav">
                <Link to='/' className="header-nav__link">
                    <HomeOutlined /> Home
                </Link>
                <Link to='/event-list' className="header-nav__link">
                    <BarsOutlined /> List
                </Link>
                <Link to='/group' className="header-nav__link">
                    <BarsOutlined /> Groups
                </Link>
                <Link to='/create-event' className="header-nav__link">
                    <FormOutlined /> Create
                </Link>
                <span className="header-nav__logout" onClick={handleSignOut}>
                    Logout <LogoutOutlined />
                </span>
                <Badge count={listEvent?.length + groupsWait.length} overflowCount={99}>
                    <span className='header-nav__report' onClick={showDrawer}>
                        <BellFilled style={{ fontSize: '1.4rem' }} />
                    </span>
                </Badge>
            </nav>
            <nav className="header-tablet">
                <button className="header-tablet__btn" onClick={() => setOpenMenu(true)}>
                    <UnorderedListOutlined />
                </button>
            </nav>
            <Drawer title="Notification" onClose={onClose} open={open}>
                <ul className="header-list">
                    {
                        listEvent.length > 0 && listEvent.map((val) => (
                            <li className="header-list__item" key={val._id as string}>
                                <h5>{val?.workId?.workTitle}</h5>
                                <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                                    {val?.workId?.workDescription}
                                </Paragraph>
                                <div className="header-list__footer">
                                    <div className="group-btn group-btn--header">
                                        <span
                                            className="group-btn__check"
                                            onClick={() => handleCheckEvent(val.groupId._id as String, val.workId._id as String)}
                                        >
                                            <CheckCircleOutlined />
                                        </span>
                                        <Link
                                            to={`/detail?groupId=${val.groupId?._id}&workId=${val.workId._id}`} className='group-btn__info'
                                        ><InfoCircleOutlined /></Link>
                                    </div>
                                    <span className="time"><HistoryOutlined />{convertHoursLeft(val.workId.workDateEnd as String)}</span>
                                </div>
                            </li>
                        ))
                    }
                    {
                        groupsWait.length > 0 && groupsWait.map((group) => (
                            <li className="header-list__item" key={group._id as string}>
                                <Link to={`/group/${group.groupId._id}`}>
                                    <h5>{group.groupId.groupName}</h5>
                                </Link>
                                <div className="header-list__footer">
                                    <div className="group-btn group-btn--header">
                                        <span
                                            className="group-btn__check"
                                            onClick={() => handleAcceptGroup(group.groupId._id as String)}
                                        >
                                            <CheckCircleOutlined />
                                        </span>
                                        <span
                                            className="group-btn__cancel"
                                            onClick={() => handleCancelGroup(group.groupId._id as String)}
                                        >
                                            <CloseCircleOutlined />
                                        </span>
                                    </div>
                                    <span className="time"><HistoryOutlined />{convertHoursLeft(group.groupId.groupCreateAt as String)}</span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {
                    listEvent.length <= 0 && groupsWait.length <= 0 &&
                    <span className="no-notification">
                        <img src={NotFound} alt="no-notification" />
                    </span>
                }
            </Drawer>
            <Drawer
                title="Menu"
                placement='left'
                onClose={onCloseMenu}
                open={openMenu}
            >
                <Link to='/' className="header-tablet__link">
                    <HomeOutlined /> Home
                </Link>
                <Link to='/event-list' className="header-tablet__link">
                    <BarsOutlined /> List
                </Link>
                <Link to='/group' className="header-tablet__link">
                    <BarsOutlined /> Groups
                </Link>
                <Link to='/create-event' className="header-tablet__link">
                    <FormOutlined /> Create
                </Link>
                <span className="header-tablet__link" onClick={showDrawer}>
                    <BellFilled /> Notification
                </span>
                <span className="header-tablet__logout" onClick={handleSignOut}>
                    Logout <LogoutOutlined />
                </span>
            </Drawer>
        </div>
    )
}

export default Header