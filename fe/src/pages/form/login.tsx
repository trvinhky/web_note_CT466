import React, { useState } from 'react';
import './form.scss';
import { UserData } from '~/types/dataType';
import User from '~/services/user'
import { ToggleLoginFunction } from './index';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { actions } from '~/components/usersSlice';
import { useNavigate } from 'react-router-dom';

const Login = ({ ToggleLogin }: { ToggleLogin: ToggleLoginFunction }) => {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
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
        <form className='form' onSubmit={handleSubmit}>
            {contextHolder}
            <h2 className="form-title">Sign In</h2>
            <input
                type="email"
                className="form-input"
                required
                placeholder='Email'
                value={email}
                onChange={handleEmailChange}
            />
            <input
                type="password"
                className="form-input"
                required
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
            />
            <div className="center">
                <button type="submit">Sign In</button>
            </div>
            <div className="form-group">
                <span className="form-group__text">Forgot your password?</span>
                <span onClick={ToggleLogin} className='form-group__link'>Sign Up</span>
            </div>
        </form>
    );
}

export default Login;
