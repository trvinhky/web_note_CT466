import './createEvent.scss'
import type { GetProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Input, DatePicker, Radio, Flex } from 'antd';
import { DATEFORMATFULL, TIMEFORMAT } from '~/utils/const';
import { useState } from 'react';
import { isValidText } from '~/utils/validation';
import type { RadioChangeEvent } from 'antd';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const CreateEvent = () => {
    const [title, setTitle] = useState<string>('')
    const [mark, setMark] = useState<string>('low')
    const [member, setMember] = useState<string>('')
    const [isShowList, setIsShowList] = useState<boolean>(false)

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleMarkChange = ({ target: { value } }: RadioChangeEvent) => {
        setMark(value);
    };

    const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMember(e.target.value);
    };

    const handleShow = () => {
        if (member) {
            setIsShowList(true)
        } else {
            setIsShowList(false)
        }
    }

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 60).splice(4, 20),
                disabledMinutes: () => range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => range(0, 60).splice(20, 4),
            disabledMinutes: () => range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isValidText(title)) {
            console.log('Title:', title);
        }
    };

    return (
        <form className="create-form" onSubmit={handleSubmit}>
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
                    <p className="member">
                        kyb2005802@student.ctu.edu.vn <span></span>
                    </p>
                    <input
                        type="text"
                        id='member'
                        value={member}
                        onChange={handleMemberChange}
                        onKeyUp={handleShow}
                    />
                </div>
                <ul className="group-input__list" style={{ display: isShowList ? 'block' : 'none' }}>
                    <li>kyb2005802@student.ctu.edu.vn</li>
                </ul>
            </div>
            <Flex gap='middle' align='flex-end'>
                <div className="group-input">
                    <label htmlFor="date">Date</label>
                    <RangePicker
                        disabledDate={disabledDate}
                        disabledTime={disabledRangeTime}
                        showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [dayjs('00:00:00', TIMEFORMAT), dayjs('11:59:59', TIMEFORMAT)],
                        }}
                        format={DATEFORMATFULL}
                        onChange={(date, dateString) => {
                            console.log(date, dateString);
                        }}
                    />
                </div>
                <div className="group-input">
                    <Radio.Group
                        defaultValue={mark}
                        buttonStyle="solid"
                        style={{ display: 'flex' }}
                        onChange={handleMarkChange}>
                        <Radio.Button value="low">Low</Radio.Button>
                        <Radio.Button value="normal">Normal</Radio.Button>
                        <Radio.Button value="high">High</Radio.Button>
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