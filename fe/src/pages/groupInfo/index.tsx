import { useNavigate, useParams } from 'react-router-dom';
import './groupInfo.scss'
import GroupInfoService from '~/services/groupInfo';
import { useLoadingContext } from '~/utils/loadingContext';
import { useEffect, useState } from 'react';
import { GroupInfoItem, Members } from '~/types/dataType';
import GroupService from '~/services/group'
import { convertDate, DATEFORMATFULL } from '~/utils/const';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Input, message, Modal, Popconfirm } from 'antd';
import type { PopconfirmProps } from 'antd';
import { userInfoSelector } from '~/store/selectors';
import { useSelector } from 'react-redux';

const GroupInfo = () => {
    const { id } = useParams();
    const { setIsLoading } = useLoadingContext();
    const [groupInfoData, setGroupInfoData] = useState<GroupInfoItem>()
    const [adminGroup, setAdminGroup] = useState<Members>()
    const [messageApi, contextHolder] = message.useMessage();
    const userInfo = useSelector(userInfoSelector)
    const [groupName, setGroupName] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const getDataInfo = async () => {
        setIsLoading(true)
        try {
            if (id) {
                const res = await GroupInfoService.getOne(id)
                if (res?.errorCode === 0 && !Array.isArray(res?.data)) {
                    document.title = res.data?.group.groupName as string
                    setAdminGroup(res.data?.members?.find((item) => item.admin))
                    setGroupName(res.data?.group.groupName as string)
                    setGroupInfoData(res.data)
                }
            }
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        (async () => {
            await getDataInfo()
        })()
    }, [])

    const deleteGroup = async () => {
        try {
            const res = await GroupService.delete(groupInfoData?.group._id as String)
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
                    content: 'delete failed',
                    duration: 2,
                });
            }
        } catch (e) {
            messageApi.open({
                key: 'updatable',
                type: 'error',
                content: 'delete failed',
                duration: 2,
            });
        }
    }

    const updateGroup = async () => {
        try {
            const res = await GroupService.update({
                _id: groupInfoData?.group._id as String,
                groupName
            })
            if (res?.errorCode === 0) {
                await getDataInfo()
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
                    content: 'update failed',
                    duration: 2,
                });
            }
        } catch (e) {
            messageApi.open({
                key: 'updatable',
                type: 'error',
                content: 'update failed',
                duration: 2,
            });
        }
    }

    const deleteMember = async (id: String) => {
        try {
            await GroupInfoService.delete({
                groupId: groupInfoData?.group._id as String,
                userId: id
            })
        } catch (e) {
            console.log(e)
        }
    }

    const confirmDeleteGroup: PopconfirmProps['onConfirm'] = async () => {
        if (groupInfoData?.members) {
            for (const member of groupInfoData?.members) {
                await deleteMember(member.user._id as String)
            }
        }
        await deleteGroup()
        navigate('/group')
    };

    const showModal = () => {
        setIsModalOpen(true);
        setGroupName(groupInfoData?.group.groupName as string)
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        await updateGroup()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setGroupName(groupInfoData?.group.groupName as string)
    };

    const handleGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupName(e.target.value)
    }

    return (
        <div className='group-info'>
            {contextHolder}
            <div className="group-info__box">
                <h2 className="group-info__title">
                    {groupInfoData?.group?.groupName}
                </h2>
                <div className="group-info__space">
                    <span>
                        {convertDate(groupInfoData?.group?.groupCreateAt as String, DATEFORMATFULL)}
                    </span>
                    <span>
                        {adminGroup?.user.userName}
                    </span>
                </div>
                <div className="group-info__members">
                    Members: {
                        groupInfoData?.members?.map((member, i) => (
                            member.status && <span key={i}>{member?.user.userName}</span>
                        ))
                    }
                </div>
                <div className="group-info__members group-info__members--others">
                    Others: {
                        groupInfoData?.members?.map((member, i) => (
                            !member.status && <span key={i}>{member?.user.userName}</span>
                        ))
                    }
                </div>
                {
                    userInfo._id === adminGroup?.user._id
                    && <div className="group-info__actions">
                        <button
                            className="group-info__actions--edit"
                            onClick={showModal}
                        >
                            <EditOutlined />
                        </button>
                        <Popconfirm
                            title="Delete Group"
                            description="Are you sure to delete this group?"
                            onConfirm={confirmDeleteGroup}
                            okText="Yes"
                            cancelText="No"
                        >

                            <button className="group-info__actions--delete">
                                <DeleteOutlined />
                            </button>
                        </Popconfirm>
                    </div>
                }
            </div>
            <Modal title="Update Group" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="group-info__modal">
                    <label htmlFor="groupName">Group Name</label>
                    <Input
                        id='groupName'
                        value={groupName}
                        onChange={handleGroupName}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default GroupInfo