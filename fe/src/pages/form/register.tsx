import './form.scss'
import { useState } from "react";
import { isValidEmail, isValidPassword, isValidText } from "~/utils/validation";
import User from '~/services/user'
import Group from '~/services/group'
import GroupInfo from '~/services/groupInfo'
import { UserData } from '~/types/dataType';
import { ToggleLoginFunction } from './index';
import { message } from 'antd';
import signUpImage from '~/assets/images/signup-image.jpg'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { ErrorLabel } from '~/types/global';

const Register = ({ ToggleLogin }: { ToggleLogin: ToggleLoginFunction }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [error, setError] = useState<ErrorLabel>({})

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(e.target.value);
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const resetValue = () => {
        setEmail('')
        setPassword('')
        setUserName('')
        setPasswordConfirm('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isFormValid = true

        if (!isValidText(userName)) {
            setError((prev) => ({ ...prev, userName: 'Invalid user name' as String }))
            isFormValid = false
        }
        if (!isValidEmail(email)) {
            setError((prev) => ({ ...prev, email: 'Invalid email' as String }))
            isFormValid = false
        }

        if (!isValidPassword(password)) {
            setError((prev) => ({ ...prev, password: 'Invalid password' as String }))
            isFormValid = false
        }

        if (!passwordConfirm || password !== passwordConfirm) {
            setError((prev) => ({ ...prev, passwordConfirm: 'Password incorrect' as String }))
            isFormValid = false
        }

        if (!isFormValid) return

        messageApi.open({
            key: 'updatable',
            type: 'loading',
            content: 'Loading...',
        });
        try {
            const user: UserData = {
                userName,
                userEmail: email,
                userPassword: password,
            }
            const res = await User.signUp(user)
            const resGroup = await Group.create({ groupName: userName })
            if (res?.errorCode === 0 && resGroup?.errorCode === 0) {
                if (!Array.isArray(res.data) && !Array.isArray(resGroup.data)) {
                    const userData = res.data
                    const groupData = resGroup.data
                    const resInfo = await GroupInfo.create({
                        userId: userData?._id as String,
                        groupId: groupData?._id as String
                    })

                    if (resInfo?.errorCode === 0) {
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
                }
                resetValue()
            } else {
                messageApi.open({
                    key: 'updatable',
                    type: 'error',
                    content: res.message,
                    duration: 2,
                });
            }
            setError({})
        } catch (e) {
            console.log(e)
            messageApi.open({
                key: 'updatable',
                type: 'error',
                content: 'Sign Up failed',
                duration: 2,
            });
        }
    };

    return (
        <div className="form">
            {contextHolder}
            <form className='form-content' onSubmit={handleSubmit}>
                <h2 className="form-title">Sign Up</h2>
                <div className="form-group">
                    <div className="form-group__input">
                        <label htmlFor='name' className='form-icon'>
                            <UserOutlined />
                        </label>
                        <input
                            type="text"
                            placeholder='Your name'
                            id="name"
                            value={userName}
                            onChange={handleUserNameChange}
                        />
                    </div>
                    {error?.userName &&
                        <small className="form-group__error">
                            {error.userName}
                        </small>
                    }
                </div>
                <div className="form-group">
                    <div className="form-group__input">
                        <label htmlFor='email' className='form-icon'>
                            <MailOutlined />
                        </label>
                        <input
                            type="email"
                            placeholder='Your email'
                            id='email'
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    {error?.email &&
                        <small className="form-group__error">
                            {error.email}
                        </small>
                    }
                </div>
                <div className="form-group">
                    <div className="form-group__input">
                        <label htmlFor='password' className='form-icon'>
                            <LockOutlined />
                        </label>
                        <input
                            type="password"
                            placeholder='Password'
                            id='password'
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    {error?.password &&
                        <small className="form-group__error">
                            {error.password}
                        </small>
                    }
                </div>
                <div className="form-group">
                    <div className="form-group__input">
                        <label htmlFor='password-confirm' className='form-icon'>
                            <LockOutlined />
                        </label>
                        <input
                            type="password"
                            placeholder='Repeat your password'
                            id='password-confirm'
                            value={passwordConfirm}
                            onChange={handlePasswordConfirmChange}
                        />
                    </div>
                    {error?.passwordConfirm &&
                        <small className="form-group__error">
                            {error.passwordConfirm}
                        </small>
                    }
                </div>
                <div className="form-check">
                    <input type="checkbox" name="check" checked readOnly />
                    <label htmlFor="check">I agree all statements in <span>Terms of service</span></label>
                </div>

                <button type="submit" className='form-btn'>Register</button>
            </form>
            <div className="form-right">
                <img src={signUpImage} alt="" />
                <span onClick={ToggleLogin}>I am already member</span>
            </div>
        </div>
    );
}

export default Register;