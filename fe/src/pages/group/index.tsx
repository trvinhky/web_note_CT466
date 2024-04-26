import { PlusOutlined, UserAddOutlined } from '@ant-design/icons'
import './group.scss'
import { useEffect, useMemo, useState } from 'react';
import { Col, Input, message, Modal, Row } from 'antd';
import User from '~/services/user';
import GroupService from '~/services/group'
import GroupInfo from '~/services/groupInfo'
import { GroupInfoData, GroupInfoDataItem } from '~/types/dataType';
import { useLoadingContext } from '~/utils/loadingContext';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface Option {
    value: string;
    id: string;
}

const Group = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [options, setOptions] = useState<Option[]>([])
    const [members, setMembers] = useState<Option[]>([])
    const [searchMember, setSearchMember] = useState<string>('')
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [groupName, setGroupName] = useState<string>('')
    const [isCreate, setIsCreate] = useState<boolean>(true)
    const { setIsLoading } = useLoadingContext();
    const userInfo = useSelector(userInfoSelector)
    const [groups, setGroups] = useState<GroupInfoDataItem[]>([])
    const [groupId, setGroupId] = useState<String>('')

    const getListGroupData = async () => {
        setIsLoading(true)
        try {
            const res = await GroupInfo.getByUser(
                userInfo._id as String,
                true
            )
            let results: GroupInfoDataItem[] = []
            if (res?.errorCode === 0 && Array.isArray(res?.data)) {
                res.data.forEach((data) => {
                    if (data.groupId?.groupName !== userInfo.userName) {
                        results = [...results, data]
                    }
                })
            }
            setGroups(results)
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        document.title = 'Groups';
        (async () => {
            await getListGroupData()
        })()
    }, [])

    const addMember = async (data: GroupInfoData) => {
        try {
            messageApi.open({
                key: 'updatable',
                type: 'loading',
                content: 'Loading...',
            });

            const res = await GroupInfo.addMember(data)
            if (res?.errorCode !== 0) {
                await getListGroupData()
                messageApi.open({
                    key: 'updatable',
                    type: 'error',
                    content: 'add Member failed',
                    duration: 2,
                });
            } else {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
            }
        } catch (e) {
            messageApi.open({
                key: 'updatable',
                type: 'error',
                content: 'add Member failed',
                duration: 2,
            });
        }
    }

    const createGroup = async () => {
        try {
            if (groupName) {
                messageApi.open({
                    key: 'updatable',
                    type: 'loading',
                    content: 'Loading...',
                });

                const res = await GroupService.create({ groupName: groupName })
                if (res?.errorCode === 0 && !Array.isArray(res?.data)) {
                    const groupData = res.data
                    const resInfo = await GroupInfo.create({
                        userId: userInfo._id as String,
                        groupId: groupData?._id as String
                    })
                    if (resInfo.errorCode === 0) {
                        await getListGroupData()
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
                            content: resInfo.message,
                            duration: 2,
                        });
                    }
                } else {
                    messageApi.open({
                        key: 'updatable',
                        type: 'error',
                        content: 'create failed',
                        duration: 2,
                    });
                }
            }
        } catch (e) {
            messageApi.open({
                key: 'updatable',
                type: 'error',
                content: 'create failed',
                duration: 2,
            });
        }
    }

    const loopAddMember = async () => {
        if (groupId && members.length > 0) {
            for (const member of members) {
                await addMember({
                    groupId: groupId as String,
                    userId: member.id
                })
            }
        }
    }

    const handleOk = async () => {
        if (isCreate) {
            await createGroup()
        } else {
            await loopAddMember()
        }
        setGroupName('')
        setMembers([])
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setGroupName('')
        setMembers([])
    };

    const handleSearchMember = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchMember(e.target.value)
        setShowSearch(true)
    }

    const handleGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupName(e.target.value)
    }

    useMemo(() => {
        if (searchMember) {
            const timerId = setTimeout(async () => {
                await getMembers(searchMember);
            }, 3000);

            return () => clearTimeout(timerId);
        }
    }, [searchMember]);

    const getMembers = async (email: String) => {
        try {
            const res = await User.search(email)
            let membersData: Option[] = []
            if (res?.errorCode === 0 && Array.isArray(res?.data)) {
                const dataResult = res.data
                let data = dataResult.filter(item => !members.some(member => member.id === item._id))
                data = data.filter(item => item._id !== userInfo._id)
                data.forEach((val) => {
                    const option: Option = {
                        value: val.userEmail as string,
                        id: val._id as string
                    }
                    membersData = [...membersData, option]
                })
                setOptions(membersData)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleDeleteMember = (id: string) => {
        setMembers(
            members.filter((member) => member.id !== id)
        )
    }

    const handleAddMember = (member: Option) => {
        setMembers((prev) => [...prev, member])
        setShowSearch(false)
        setOptions([])
        setSearchMember('')
    }

    const handleCreateForm = () => {
        setIsCreate(true)
        setIsModalOpen(true);
    }

    const handleEditGroup = (id: String) => {
        setGroupId(id)
        setIsCreate(false)
        setIsModalOpen(true);
    }

    return (
        <div className='group'>
            {contextHolder}
            <h2 className="group-title">
                Groups
            </h2>
            <div className="flex-right">
                <button className="group-btn" onClick={handleCreateForm}>
                    <PlusOutlined />
                </button>
            </div>
            <ul className="group-list">
                <Row gutter={[16, 16]}>
                    {
                        groups.length > 0 && groups.map((group) => (
                            group.groupId &&
                            <Col key={group._id as string} sm={12} xs={24} md={8}>
                                <li className="group-list__item">
                                    <Link to={`/group/${group.groupId._id}`} className="group-list__info">
                                        <span>Group Name:</span>
                                        <h4>{group.groupId.groupName}</h4>
                                    </Link>
                                    <div className="group-list__actions">
                                        {
                                            group.userId === userInfo._id
                                            && group.groupInfoAdmin
                                            &&
                                            <button
                                                className='group-list__actions--edit'
                                                onClick={() => handleEditGroup(group.groupId._id as String)}
                                            >
                                                <UserAddOutlined />
                                            </button>
                                        }
                                    </div>
                                </li>
                            </Col>
                        ))
                    }
                </Row>
            </ul>
            <Modal title={isCreate ? "Create Group" : "Add Members"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {
                    isCreate
                        ? <div className="group-create">
                            <label htmlFor="groupName">Group Name</label>
                            <Input
                                id='groupName'
                                value={groupName}
                                onChange={handleGroupName}
                            />
                        </div>
                        : <div className="group-create">
                            <label htmlFor="groupMember">Members</label>
                            <div className="group-create__input">
                                {
                                    members?.length > 0 &&
                                    members.map((member) => (
                                        <span key={member.id}>
                                            {member.value} <small onClick={() => handleDeleteMember(member.id)}></small>
                                        </span>
                                    ))
                                }
                                <input
                                    type="search"
                                    id="groupMember"
                                    value={searchMember}
                                    onChange={handleSearchMember}
                                />
                            </div>
                            {
                                showSearch &&
                                <ul className="group-create__list">
                                    {
                                        options?.length > 0
                                            ? options.map((option) => (
                                                <li
                                                    key={option.id}
                                                    onClick={() => handleAddMember(option)}
                                                >
                                                    {option.value}
                                                </li>
                                            ))
                                            : <li className='group-create__empty'>No Data</li>
                                    }
                                </ul>
                            }
                        </div>
                }
            </Modal>
        </div>
    )
}

export default Group