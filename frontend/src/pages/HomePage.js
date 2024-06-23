import { useContext} from "react"
import {useNavigate,} from "react-router-dom";
import { userContext } from "../components/PrivateRoute"
import { Button } from '../components/ui/button';
import { Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    } from '../components/ui/card';

export const HomePage = () => {
    const navigate = useNavigate();
    const {userData, forceUpdate} = useContext(userContext);
    
    function goToGames(){
        navigate('/games');
    }
    return (
    <div className="w-screen h-screen overflow-y-scroll bg-wall bg-cover">
        <div
        className="h-screen w-full overflow-hidden bg-cover bg-[url('../Images/possible_banner.png')] items-center pb-1 pt-10 px-10"
        alt="banner-image">
            <div className="grid w-full h-5/6 grid-cols-2">
                <div className="flex items-center justify-center flex-col">
                    <h1 className="text-8xl font-bold text-yellow-400 mb-7">Welcome to Casino Walls</h1>
                    <p className="text-2xl font-semibold text-yellow-400 mb-10">here you can play all kinds of gambling games</p>
                    <Button
                    type="button"
                    onClick={goToGames}
                    className="w-44 mt-10 bg-black text-yellow-300 rounded-full hover:text-yellow-200 outline-2 outline-yellow-300"
                    >
                    go to games screen
                    </Button>
                </div>
            </div>
            <p className="text-7xl mt-5 font-serif text-yellow-400 animate-bounce">↓</p>
        </div>
        <div className="size-full items-center pt-10 px-10">
            <div className="bg-black inline-block items-center justify-center flex-col rounded-3xl">
                <div className="my-4">
                    <h1 className="text-3xl font-bold text-yellow-400 mb-7">This is the Home Page of {userData.user}</h1>
                    <p className="text-2xl font-semibold text-yellow-400">our top played games:</p>
                </div>
                <div className="grid w-full h-full grid-cols-3">
                <Card className="w-[350px] m-10 bg-black">
                    <CardHeader>
                        <CardTitle className="text-yellow-400 font-bold">Blackjack</CardTitle>
                        <CardDescription className="text-yellow-300 font-semibold">one of the all time best casino games</CardDescription>
                    </CardHeader>
                    <CardContent className="text-yellow-300 font-semibold">
                        <p>"Blackjack is a casino banking game.</p>
                        <p>It is the most widely played casino banking game in the world."</p>
                        <p>- wikipedia</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-center">
                        <Button className="text-yellow-400">Take Me There</Button>
                    </CardFooter>
                </Card>
                <Card className="w-[350px] m-10">
                    <CardHeader>
                        <CardTitle className="text-yellow-400">Wheel of Fortune</CardTitle>
                        <CardDescription className="text-yellow-300">one of the all time best casino games</CardDescription>
                    </CardHeader>
                    <CardContent>
                        
                    </CardContent>
                    <CardFooter className="flex items-center justify-center">
                        <Button className="text-yellow-300">Take Me There</Button>
                    </CardFooter>
                </Card>
                <Card className="w-[350px] m-10">
                    <CardHeader>
                        <CardTitle>Coming Soon...</CardTitle>
                        <CardDescription>one of the all time best casino games</CardDescription>
                    </CardHeader>
                    <CardContent>
                        
                    </CardContent>
                    <CardFooter className="flex items-center justify-center">
                        <Button>Take Me There</Button>
                    </CardFooter>
                </Card>
                </div>
                
            </div>
            <div className="bg-[#961212] flex items-center justify-center flex-col text-yellow-300 rounded-3xl mt-10">
                <p>some reviews...</p>
                <p>some reviews...</p>
                <p>some reviews...</p>
                <p>some reviews...</p>
            </div>
            <div className="bg-[#961212] flex items-center justify-center flex-col text-yellow-300 rounded-t-3xl mt-10">
                how to contact us
            </div>
        </div>
    </div>
    );
}