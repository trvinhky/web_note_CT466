import '~/assets/scss/createEvent.scss'
import type { GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Input, DatePicker, Flex, TimePicker, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import Work from '~/services/work';
import WorkInfo from '~/services/workInfo';
import GroupInfo from '~/services/groupInfo';
import { useSelector } from 'react-redux';
import { groupSelector, userInfoSelector } from '~/store/selectors';
import { useNavigate } from 'react-router-dom';
import { WorkData } from '~/types/dataType';
import { DATEFORMAT, TIMEFORMAT } from '~/utils/const';
import { useLoadingContext } from '~/utils/loadingContext';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { TextArea } = Input;

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

type PropsType = {
    isModal?: boolean
    data?: WorkData
    setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isGroups?: boolean
}

type GroupSelect = {
    value: string
    label: string
}

const EventForm = ({ isModal, data, setIsModalOpen, isGroups }: PropsType) => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const userInfo = useSelector(userInfoSelector)
    const groupInfo = useSelector(groupSelector)
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [listDate, setListDate] = useState<Dayjs[]>([])
    const [listTime, setListTime] = useState<Dayjs[]>([])
    const [listGroup, setListGroup] = useState<GroupSelect[]>([])
    const [groupId, setGroupId] = useState<String>()
    const [selectGroup, setSelectGroup] = useState<string>('')

    const { setIsLoading } = useLoadingContext();

    useEffect(() => {
        setGroupId(groupInfo?._id);
        (async () => {
            if (isGroups && userInfo?._id) {
                setIsLoading(true)
                try {
                    const res = await GroupInfo.getByUser(userInfo._id as String, true)
                    if (res?.errorCode === 0 && Array.isArray(res?.data)) {
                        let results: GroupSelect[] = []
                        res.data.forEach((data) => {
                            if (data.groupId?.groupName !== userInfo.userName) {
                                results = [...results, {
                                    label: data.groupId?.groupName as string,
                                    value: data.groupId?._id as string
                                }]
                            }
                        })
                        if (results.length > 0) setSelectGroup(results[0].value)
                        setListGroup(results)
                    }
                } catch (e) {
                    console.log(e)
                }
                setIsLoading(false)
            }
        })()
    }, [isGroups])

    useEffect(() => {
        if (isModal && data) {
            setListDate([
                dayjs(data.workDateStart as string)
            ])
        }
    }, [data, isModal])

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

    const resetValue = () => {
        setTitle('')
        setDescription('')
        setListDate([])
        setListTime([])
    }

    const displayError = (text: string) => {
        messageApi.open({
            key: 'updatable',
            type: 'error',
            content: text,
            duration: 5,
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

        if (!userInfo._id) {
            navigate("/form")
        }

        setIsLoading(true)
        try {
            const groupIdCurrent: String = isGroups ? selectGroup : groupId as String
            const res = await Work.create({
                workTitle: title,
                workDescription: description,
                workDateStart: `${listDate[0].format(DATEFORMAT)} ${listTime[0].format(TIMEFORMAT)}`,
                workDateEnd: `${listDate[1].format(DATEFORMAT)} ${listTime[1].format(TIMEFORMAT)}`,
                groupId: groupIdCurrent,
            })
            if (res?.errorCode === 0 && !Array.isArray(res?.data)) {
                const idWork = res.data?._id as String
                if (isGroups) {
                    // create event multiple
                    const resMember = await GroupInfo.getOne(groupIdCurrent)
                    if (resMember?.errorCode === 0 && !Array.isArray(resMember?.data)) {
                        resMember?.data?.members?.forEach(async (member) => {
                            const resInfo = await WorkInfo.create({
                                groupId: groupIdCurrent,
                                workId: idWork,
                                userId: member.user._id as String
                            })
                            if (resInfo.errorCode !== 0) {
                                await Work.delete(idWork)
                                return
                            }
                        })
                    } else await Work.delete(idWork)
                } else {
                    // create event single
                    const resInfo = await WorkInfo.create({
                        groupId: groupIdCurrent,
                        userId: userInfo._id as String,
                        workId: idWork
                    })

                    if (resInfo?.errorCode !== 0) {
                        messageApi.open({
                            key: 'updatable',
                            type: 'error',
                            content: resInfo.message,
                            duration: 2,
                        });
                        await Work.delete(idWork)
                        return
                    }
                }
            }

            if (res?.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                if (isModal && setIsModalOpen) setIsModalOpen(false)
                resetValue()
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
                content: 'Create failed',
                duration: 2,
            });
        }
        setIsLoading(false)
    };

    const handleChangeGroup = (value: string) => {
        setSelectGroup(value)
    };

    return (
        <div className="center">
            {contextHolder}
            <form className="create-form" onSubmit={handleSubmit}>
                {!isModal && <h2 className="title">Create New Event</h2>}
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
                    {
                        isGroups &&
                        <div className="group-input">
                            <Select
                                style={{ minWidth: 120 }}
                                allowClear
                                options={listGroup}
                                defaultValue={selectGroup}
                                value={selectGroup}
                                onChange={handleChangeGroup}
                            />
                        </div>
                    }
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
                <div className="group-btn" style={{ cursor: 'inherit' }}>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}

export default EventForm