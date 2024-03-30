import './home.scss'
import type { Dayjs } from 'dayjs';
import { Badge, Calendar, Modal } from 'antd';
import { WorkInfo } from '~/types/dataType';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/store/selectors';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Work from '~/services/work';
import EventForm from '~/components/EventForm';

type typeDate = 'warning' | 'success' | 'error'

type eventDataType = {
    start: String
    end: String
    type: typeDate
    content: String
}

const Home = () => {
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfo[]>([])
    const [dateSelect, setDateSelect] = useState<String>('')
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getAllEvent = async () => {
            if (userInfo) {
                try {
                    const res = await Work.getAll({
                        userId: userInfo._id as String,
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

    const getData = (data: WorkInfo[]): eventDataType[] => {
        return data.map((val): eventDataType => ({
            start: val.workDateStart as String,
            end: val.workDateEnd as String,
            type: val.workStatus ? 'success' : 'warning',
            content: val.workTitle as String
        }))
    }

    const getListData = (value: Dayjs) => {
        const eventData = getData(listEvent);
        const currentDate = value.startOf('day');

        const listData = eventData.filter(event => {
            const eventEndDate = dayjs(event.end as string).startOf('day');

            // Chỉ lấy các sự kiện có ngày kết thúc trùng với ngày hiện tại
            return eventEndDate.isSame(currentDate, 'day');
        });

        return listData || [];
    };


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
            return null; // Trường hợp mặc định
        };
    }, [dateCellRender]);

    const handleSelect = (value: Dayjs) => {
        const listData = getListData(value);
        if (listData.length > 0) {
            listData.forEach(event => {
                const startTime = dayjs(event.start as string).format('HH:mm');
                const endTime = dayjs(event.end as string).format('HH:mm');
                console.log('Start time:', startTime);
                console.log('End time:', endTime);
                // Thực hiện các thao tác cần thiết với thời gian (time)
            });
        } else {
            const select = value.format('YYYY-MM-DD')
            if (new Date(select).getTime() < new Date().getTime()) {
                return
            }
            setDateSelect(select)
            setIsModalOpen(true);
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='home'>
            <Calendar
                cellRender={cellRender}
                onSelect={handleSelect}
            />
            <Modal
                title="Create New Event"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <EventForm isModal={true} data={{ workDateStart: dateSelect }} />
            </Modal>
        </div>
    )
}

export default Home