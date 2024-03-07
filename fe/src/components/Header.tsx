import '~/assets/scss/header.scss'
import Logo from './Logo'
import { useState } from 'react';
import { Drawer } from 'antd';
import { BellFilled, HistoryOutlined } from '@ant-design/icons';

const Header = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div className='header'>
            <div className="header-logo">
                <Logo />
            </div>
            <span className='header-report' onClick={showDrawer}>
                <BellFilled style={{ fontSize: '1.4rem' }} />
            </span>
            <Drawer title="Notification" onClose={onClose} open={open}>
                <ul className="header-list">
                    <li className="header-list__item">
                        <h5>bao cao nien luan</h5>
                        <span className="mark mark--normal">
                            Normal
                        </span>
                        <span className="time"><HistoryOutlined />7 hours left</span>
                    </li>
                </ul>
            </Drawer>
        </div>
    )
}

export default Header