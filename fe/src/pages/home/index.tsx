import './home.scss'
import type { Dayjs } from 'dayjs';
import { Badge, Calendar, Modal } from 'antd';
import { GroupInfoDataItem, WorkInfoDataItem } from '~/types/dataType';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/store/selectors';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import EventForm from '~/components/EventForm';
import { useLoadingContext } from '~/utils/loadingContext';
import GroupInfoService from '~/services/groupInfo';
import WorkInfoService from '~/services/workInfo';

type typeDate = 'warning' | 'success' | 'error'

type eventDataType = {
    start: String
    end: String
    type: typeDate
    content: String
}

const Home = () => {
    const userInfo = useSelector(userInfoSelector)
    const [listEvent, setListEvent] = useState<WorkInfoDataItem[]>([])
    const [dateSelect, setDateSelect] = useState<String>('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setIsLoading } = useLoadingContext();
    const [listGroup, setListGroup] = useState<GroupInfoDataItem[]>([])

    const getListGroups = async () => {
        setIsLoading(true)
        try {
            const res = await GroupInfoService.getByUser(userInfo._id as String, true)
            if (res?.errorCode === 0 && Array.isArray(res?.data) && res?.data.length > 0) {
                setListGroup(res.data.filter((group) => group.groupInfoStatus === true))
            }
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const getListEventByGroup = async () => {
        setIsLoading(true)
        try {
            let result: WorkInfoDataItem[] = []

            if (listGroup.length > 0) {
                for (const group of listGroup) {
                    const res = await WorkInfoService.getAll({
                        groupId: group.groupId._id as String,
                        userId: userInfo._id as String,
                    })
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

    useEffect(() => {
        document.title = 'Home';

        (async () => {
            if (userInfo?._id) {
                await getListGroups()
            }
        })()
    }, [userInfo])

    useEffect(() => {
        (async () => {
            await getListEventByGroup()
        })()
    }, [listGroup])

    const getData = (data: WorkInfoDataItem[]): eventDataType[] => {
        return data.map((val): eventDataType => ({
            start: val.workId.workDateStart as String,
            end: val.workId.workDateEnd as String,
            type: val.workInfoStatus ? 'success' : 'warning',
            content: val.workId.workTitle as String
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
        const select = value.format('YYYY-MM-DD')
        if (new Date(select).getTime() < new Date().getTime()) {
            return
        }
        setDateSelect(select)
        setIsModalOpen(true);
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
                footer={null}
                maskClosable={true}
                onCancel={handleCancel}
            >
                <EventForm isModal={true} data={{ workDateStart: dateSelect }} setIsModalOpen={setIsModalOpen} />
            </Modal>
        </div>
    )
}

export default Home