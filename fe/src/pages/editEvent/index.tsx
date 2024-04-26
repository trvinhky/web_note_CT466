import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WorkInfoService from '~/services/workInfo';
import GroupInfoService from '~/services/groupInfo';
import { WorkDetail } from "~/types/dataType";
import { useLoadingContext } from "~/utils/loadingContext";
import type { GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Input, DatePicker, Flex, TimePicker, message, Select } from 'antd';
import { convertDate, DATEFORMAT, DATEFORMATFULL, TIMEFORMAT } from '~/utils/const';
import { useSelector } from "react-redux";
import { userInfoSelector } from "~/store/selectors";
import WorkService from "~/services/work";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { TextArea } = Input;

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

type GroupSelect = {
    value: string
    label: string
}

const EditEvent = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const groupId = searchParams.get('groupId');
    const workId = searchParams.get('workId');
    const [data, setData] = useState<WorkDetail>()
    const { setIsLoading } = useLoadingContext();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [listDate, setListDate] = useState<Dayjs[]>([])
    const [listTime, setListTime] = useState<Dayjs[]>([])
    const [listGroup, setListGroup] = useState<GroupSelect[]>([])
    const [selectGroup, setSelectGroup] = useState<string>('')
    const userInfo = useSelector(userInfoSelector)

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            if (groupId && workId) {
                try {
                    const res = await WorkInfoService.getOne(
                        groupId,
                        workId
                    )

                    if (res?.errorCode === 0 && !Array.isArray(res?.data)) {
                        document.title = 'Edit: ' + res.data?.workId.workTitle as string
                        setData(res.data)
                    }

                } catch (e) {
                    console.log(e)
                }
            } else navigate('/event-list')
            setIsLoading(false)
        })()

    }, [groupId, workId])

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            try {
                const res = await GroupInfoService.getByUser(userInfo._id as String, true)
                if (res?.errorCode === 0 && Array.isArray(res?.data)) {
                    let results: GroupSelect[] = []
                    res.data.forEach((data) => {
                        results = [...results, {
                            label: data.groupId?.groupName as string,
                            value: data.groupId?._id as string
                        }]
                    })
                    setListGroup(results)
                }
            } catch (e) {
                console.log(e)
            }
            setIsLoading(false)
        })()
    }, [])

    useMemo(() => {
        if (data) {
            setTitle(data.workId.workTitle as string)
            setDescription(data.workId.workDescription as string)
            setListDate([
                dayjs(convertDate(data.workId.workDateStart as string, DATEFORMAT)),
                dayjs(convertDate(data.workId.workDateEnd as string, DATEFORMAT)),
            ])

            setListTime([
                dayjs(convertDate(data.workId.workDateStart as string, DATEFORMATFULL)),
                dayjs(convertDate(data.workId.workDateEnd as string, DATEFORMATFULL)),
            ])

            setSelectGroup(data.groupId.groupName as string)
        }
    }, [data])

    const displayError = (text: string) => {
        messageApi.open({
            key: 'updatable',
            type: 'error',
            content: text,
            duration: 5,
        });
    }

    const handleUpdateWork = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) {
            displayError('Invalid title!')
            return
        }

        if (!description) {
            displayError('Invalid description!')
            return
        }

        if (listDate.length < 2) {
            displayError('Invalid date!')
            return
        }

        if (listTime.length < 2) {
            displayError('Invalid time!')
            return
        }
        const dateStart = new Date(`${listDate[0]} ${listTime[0]}`)
        const dateEnd = new Date(`${listDate[1]} ${listTime[1]}`)

        if (dateEnd.getTime() < dateStart.getTime()) {
            displayError('The start time must be before the end time!')
            return
        }

        messageApi.open({
            key: 'updatable',
            type: 'loading',
            content: 'Loading...',
        });

        if (!userInfo?._id) {
            navigate("/form")
        }

        setIsLoading(true)
        try {
            const res = await WorkService.update(
                workId as String,
                {
                    workTitle: title,
                    workDescription: description,
                    workDateStart: `${listDate[0].format(DATEFORMAT)} ${listTime[0].format(TIMEFORMAT)}`,
                    workDateEnd: `${listDate[1].format(DATEFORMAT)} ${listTime[1].format(TIMEFORMAT)}`,
                }
            )
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
                content: 'Edit failed',
                duration: 2,
            });
        }
        setIsLoading(false)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    return (
        <div className="center">
            {contextHolder}
            <form className="create-form" onSubmit={handleUpdateWork}>
                <h2 className="title">Edit Event</h2>
                <Flex gap='middle' align='flex-end'>
                    <div className="group-input" style={{ 'flex': 1 }}>
                        <label htmlFor="title">Title</label>
                        <Input
                            id='title'
                            style={{ width: '100%' }}
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div className="group-input">
                        <Select
                            style={{ minWidth: 120 }}
                            allowClear
                            options={listGroup}
                            defaultValue={selectGroup}
                            value={selectGroup}
                            disabled
                        />
                    </div>
                </Flex>
                <div className="group-input">
                    <label htmlFor="description">Description</label>
                    <TextArea
                        id='description'
                        rows={4}
                        style={{ width: '100%' }}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
                <Flex gap='middle' align='flex-end' wrap='wrap'>
                    <div className="group-input" style={{ 'flex': 1 }}>
                        <label htmlFor="date">Date</label>
                        <RangePicker
                            value={[listDate[0], listDate[1]]}
                            disabledDate={disabledDate} style={{ width: '100%' }}
                            onChange={(_, dateStrings) => {
                                setListDate(dateStrings.map(date => dayjs(date)));
                            }}
                        />
                    </div>
                    <div className="group-input" style={{ 'flex': 1 }}>
                        <label htmlFor="time">Time</label>
                        <TimePicker.RangePicker
                            value={[listTime[0], listTime[1]]}
                            style={{ width: '100%' }}
                            onChange={(_, dateStrings) => setListTime([
                                dayjs(dateStrings[0], TIMEFORMAT),
                                dayjs(dateStrings[1], TIMEFORMAT)
                            ])}
                        />
                    </div>

                </Flex>
                <div className="group-btn" style={{ cursor: 'inherit', backgroundColor: '#f1c40f' }}>
                    <button type="submit">Edit</button>
                </div>
            </form>
        </div>
    )
}

export default EditEvent