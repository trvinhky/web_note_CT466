import { Outlet } from "react-router-dom";
import '~/assets/scss/form.scss'
import Logo from "~/components/Logo";


const FormLayout = () => {
    return (
        <>
            <header className="center header" style={{ backgroundColor: '#2c3e50' }}>
                <div className="container">
                    <Logo />
                </div>
            </header>
            <main className="center">
                <div className="container">
                    <div className="center">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    )
}

export default FormLayout