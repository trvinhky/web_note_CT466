import { useEffect, useState } from "react"
import Login from "./login"
import Register from "./register"

export type ToggleLoginFunction = () => void;

const Form = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true)

    useEffect(() => {
        if (isLogin) {
            document.title = 'Sign In'
        } else {
            document.title = 'Sign Up'
        }
    }, [isLogin])

    return (
        <>
            {
                isLogin ? <Login ToggleLogin={() => setIsLogin(false)} /> : <Register ToggleLogin={() => setIsLogin(true)} />
            }
        </>
    )
}

export default Form