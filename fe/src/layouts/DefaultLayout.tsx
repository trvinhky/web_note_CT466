import { Outlet } from "react-router-dom";
import '~/assets/scss/default.scss'
import Header from "~/components/Header";


const DefaultLayout = () => {
    return (
        <>
            <header className="center" style={{ backgroundColor: '#2c3e50' }}>
                <div className="container" style={{ overflow: 'unset' }}>
                    <Header />
                </div>
            </header>
            <main className="center default" style={{ marginTop: '20px' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default DefaultLayout