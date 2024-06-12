import { useContext} from "react"
import {useNavigate,} from "react-router-dom";
import { userContext } from "../components/PrivateRoute"

export const HomePage = () => {
    const navigate = useNavigate();
    const {userData, forceUpdate} = useContext(userContext);
    
    function goToGames(){
        navigate('/games');
    }
    return <div>
        <p>this is the home page of {userData.user}</p>
        <button onClick={goToGames}>go to games screen</button>
    </div>
}