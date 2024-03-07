import React, { useState } from 'react';
import './form.scss';
import { Link } from 'react-router-dom';
import { isValidEmail } from '~/utils/validation';
import { UserData } from '~/types/dataType';
import User from '~/services/user'

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValidEmail(email)) {
            console.log('Email:', email);
        }
        console.log('Password:', password);

        try {
            const user: UserData = {
                userEmail: email,
                userPassword: password,
            }
            const res = await User.signIn(user)
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
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
                <Link to='/register'>Sign Up</Link>
            </div>
        </form>
    );
}

export default Login;
