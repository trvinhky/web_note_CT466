import './createEvent.scss'
import type { GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Input, DatePicker, Radio, Flex, message } from 'antd';
import { DATEFORMATFULL, TIMEFORMAT } from '~/utils/const';
import { useEffect, useState } from 'react';
import { isValidText } from '~/utils/validation';
import type { RadioChangeEvent } from 'antd';
import User from '~/services/user'
import Mark from '~/services/mark'
import Work from '~/services/work'
import Worker from '~/services/worker'
import { MarkData, UserData } from '~/types/dataType';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const CreateEvent = () => {
    const [title, setTitle] = useState<string>('')
    const [mark, setMark] = useState<string>('')
    const [member, setMember] = useState<string>('')
    const [listSearch, setListSearch] = useState<UserData[]>([])
    const [listMember, setListMember] = useState<UserData[]>([])
    const [isShowList, setIsShowList] = useState<boolean>(false)
    const [listDate, setListDate] = useState<string[]>([])
    const [listMark, setListMark] = useState<MarkData[]>([])
    const [messageApi, contextHolder] = message.useMessage();
    const userInfo = useSelector(userInfoSelector)

    useEffect(() => {
        const getMarkData = async () => {
            try {
                const res = await Mark.getAll()

                if (res.errorCode === 0 && Array.isArray(res.data)) {
                    if (res.data.length > 0) {
                        setMark(res.data[0]._id as string)
                    }
                    setListMark(res.data)
                }
            } catch (e) {
                console.log(e)
            }
        }

        getMarkData()
    }, [])

    const resetValue = () => {
        setListDate([])
        setListMember([])
        setTitle('')
        setMark(listMark[0].markName as string)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleMarkChange = ({ target: { value } }: RadioChangeEvent) => {
        setMark(value);
    };

    const handleMemberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setMember(e.target.value);

        if (member) {
            setTimeout(async () => {
                try {
                    const res = await User.searchAPI(member)
                    if (res.errorCode === 0 && Array.isArray(res.data)) {
                        setListSearch(res.data)
                    }
                } catch (e) {
                    console.log(e)
                }
            }, 3000)
        }
    };

    const handleShow = () => {
        if (member) {
            setIsShowList(true)
        } else {
            setIsShowList(false)
        }
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const handleRemoveMember = (id: String) => {
        const data = listMember.filter((val) => val._id !== id)
        setListMember(data)
    }

    const handleAddMember = (data: UserData) => {
        const check = listMember.findIndex((val) => val._id === data._id)
        if (check !== -1) return
        setListMember((prev) => [...prev, data])
        setMember('')
        setIsShowList(false)
    }

    const createWorker = async (userId: String, workId: String) => {
        try {
            const res = await Worker.create({
                userId: userId,
                workId: workId,
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
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isValid = true

        if (!isValidText(title)) {
            console.log('Title:', title);
            isValid = false
        }

        if (listMember.length <= 0) {
            isValid = false
        }

        if (listDate.length !== 2) {
            isValid = false
        }

        if (isValid && (userInfo._id || userInfo.id)) {
            try {
                messageApi.open({
                    key: 'updatable',
                    type: 'loading',
                    content: 'Loading...',
                });

                const res = await Work.create({
                    workTitle: title,
                    userId: userInfo._id || userInfo.id,
                    markId: mark,
                    workDateStart: listDate[0],
                    workDateEnd: listDate[1]
                })
                if (res.errorCode === 0) {
                    listMember.forEach(async (val) => {
                        if (res.data && !Array.isArray(res.data)) {
                            await createWorker((val._id || val.id) as String, res.data._id as String)
                        }
                    })
                    messageApi.open({
                        key: 'updatable',
                        type: 'success',
                        content: res.message,
                        duration: 2,
                    });
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
                    content: 'Sign In failed',
                    duration: 2,
                });
            }
        }
    };

    return (
        <form className="create-form" onSubmit={handleSubmit}>
            {contextHolder}
            <h2 className="title">Create New Event</h2>
            <div className="group-input">
                <label htmlFor="title">Title</label>
                <Input
                    id='title'
                    style={{ width: '100%' }}
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>
            <div className="group-input">
                <label htmlFor="member">Members</label>
                <div className="group-input__box">
                    {
                        listMember.length > 0 &&
                        listMember.map((val) => (
                            <p
                                className="member"
                                key={val._id as string}
                                onClick={() => handleRemoveMember(val._id as String)}

                            >
                                {val.userEmail} <span></span>
                            </p>
                        ))
                    }
                    <input
                        type="text"
                        id='member'
                        value={member}
                        onChange={handleMemberChange}
                        onKeyUp={handleShow}
                    />
                </div>
                <ul className="group-input__list" style={{ display: isShowList ? 'block' : 'none' }}>
                    {
                        listSearch.length > 0
                            ? listSearch.map((val) => (
                                <li
                                    key={val._id as string}
                                    onClick={() => handleAddMember(val)}
                                >
                                    {val.userEmail}
                                </li>
                            ))
                            : (<span>Not Found</span>)
                    }
                </ul>
            </div>
            <Flex gap='middle' align='flex-end'>
                <div className="group-input">
                    <label htmlFor="date">Date</label>
                    <RangePicker
                        disabledDate={disabledDate}
                        showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [dayjs('00:00:00', TIMEFORMAT), dayjs('11:59:59', TIMEFORMAT)],
                        }}
                        format={DATEFORMATFULL}
                        onChange={(_, dateString) => {
                            setListDate(dateString)
                        }}
                    />
                </div>
                <div className="group-input">
                    <Radio.Group
                        buttonStyle="solid"
                        style={{ display: 'flex' }}
                        onChange={handleMarkChange}
                        value={mark}
                    >
                        {
                            listMark.length > 0 && listMark.map((val) => (
                                <Radio.Button value={val._id} key={val._id as string}>{val.markName}</Radio.Button>
                            ))
                        }
                    </Radio.Group>
                </div>
            </Flex>
            <div className="group-btn">
                <button type="submit">Create</button>
            </div>
        </form>
    )
}

export default CreateEvent