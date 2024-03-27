import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import DefaultLayout from '~/layouts/DefaultLayout'
import FormLayout from '~/layouts/FormLayout'
import Admin from '~/pages/admin'
import CreateEvent from '~/pages/createEvent'
import Detail from '~/pages/detail'
import EventList from '~/pages/eventList'
import Form from '~/pages/form'
import Home from '~/pages/home'
import User from '~/pages/user'
import { userIsLoginSelector } from '~/store/selectors'

const RouteApp = () => {
    const navigate = useNavigate();
    const isLogin = useSelector(userIsLoginSelector)

    useEffect(() => {
        if (!isLogin) {
            navigate("/form")
        }
    }, [isLogin])

    return (
        <Routes>
            <Route path='/' element={<DefaultLayout />}>
                <Route index element={<Home />} />
                {/* <Route path='/create-event' element={<CreateEvent />} /> */}
                <Route path='/event-list' element={<EventList />} />
                <Route path='/info' element={<User />} />
                <Route path='/admin' element={<Admin />} />
                {/* <Route path='/detail/:id' element={<Detail />} /> */}
            </Route>
            <Route path='/form' element={<FormLayout />}>
                <Route index element={<Form />} />
            </Route>
        </Routes>
    )
}

export default RouteApp