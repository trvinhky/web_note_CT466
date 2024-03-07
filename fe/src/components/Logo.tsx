import { HighlightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import '~/assets/scss/logo.scss'

const Logo = () => {
    return (
        <Link to='/'>
            <span className='logo'>
                Note
                <HighlightOutlined />
            </span>
        </Link>
    )
}

export default Logo