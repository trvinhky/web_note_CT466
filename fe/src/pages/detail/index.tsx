import { useEffect, useState } from 'react';
import './detail.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkInfo } from '~/types/dataType';
import Work from '~/services/work';
import ImageWork from '~/assets/images/work.jpeg'
import { BulbOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useLoadingContext } from '~/utils/loadingContext';
import { message, Popconfirm } from 'antd';

function Detail() {
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId');
    const workDateEnd = searchParams.get('workDateEnd');
    const [workInfo, setWorkInfo] = useState<WorkInfo>()
    const navigate = useNavigate();
    const { setIsLoading } = useLoadingContext();

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            if (userId && workDateEnd) {
                try {
                    const res = await Work.getInfo(userId, workDateEnd)

                    if (res?.errorCode === 0 && !Array.isArray(res.data)) {
                        setWorkInfo(res.data)
                    }

                } catch (e) {
                    console.log(e)
                }
            } else navigate('/')
            setIsLoading(false)
        })()

    }, [userId, workDateEnd])

    const handleEdit = () => {
        navigate(`/edit?userId=${userId}&workDateEnd=${workDateEnd}`)
    }

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

    return (
        <div className='detail' style={{ backgroundImage: `url(${ImageWork})` }}>
            {contextHolder}
            <div className="detail-info">
                <h2 className="detail-info__title">
                    <BulbOutlined /> {workInfo?.workTitle}
                </h2>
                <p className="detail-info__desc">
                    {workInfo?.workDescription}
                </p>
                <div className="detail-info__time">
                    <ClockCircleOutlined /> 2024-01-10 09:00:00 - 2024-02-01 10:00:00
                </div>
                <div className="detail-info__auth">
                    <UserOutlined /> <span>{workInfo?.userId?.userName}</span>
                </div>

                <div className="detail-info__group">
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
                        onConfirm={() => handleDeleteEvent(workInfo?._id as String)}
                    >
                        <button
                            className="detail-info__group--delete"
                        >
                            <DeleteOutlined />
                        </button>
                    </Popconfirm>

                </div>
                <span className={`detail-info__status ${workInfo?.workStatus ? 'active' : ''}`}>
                    {workInfo?.workStatus ? 'Complete' : 'Doing'}
                </span>
            </div>
        </div>
    )
}

export default Detail