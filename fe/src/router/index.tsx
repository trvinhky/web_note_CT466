import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '~/layouts/DefaultLayout'
import FormLayout from '~/layouts/FormLayout'
import Admin from '~/pages/admin'
import CreateEvent from '~/pages/createEvent'
import EventList from '~/pages/eventList'
import Login from '~/pages/form/login'
import Register from '~/pages/form/register'
import Home from '~/pages/home'
import User from '~/pages/user'

const RouteApp = () => {
    return (
        <Routes>
            <Route path='/' element={<DefaultLayout />}>
                <Route index element={<Home />} />
                <Route path='/create-event' element={<CreateEvent />} />
                <Route path='/event-list' element={<EventList />} />
                <Route path='/info' element={<User />} />
                <Route path='/admin' element={<Admin />} />
            </Route>
            <Route path='/' element={<FormLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Route>
        </Routes>
    )
}

export default RouteApp