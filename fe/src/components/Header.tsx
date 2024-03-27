import '~/assets/scss/header.scss'
import Logo from './Logo'
import { useEffect, useState } from 'react';
import { Drawer, message } from 'antd';
import { BellFilled, CheckCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { WorkInfo } from '~/types/dataType';
import Work from '~/services/work';

const Header = () => {
    const [open, setOpen] = useState(false);
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfo[]>([])
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const getAllEvent = async () => {
            if (userInfo && userInfo._id) {
                try {
                    const res = await Work.getCurrent({
                        userId: userInfo._id as String,
                        status: false
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
    }, [])

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const updateStatusWork = async (id: String) => {
        try {
            const res = await Work.update(id, {
                workStatus: true
            })
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
                                <h5>{val.workTitle}</h5>
                                <div className="header-list__footer">
                                    <div className="group-btn">
                                        <span
                                            className="group-btn__check"
                                            onClick={() => handleCheckEvent((val._id as String))}
                                        >
                                            <CheckCircleOutlined />
                                        </span>
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
                        no notification
                    </span>
                }
            </Drawer>
        </div>
    )
}

export default Header