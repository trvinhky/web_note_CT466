import { useEffect, useState } from 'react';
import './user.scss'
import { isValidPhoneVN, isValidText } from '~/utils/validation';
import { UserData } from '~/types/dataType';
import { useDispatch, useSelector } from 'react-redux';
import { userInfoSelector } from '~/store/selectors';
import { message } from 'antd';
import UserService from '~/services/user'
import { actions } from '~/store/usersSlice';

const User = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const userInfo = useSelector(userInfoSelector)
    const [phone, setPhone] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            setUserName(userInfo.userName as string);
            setAddress(userInfo.userAddress as string);
            setPhone(userInfo.userPhone as string);
        }
    }, [userInfo])

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isFormValid = true;
        if (!isValidPhoneVN(phone)) {
            console.log('Phone:', phone);
            isFormValid = false;
        }

        if (!isValidText(userName)) {
            console.log('User Name:', userName);
            isFormValid = false;
        }

        if (!isValidText(address)) {
            console.log('Address:', address);
            isFormValid = false;
        }

        if (isFormValid && userInfo.id) {
            messageApi.open({
                key: 'updatable',
                type: 'loading',
                content: 'Loading...',
            });
            try {
                const user: UserData = {
                    userName,
                    userAddress: address,
                    userPhone: phone
                }
                const res = await UserService.update(userInfo.id, user)
                if (res.errorCode === 0 && res.data && !Array.isArray(res.data)) {
                    messageApi.open({
                        key: 'updatable',
                        type: 'success',
                        content: res.message,
                        duration: 2,
                    });
                    dispatch(actions.setInfo(res.data))
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
                    content: 'Update failed',
                    duration: 2,
                });
            }
        }
    };

    return (
        <div className='user'>
            {contextHolder}
            <h1 className="user-title">
                User Info
            </h1>
            <div className="user-info">
                <div className="user-info__group">
                    <p><span>User Name:</span> {userInfo && userInfo.userName}</p>
                    <p><span>Phone:</span> {userInfo && userInfo.userPhone}</p>
                </div>
                <div className="user-info__group">
                    <p><span>Email:</span> {userInfo && userInfo.userEmail}</p>
                    <p><span>Role:</span> {userInfo && userInfo.userRole}</p>
                </div>
                <div className="user-info__group">
                    <p><span>Address:</span> {userInfo && userInfo.userAddress}</p>
                </div>
            </div>
            <h2 className="user-edit">
                Update Info
            </h2>
            <form className='user-form' onSubmit={handleSubmit}>
                <div className="user-form__group">
                    <div className="user-group">
                        <label htmlFor="userName" className="user-group__title">
                            User Name
                        </label>
                        <input
                            type="text"
                            id='userName'
                            className="user-group__input"
                            value={userName}
                            onChange={handleUserNameChange}
                        />
                    </div>
                    <div className="user-group">
                        <label htmlFor="phone" className="user-group__title">
                            Phone
                        </label>
                        <input
                            type="text"
                            id='phone'
                            className="user-group__input"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                </div>
                <div className="user-group">
                    <label htmlFor="address" className="user-group__title">
                        Address
                    </label>
                    <input
                        type="text"
                        id='address'
                        className="user-group__input"
                        value={address}
                        onChange={handleAddressChange}
                    />
                </div>
                <div className="user-form__right">
                    <button className="user-form__btn" type='submit'>
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}

export default User;