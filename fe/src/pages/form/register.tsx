import { Link } from "react-router-dom";
import './form.scss'
import { useState } from "react";
import { isValidEmail, isValidPassword, isValidPhoneVN, isValidText } from "~/utils/validation";
import User from '~/services/user'
import { UserData } from '~/types/dataType';

const Register = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [isOK, setIsOK] = useState<boolean>(true)

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            console.log('Email:', email);
            setIsOK(false)
        }

        if (!isValidText(userName)) {
            console.log('userName:', userName);
            setIsOK(false)
        }

        if (!isValidPhoneVN(phone)) {
            console.log('Phone:', phone);
            setIsOK(false)
        }

        if (!isValidPassword(password)) {
            console.log('Password:', password);
            setIsOK(false)
        }

        if (!isValidText(address)) {
            console.log('Address:', address);
            setIsOK(false)
        }

        if (isOK) {
            try {
                const user: UserData = {
                    userName,
                    userEmail: email,
                    userAddress: address,
                    userPassword: password,
                    userPhone: phone
                }
                const res = await User.signUp(user)
                console.log(res)
            } catch (e) {
                console.log(e)
            }
        }
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
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
                type="text"
                className="form-input"
                required
                placeholder='Phone'
                value={phone}
                onChange={handlePhoneChange}
            />
            <input
                type="password"
                className="form-input"
                required
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
            />
            <input
                type="text"
                className="form-input"
                required
                placeholder='Address'
                value={address}
                onChange={handleAddressChange}
            />
            <div className="center">
                <button type="submit">Sign Up</button>
            </div>
            <div className="form-group">
                <span></span>
                <Link to='/login'>Sign In</Link>
            </div>
        </form>
    );
}

export default Register;