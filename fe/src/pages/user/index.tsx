import { useState } from 'react';
import './user.scss'
import { isValidPhoneVN, isValidText } from '~/utils/validation';

const User = () => {
    const [phone, setPhone] = useState<string>('0947468740');
    const [userName, setUserName] = useState<string>('Peter');
    const [address, setAddress] = useState<string>('peter123@gmail.com');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValidPhoneVN(phone)) {
            console.log('Phone:', phone);
        }

        if (isValidText(userName)) {
            console.log('User Name:', userName);
        }

        if (isValidText(address)) {
            console.log('Address:', address);
        }
    };

    return (
        <div className='user'>
            <h1 className="user-title">
                User Info
            </h1>
            <div className="user-info">
                <div className="user-info__group">
                    <p><span>User Name:</span> Peter</p>
                    <p><span>Phone:</span> 0947468740</p>
                </div>
                <div className="user-info__group">
                    <p><span>Email:</span> peter123@gmail.com</p>
                    <p><span>Role:</span> user</p>
                </div>
                <div className="user-info__group">
                    <p><span>Address:</span> peter123@gmail.com</p>
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
                    <button className="user-form__btn">
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}

export default User;