import '~/assets/scss/header.scss'
import Logo from './Logo'
import { useEffect, useState } from 'react';
import { Drawer, message } from 'antd';
import { BellFilled, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { WorkerData, WorkerInfo } from '~/types/dataType';
import Worker from '~/services/worker'
import { APIType } from '~/types/apiType';

const Header = () => {
    const [open, setOpen] = useState(false);
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkerInfo[]>([])
    const [notification, setNotification] = useState<WorkerInfo[]>([])
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const getAllEvent = async () => {
            if (userInfo && (userInfo._id || userInfo.id)) {
                try {
                    const res = await Worker.getAllCurrent((userInfo._id || userInfo.id) as String)
                    const noti = await Worker.getAllByStatus((userInfo._id || userInfo.id) as String, 0)

                    if (res.errorCode === 0 && Array.isArray(res.data)) {
                        setListEvent(res.data)
                    }

                    if (noti.errorCode === 0 && Array.isArray(noti.data)) {
                        setNotification(noti.data)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getAllEvent()
    }, [])

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const callAPI = async (fn: Promise<APIType<WorkerData>>) => {
        try {
            const res = await fn
            if (res.errorCode === 0) {
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
    }

    const fillerElementNotification = (workId: String) => {
        setNotification(
            notification.filter((val) => val.workId?._id !== workId && (val.userId !== userInfo._id || val.userId !== userInfo.id))
        )
    }

    const handleCancelEvent = async (id: String) => {
        await callAPI(Worker.update((userInfo._id || userInfo.id) as String, id, {
            workerStatus: 2
        }))
        fillerElementNotification(id)
    }

    const handleCheckEvent = async (id: String) => {
        await callAPI(Worker.update((userInfo._id || userInfo.id) as String, id, {
            workerStatus: 1
        }))
        fillerElementNotification(id)
    }

    return (
        <div className='header'>
            {contextHolder}
            <div className="header-logo">
                <Logo />
            </div>
            <span className='header-report' onClick={showDrawer}>
                <BellFilled style={{ fontSize: '1.4rem' }} />
            </span>
            <Drawer title="Notification" onClose={onClose} open={open}>
                <ul className="header-list">
                    {
                        listEvent.length > 0 && listEvent.map((val) => (
                            <li className="header-list__item" key={val._id as string}>
                                <h5>{val.workId?.workTitle}</h5>
                                <span
                                    className={`mark mark--${val.workId?.markId?.markName?.toLocaleLowerCase()}`}
                                >
                                    {val.workId?.markId?.markName}
                                </span>
                                <span className="time"><HistoryOutlined />7 hours left</span>
                            </li>
                        ))
                    }
                    {
                        notification.length > 0 && notification.map((val) => (
                            <li className="header-list__item" key={val._id as string}>
                                <h5>{val.workId?.workTitle}</h5>
                                <span
                                    className={`mark mark--${val.workId?.markId?.markName?.toLocaleLowerCase()}`}
                                >
                                    {val.workId?.markId?.markName}
                                </span>
                                <div className="header-list__footer">
                                    <div className="group-btn">
                                        <span
                                            className="group-btn__cancel"
                                            onClick={() => handleCancelEvent((val.workId?._id || val.workId?.id) as String)}
                                        >
                                            <CloseCircleOutlined />
                                        </span>
                                        <div
                                            className="group-btn__check"
                                            onClick={() => handleCheckEvent((val.workId?._id || val.workId?.id) as String)}
                                        >
                                            <CheckCircleOutlined />
                                        </div>
                                    </div>
                                    <span className="time"><HistoryOutlined />7 hours left</span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {
                    notification.length <= 0 && listEvent.length <= 0 &&
                    <span className="no-notification">
                        no notification
                    </span>
                }
            </Drawer>
        </div>
    )
}

export default Header