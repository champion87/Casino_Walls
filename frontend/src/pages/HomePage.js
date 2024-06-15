import { useContext} from "react"
import {useNavigate,} from "react-router-dom";
import { userContext } from "../components/PrivateRoute"
import { Button } from '../components/ui/button';

export const HomePage = () => {
    const navigate = useNavigate();
    const {userData, forceUpdate} = useContext(userContext);
    
    function goToGames(){
        navigate('/games');
    }
    return (
    <div>
      <div className="bg-[#690d0d] h-screen items-center p-10">
          <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
            <div className="my-4">
              <h1 className="text-3xl font-bold text-yellow-400">this is the home page of {userData.user}</h1>
            </div>
            <Button
              type="button"
              onClick={goToGames}
              className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
            >
              go to games screen
            </Button>
          </div>
        </div>
    </div>
    );
}