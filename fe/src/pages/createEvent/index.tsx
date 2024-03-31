import { useEffect } from "react"
import EventForm from "~/components/EventForm"

const CreateEvent = () => {
    useEffect(() => {
        document.title = 'Create New Event'
    }, [])

    return (
        <EventForm />
    )
}

export default CreateEvent