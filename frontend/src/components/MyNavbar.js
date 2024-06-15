import { Button } from './ui/button';
import styles from "../app/globals.css"
import {useNavigate} from "react-router-dom";
import {logo} from "../Images/logo.png"


const myNavItems = ['Home', 'Games'];


export default function MyNav() {
    const navigate = useNavigate();
  return (
    <div className="mr-4 gap-2 flex bg-black text-yellow-400">
        <img
            src={logo}
            alt='logo'
        ></img>
      {myNavItems.map((item, index) => (
        <Button key={index} variant="link" onClick={navigate("/" + item.toString().toLowerCase())}>
          {item}
        </Button>
      ))}
    </div>
  );
}