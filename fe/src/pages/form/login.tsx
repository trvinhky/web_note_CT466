import React, { useState } from 'react';
import './form.scss';
import { UserData } from '~/types/dataType';
import User from '~/services/user'
import { ToggleLoginFunction } from './index';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { actions } from '~/store/usersSlice';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import signInImage from '~/assets/images/signin-image.jpg'
import { ErrorLabel } from '~/types/global';
import { isValidEmail, isValidPassword } from '~/utils/validation';

const Login = ({ ToggleLogin }: { ToggleLogin: ToggleLoginFunction }) => {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<ErrorLabel>({})
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const resetValue = () => {
        setEmail('')
        setPassword('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isFormValid = true

        if (!isValidEmail(email)) {
            setError((prev) => ({ ...prev, email: 'Invalid email' as String }))
            isFormValid = false
        }

        if (!isValidPassword(password)) {
            setError((prev) => ({ ...prev, password: 'Invalid password' as String }))
            isFormValid = false
        }

        if (!isFormValid) return

        try {
            messageApi.open({
                key: 'updatable',
                type: 'loading',
                content: 'Loading...',
            });
            const user: UserData = {
                userEmail: email,
                userPassword: password,
            }
            const res = await User.signIn(user)
            if (res.errorCode === 0) {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: res.message,
                    duration: 2,
                });
                resetValue()
                dispatch(actions.LoginAccount(res.data))
                navigate("/")

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
                content: 'Sign In failed',
                duration: 2,
            });
        }
    };

    return (
        <div className="form">
            {contextHolder}
            <div className="form-right">
                <img src={signInImage} alt="" />
                <span onClick={ToggleLogin}>Create an account</span>
            </div>
            <form className='form-content' onSubmit={handleSubmit}>
                <h2 className="form-title">Sign In</h2>
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
                <div className="form-check">
                    <input type="checkbox" name="check" checked />
                    <label htmlFor="check">Remember me</label>
                </div>

                <button type="submit" className='form-btn'>Log In</button>
            </form>
        </div>
    );
}

export default Login;
