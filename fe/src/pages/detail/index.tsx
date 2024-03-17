import { useEffect, useState } from 'react';
import './detail.scss'
import { useParams } from 'react-router-dom';
import { Members, WorkInfo } from '~/types/dataType';
import Work from '~/services/work';
import Worker from '~/services/worker';

function Detail() {
    const { id } = useParams();
    const [workInfo, setWorkInfo] = useState<WorkInfo>()
    const [members, setMembers] = useState<Members[]>([])

    const convertNumber = (num: number) => num >= 10 ? num : `0${num}`

    const convertTime = (time: String) => {
        const date = new Date(time as string);

        // Get individual components of the date
        const year = date.getFullYear();
        const month = convertNumber(date.getMonth() + 1); // Months are zero-based, so January is 0
        const day = convertNumber(date.getDate());
        const hours = convertNumber(date.getHours());
        const minutes = convertNumber(date.getMinutes());
        const seconds = convertNumber(date.getSeconds());

        // Format the components into a readable string
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        const getWorkInfo = async () => {
            if (id) {
                try {
                    const res = await Work.getInfo(id)
                    const resMember = await Worker.getMembers(id)

                    if (res.errorCode === 0 && !Array.isArray(res.data)) {
                        setWorkInfo(res.data)
                    }

                    if (resMember.errorCode === 0 && Array.isArray(resMember.data)) {
                        setMembers(resMember.data)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getWorkInfo()
    }, [id])

    return (
        <div className='detail'>
            <h1 className="detail-title">
                {workInfo && workInfo.workTitle}
            </h1>
            <div className="detail-info">
                <div className="detail-info__time">
                    <span>{workInfo && convertTime(workInfo.workDateStart as String)}</span>-
                    <span>{workInfo && convertTime(workInfo.workDateEnd as String)}</span>
                </div>
                <span className="detail-info__mark detail-info__mark--normal">
                    {workInfo && workInfo.markId?.markName}
                </span>
            </div>
            <div className="detail-members">
                Members: {members.length > 0 && members.map((member) => (<span key={(member._id || member.id) as string}>{member.userId?.userName}</span>))}
            </div>
            <div className="detail-group">
                <div className="detail-group__check">
                    <span>Total check:</span> 1
                </div>
                <div className="detail-group__check">
                    <span>Author:</span> {workInfo?.userId?.userName}
                </div>
            </div>
        </div>
    )
}

export default Detail