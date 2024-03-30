import { Outlet } from "react-router-dom";
import '~/assets/scss/default.scss'
import Header from "~/components/Header";


const DefaultLayout = () => {
    return (
        <>
            <header className="center">
                <div className="container">
                    <Header />
                </div>
            </header>
            <main className="center default">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default DefaultLayout