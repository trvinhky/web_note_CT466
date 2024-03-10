import { useState } from "react"
import Login from "./login"
import Register from "./register"

export type ToggleLoginFunction = () => void;

const Form = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true)

    return (
        <>
            {
                isLogin ? <Login ToggleLogin={() => setIsLogin(false)} /> : <Register ToggleLogin={() => setIsLogin(true)} />
            }
        </>
    )
}

export default Form