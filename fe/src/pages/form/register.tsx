import './form.scss'
import { useState } from "react";
import { isValidEmail, isValidPassword, isValidText } from "~/utils/validation";
import User from '~/services/user'
import { UserData } from '~/types/dataType';
import { ToggleLoginFunction } from './index';
import { message } from 'antd';

const Register = ({ ToggleLogin }: { ToggleLogin: ToggleLoginFunction }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userName, setUserName] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const resetValue = () => {
        setEmail('')
        setPassword('')
        setUserName('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isFormValid = true;

        if (!isValidEmail(email)) {
            console.log('Email:', email);
            isFormValid = false;
        }

        if (!isValidText(userName)) {
            console.log('userName:', userName);
            isFormValid = false;
        }

        if (!isValidPassword(password)) {
            console.log('Password:', password);
            isFormValid = false;
        }

        if (isFormValid) {
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
                if (res.errorCode === 0) {
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
                    content: 'Sign Up failed',
                    duration: 2,
                });
            }
        }
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
            {contextHolder}
            <h2 className="form-title">Sign Up</h2>
            <input
                type="email"
                className="form-input"
                required
                placeholder='Email'
                value={email}
                onChange={handleEmailChange}
            />
            <input
                type="text"
                className="form-input"
                required
                placeholder='User Name'
                value={userName}
                onChange={handleUserNameChange}
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
                <button type="submit">Sign Up</button>
            </div>
            <div className="form-group">
                <span></span>
                <span onClick={ToggleLogin} className='form-group__link'>Sign In</span>
            </div>
        </form>
    );
}

export default Register;