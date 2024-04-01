import '~/assets/scss/header.scss'
import Logo from './Logo'
import { useEffect, useMemo, useState } from 'react';
import { Badge, Drawer, message, notification, Typography } from 'antd';
import { BarsOutlined, BellFilled, CheckCircleOutlined, FormOutlined, HistoryOutlined, HomeOutlined, InfoCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { userInfoSelector } from '~/store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { WorkInfo } from '~/types/dataType';
import Work from '~/services/work';
import { Link } from 'react-router-dom';
import { actions } from '~/store/usersSlice';
import { useLoadingContext } from '~/utils/loadingContext';
import NotFound from '~/assets/images/notification.jpg'

const { Paragraph } = Typography;

const Header = () => {
    const [open, setOpen] = useState(false);
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfo[]>([])
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const { setIsLoading } = useLoadingContext();
    const [api, contextHolderNotification] = notification.useNotification();

    useEffect(() => {
        const callAPITime = setTimeout(() => {
            (async () => {
                if (userInfo && userInfo._id) {
                    try {
                        const res = await Work.getCurrent({
                            userId: userInfo._id as String,
                            status: false
                        })

                        if (res?.errorCode === 0 && Array.isArray(res.data)) {
                            setListEvent(res.data)
                        }

                    } catch (e) {
                        console.log(e)
                    }
                }
            })()
        }, 60000)

        return () => clearTimeout(callAPITime)

    }, [])

    useMemo(() => {
        if (listEvent?.length > 0) {
            listEvent.forEach((event) => {
                handleNotification(event)
            })
        }
    }, [listEvent])

    const handleSignOut = () => {
        dispatch(actions.LogOut())
    }

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const openNotification = (message: String, description: String, keyNo: String) => {
        const key = `${keyNo}`;
        api.open({
            message,
            description,
            key,
            onClose: close,
        });
    };

    const updateStatusWork = async (id: String) => {
        setIsLoading(true)
        try {
            const res = await Work.update(id, {
                workStatus: true
            })
            if (res?.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });

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

    const handleNotification = (data: WorkInfo) => {
        const time = new Date(data?.workDateEnd as string).getTime()
        if (time <= new Date().getTime()) {
            openNotification(
                data.workTitle as String,
                data.workDescription as String,
                data._id as String
            )
        }
    }

    const fillerElementListEvent = (workId: String) => {
        setListEvent(
            listEvent.filter((val) => val._id !== workId)
        )
    }

    const handleCheckEvent = async (id: String) => {
        await updateStatusWork(id)
        fillerElementListEvent(id)
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
                <Link to='/create-event' className="header-nav__link">
                    <FormOutlined /> Create
                </Link>
                <span className="header-nav__logout" onClick={handleSignOut}>
                    Logout <LogoutOutlined />
                </span>
                <Badge count={listEvent?.length} overflowCount={99}>
                    <span className='header-nav__report' onClick={showDrawer}>
                        <BellFilled style={{ fontSize: '1.4rem' }} />
                    </span>
                </Badge>
            </nav>
            <Drawer title="Notification" onClose={onClose} open={open}>
                <ul className="header-list">
                    {
                        listEvent.length > 0 && listEvent.map((val) => (
                            <li className="header-list__item" key={val._id as string}>
                                <h5>{val.workTitle}</h5>
                                <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                                    {val.workDescription}
                                </Paragraph>
                                <div className="header-list__footer">
                                    <div className="group-btn">
                                        <span
                                            className="group-btn__check"
                                            onClick={() => handleCheckEvent((val._id as String))}
                                        >
                                            <CheckCircleOutlined />
                                        </span>
                                        <Link to={`/detail?userId=${val.userId?._id}&workDateEnd=${val.workDateEnd}`} className='group-btn__info'><InfoCircleOutlined /></Link>
                                    </div>
                                    <span className="time"><HistoryOutlined />7 hours left</span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {
                    listEvent.length <= 0 &&
                    <span className="no-notification">
                        <img src={NotFound} alt="no-notification" />
                    </span>
                }
            </Drawer>
        </div>
    )
}

export default Header