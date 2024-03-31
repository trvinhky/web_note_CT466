import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EventForm from "~/components/EventForm"
import Work from "~/services/work";
import { WorkData } from "~/types/dataType";
import { useLoadingContext } from "~/utils/loadingContext";

const EditEvent = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId');
    const workDateEnd = searchParams.get('workDateEnd');
    const [data, setData] = useState<WorkData>()
    const { setIsLoading } = useLoadingContext();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            try {
                if (userId && workDateEnd) {
                    const res = await Work.getInfo(userId, workDateEnd)
                    if (res.errorCode === 0 && !Array.isArray(res.data)) {
                        const workInfo = res.data
                        setData({
                            _id: workInfo?._id,
                            workTitle: workInfo?.workTitle,
                            workDescription: workInfo?.workDescription,
                            workDateStart: workInfo?.workDateStart,
                            workDateEnd: workInfo?.workDateEnd,
                            workStatus: workInfo?.workStatus,
                            userId: workInfo?.userId?._id
                        })
                    }
                } else navigate('/')
            } catch (e) {
                console.log(e)
            }
            setIsLoading(false)
        })()
    }, [userId, workDateEnd])

    return (
        <EventForm isEdit={true} data={data} />
    )
}

export default EditEvent