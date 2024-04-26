import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Loading from '~/components/Loading'
import DefaultLayout from '~/layouts/DefaultLayout'
import FormLayout from '~/layouts/FormLayout'
import CreateEvent from '~/pages/createEvent'
import Detail from '~/pages/detail'
import EditEvent from '~/pages/editEvent'
import EventList from '~/pages/eventList'
import Form from '~/pages/form'
import Group from '~/pages/group'
import Home from '~/pages/home'
import { userInfoSelector, userIsLoginSelector } from '~/store/selectors'
import { useLoadingContext } from '~/utils/loadingContext'
import GroupInfo from '~/pages/groupInfo';
import { getIdFromCookie } from '~/utils/cookieActions'
import User from '~/services/user'
import { actions } from '~/store/usersSlice';
import { actions as actionsGroup } from '~/store/groupsSlice';
import GroupService from '~/services/group'

const RouteApp = () => {
    const navigate = useNavigate();
    const isLogin = useSelector(userIsLoginSelector)
    const dispatch = useDispatch();
    const { isLoading, setIsLoading } = useLoadingContext();
    const userInfo = useSelector(userInfoSelector)

    const handleTryLogin = async (id: String) => {
        setIsLoading(true)
        try {
            const res = await User.getInfo(id)
            if (res?.errorCode === 0 && !Array.isArray(res?.data)) {
                dispatch(actions.LoginAccount(res.data))
            }
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const setGroup = async () => {
        try {
            if (userInfo?.userName) {
                const resGroup = await GroupService.getOne(userInfo?.userName as String)
                if (resGroup?.errorCode === 0) {
                    dispatch(actionsGroup.setGroup(resGroup.data))
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!isLogin) {
            const userId = getIdFromCookie('user_id')
            if (userId) {
                (async () => {
                    await handleTryLogin(userId)
                    await setGroup()
                })()
            } else {
                navigate("/form")
            }
        }
    }, [isLogin])

    return (
        <>
            <Routes>
                <Route path='/' element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path='/create-event' element={<CreateEvent />} />
                    <Route path='/group' element={<Group />} />
                    <Route path='/group/:id' element={<GroupInfo />} />
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