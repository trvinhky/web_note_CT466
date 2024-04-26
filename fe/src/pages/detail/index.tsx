import { useEffect, useState } from 'react';
import './detail.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { GroupInfoItem, WorkDetail } from '~/types/dataType';
import Work from '~/services/work';
import ImageWork from '~/assets/images/work.jpeg'
import { BulbOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, HistoryOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useLoadingContext } from '~/utils/loadingContext';
import { message, Popconfirm } from 'antd';
import WorkInfoService from '~/services/workInfo';
import GroupInfoService from '~/services/groupInfo';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';

function Detail() {
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const userInfo = useSelector(userInfoSelector)
    const searchParams = new URLSearchParams(location.search);
    const groupId = searchParams.get('groupId');
    const workId = searchParams.get('workId');
    const [workInfo, setWorkInfo] = useState<WorkDetail>()
    const navigate = useNavigate();
    const { setIsLoading } = useLoadingContext();
    const [groupInfo, setGroupInfo] = useState<GroupInfoItem>()

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            if (groupId && workId) {
                try {
                    const res = await WorkInfoService.getOne(
                        groupId,
                        workId
                    )

                    const resGroup = await GroupInfoService.getOne(groupId)

                    if (res?.errorCode === 0 && !Array.isArray(res?.data) && resGroup?.errorCode === 0 && !Array.isArray(resGroup?.data)) {
                        document.title = res.data?.workId.workTitle as string
                        setWorkInfo(res.data)
                        setGroupInfo(resGroup.data)
                    }

                } catch (e) {
                    console.log(e)
                }
            } else navigate('/event-list')
            setIsLoading(false)
        })()

    }, [groupId, workId])

    const handleEdit = () => {
        navigate(`/edit?userId=${userInfo._id}&groupId=${groupId}&workId=${workId}`)
    }

    const getAuth = () => {
        if (groupInfo?.members) {
            const checkIndex = groupInfo.members.findIndex((group) => group.admin === true)
            return groupInfo.members[checkIndex].user
        }
        return null
    }

    const handleDeleteEvent = async () => {
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
                setIsLoading(false)
                navigate('/')
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

    return (
        <div className='detail' style={{ backgroundImage: `url(${ImageWork})` }}>
            {contextHolder}
            <div className="detail-info">
                <h2 className="detail-info__title">
                    <BulbOutlined /> {workInfo?.workId?.workTitle}
                </h2>
                <p className="detail-info__desc">
                    {workInfo?.workId?.workDescription}
                </p>
                <div className="detail-info__time">
                    <HistoryOutlined /> 2024-01-10 09:00:00 - 2024-02-01 10:00:00
                </div>
                <div className="detail-info__auth">
                    <UserOutlined /> <span>{getAuth()?.userName}</span>
                </div>
                <div className="detail-info__member">
                    <CheckCircleOutlined /> {
                        workInfo?.members?.map((info) => (
                            info.workInfoStatus && <small key={info.userId._id as string}>{info.userId.userName}</small>
                        ))
                    }
                </div>
                <div className="detail-info__member detail-info__member--wait">
                    <ClockCircleOutlined /> {
                        workInfo?.members?.map((info) => (
                            !info.workInfoStatus && <small key={info.userId._id as string}>{info.userId.userName}</small>
                        ))
                    }
                </div>
                {
                    userInfo._id === getAuth()?._id && <div className="detail-info__group">
                        <button
                            className="detail-info__group--edit"
                            onClick={handleEdit}
                        >
                            <EditOutlined />
                        </button>
                        <Popconfirm
                            title="Delete event"
                            description="Do you want to delete this event?"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={handleDeleteEvent}
                        >
                            <button
                                className="detail-info__group--delete"
                            >
                                <DeleteOutlined />
                            </button>
                        </Popconfirm>

                    </div>
                }
            </div>
        </div>
    )
}

export default Detail