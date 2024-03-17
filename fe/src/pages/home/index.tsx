import './home.scss'
import type { Dayjs } from 'dayjs';
import { Badge, Calendar } from 'antd';
import { WorkerInfo } from '~/types/dataType';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/store/selectors';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Worker from '~/services/worker';

type typeDate = 'warning' | 'success' | 'error'

type eventDataType = {
    start: String
    end: String
    type: typeDate
    content: String
}

const Home = () => {
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkerInfo[]>([])

    const getType = (type: String): typeDate => {
        switch (type.toLowerCase()) {
            case 'normal':
                return 'warning'
            case 'low':
                return 'success'
            case 'high':
                return 'error'
            default:
                return 'success'
        }
    }

    useEffect(() => {
        const getAllEvent = async () => {
            if (userInfo) {
                try {
                    const res = await Worker.getAll({
                        userId: (userInfo._id || userInfo.id) as String,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
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

    const getData = (data: WorkerInfo[]): eventDataType[] => {
        return data.map((val): eventDataType => ({
            start: val.workId?.workDateStart as String,
            end: val.workId?.workDateEnd as String,
            type: getType(val.workId?.markId?.markName as String),
            content: val.workId?.workTitle as String
        }))
    }

    const getListData = (value: Dayjs) => {
        const eventData = getData(listEvent);
        const startDate = value.startOf('day');
        const endDate = value.endOf('day');

        const listData = eventData.filter(event => {
            const eventStartDate = dayjs(event.start as string);
            const eventEndDate = dayjs(event.end as string);

            // Chỉ lấy các sự kiện nằm trong khoảng thời gian mong muốn
            return eventStartDate.isSame(startDate, 'day') || (eventStartDate.isBefore(endDate, 'day') && eventEndDate.isAfter(startDate, 'day'));
        });

        return listData || [];
    };


    const getMonthData = (value: Dayjs) => {
        if (value.month() === 8) {
            return 1394;
        }
    };

    const monthCellRender = useMemo(() => {
        return (value: Dayjs) => {
            const num = getMonthData(value);
            return num ? (
                <div className="notes-month">
                    <section>{num}</section>
                    <span>Backlog number</span>
                </div>
            ) : null;
        };
    }, []);

    const dateCellRender = useMemo(() => {
        return (value: Dayjs) => {
            const listData = getListData(value);

            return (
                <ul className="events">
                    {listData.map((item, i) => (
                        <li key={item.content as string + i}>
                            <Badge status={item.type} text={item.content} />
                        </li>
                    ))}
                </ul>
            );
        };
    }, [listEvent]);

    const cellRender = useMemo(() => {
        return (current: Dayjs, info: { type: string }) => {
            if (info.type === 'date') return dateCellRender(current);
            if (info.type === 'month') return monthCellRender(current);
            return null; // Trường hợp mặc định
        };
    }, [dateCellRender, monthCellRender]);

    return (
        <div className='home'>
            <Calendar cellRender={cellRender} />
        </div>
    )
}

export default Home