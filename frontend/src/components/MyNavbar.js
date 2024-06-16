import { Button } from './ui/button';
import styles from "../app/globals.css"
import {Link} from "react-router-dom";
import logo from "../Images/logo.png"


const myNavItems = ['Home', 'Games'];


export const MyNav = () => {
  return (
    <div className="mr-4 gap-2 flex bg-black text-yellow-400">
        <img
            src={logo}
            alt='logo'
        ></img>
      {myNavItems.map((item, index) => (
        <Link key={index} to={"/" + item.toString().toLowerCase()}>
          {item}
        </Link>
      ))}
    </div>
  );
}