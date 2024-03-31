import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Loading from '~/components/Loading'
import DefaultLayout from '~/layouts/DefaultLayout'
import FormLayout from '~/layouts/FormLayout'
import CreateEvent from '~/pages/createEvent'
import Detail from '~/pages/detail'
import EditEvent from '~/pages/editEvent'
import EventList from '~/pages/eventList'
import Form from '~/pages/form'
import Home from '~/pages/home'
import { userIsLoginSelector } from '~/store/selectors'
import { useLoadingContext } from '~/utils/loadingContext'

const RouteApp = () => {
    const navigate = useNavigate();
    const isLogin = useSelector(userIsLoginSelector)

    const { isLoading } = useLoadingContext();

    useEffect(() => {
        if (!isLogin) {
            navigate("/form")
        }
    }, [isLogin])

    return (
        <>
            <Routes>
                <Route path='/' element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path='/create-event' element={<CreateEvent />} />
                    <Route path='/event-list' element={<EventList />} />
                    <Route path='/edit' element={<EditEvent />} />
                    <Route path='/detail' element={<Detail />} />
                </Route>
                <Route path='/form' element={<FormLayout />}>
                    <Route index element={<Form />} />
                </Route>
            </Routes>
            {isLoading && <Loading />}
        </>
    )
}

export default RouteApp