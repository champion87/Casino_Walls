import { useContext } from "react"
import { userContext } from "./PrivateRoute"

export const HomePage = () => {
    const {user} = useContext(userContext);
    return <div>
        this is the home page of {user.name}
    </div>
}