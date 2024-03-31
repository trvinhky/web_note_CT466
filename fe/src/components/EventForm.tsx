import '~/assets/scss/createEvent.scss'
import type { GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Input, DatePicker, Radio, Flex, TimePicker, message } from 'antd';
import { useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import Work from '~/services/work';
import { useSelector } from 'react-redux';
import { userInfoSelector } from '~/store/selectors';
import { useNavigate } from 'react-router-dom';
import { WorkData } from '~/types/dataType';
import { convertDate, DATEFORMAT, DATEFORMATFULL, TIMEFORMAT } from '~/utils/const';
import { useLoadingContext } from '~/utils/loadingContext';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { TextArea } = Input;

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

type PropsType = {
    isEdit?: boolean
    isModal?: boolean
    data?: WorkData
    setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const EventForm = ({ isEdit, isModal, data, setIsModalOpen }: PropsType) => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const userInfo = useSelector(userInfoSelector)
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [status, setStatus] = useState<boolean>(false)
    const [listDate, setListDate] = useState<Dayjs[]>([])
    const [listTime, setListTime] = useState<Dayjs[]>([])

    const { setIsLoading } = useLoadingContext();

    useEffect(() => {
        if (isEdit && data) {
            setTitle(data.workTitle as string)
            setDescription(data.workDescription as string)
            setStatus(data.workStatus as boolean)
            setListDate([
                dayjs(convertDate(data.workDateStart as string, DATEFORMAT)),
                dayjs(convertDate(data.workDateEnd as string, DATEFORMAT)),
            ])

            setListTime([
                dayjs(convertDate(data.workDateStart as string, DATEFORMATFULL)),
                dayjs(convertDate(data.workDateEnd as string, DATEFORMATFULL)),
            ])
        }
    }, [isEdit])

    useEffect(() => {
        if (isModal && data) {
            setListDate([
                dayjs(data.workDateStart as string)
            ])
        }
    }, [isModal])

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleStatusChange = ({ target: { value } }: RadioChangeEvent) => {
        setStatus(value);
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
            let res
            if (isEdit) {
                res = await Work.update(data?._id as String, {
                    workTitle: title,
                    workDescription: description,
                    workDateStart: `${listDate[0].format(DATEFORMAT)} ${listTime[0].format(TIMEFORMAT)}`,
                    workDateEnd: `${listDate[1].format(DATEFORMAT)} ${listTime[1].format(TIMEFORMAT)}`,
                    workStatus: status
                })
            } else {
                res = await Work.create({
                    workTitle: title,
                    workDescription: description,
                    workDateStart: `${listDate[0].format(DATEFORMAT)} ${listTime[0].format(TIMEFORMAT)}`,
                    workDateEnd: `${listDate[1].format(DATEFORMAT)} ${listTime[1].format(TIMEFORMAT)}`,
                    userId: userInfo._id,
                    workStatus: status
                })
            }

            if (!res) return

            if (res.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                if (isEdit) navigate("/event-list")
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
                content: isEdit ? 'Edit failed' : 'Create failed',
                duration: 2,
            });
        }
        setIsLoading(false)
    };

    return (
        <div className="center">
            {contextHolder}
            <form className="create-form" onSubmit={handleSubmit}>
                {!isModal && <h2 className="title">{isEdit ? 'Edit Event' : 'Create New Event'}</h2>}
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
                        !isModal &&
                        <div className="group-input">
                            <Radio.Group
                                buttonStyle="solid"
                                style={{ display: 'flex' }}
                                onChange={handleStatusChange}
                                value={status}
                            >
                                <Radio.Button value={false}>Doing</Radio.Button>
                                <Radio.Button value={true}>Complete</Radio.Button>
                            </Radio.Group>
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
                <div className="group-btn">
                    <button type="submit">{isEdit ? 'Save' : 'Create'}</button>
                </div>
            </form>
        </div>
    )
}

export default EventForm