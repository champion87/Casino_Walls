import { useContext } from "react"
import { useNavigate, } from "react-router-dom";
import { userContext } from "../components/PrivateRoute"
import { Button } from '../components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel"

export const HomePage = () => {
    const navigate = useNavigate();
    const { userData, forceUpdate } = useContext(userContext);

    function goToGames() {
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
                            className="w-fit m-4 bg-white inline-block text-black rounded-full hover:text-yellow-300"
                        >
                            go to games screen
                        </Button>
                    </div>
                </div>
                <p className="text-7xl mt-5 font-serif text-yellow-400 animate-bounce">↓</p>
            </div>
            <div className="size-full items-center pt-10 px-10">
                <div className="bg-black inline-block w-11/12 items-center justify-center flex-col rounded-3xl">
                    <div className="my-4">
                        <h1 className="text-3xl font-bold text-yellow-400 mb-7">This is the Home Page of {userData.user}</h1>
                        <p className="text-2xl font-semibold text-yellow-400">our top played games:</p>
                    </div>
                    <div className="grid w-full h-full grid-cols-3">
                        <Card className="flex flex-col relative items-center m-10 bg-cards bg-cover">
                            <CardHeader>
                                <CardTitle className="text-yellow-400 font-bold">Blackjack</CardTitle>
                                <CardDescription className="text-yellow-300">one of the all time best casino games</CardDescription>
                            </CardHeader>
                            <CardContent className="text-yellow-300 font-semibold">
                            </CardContent>
                            <CardFooter className="flex items-center justify-center absolute bottom-0">
                                <Button className="text-yellow-400" onClick={() => navigate("/blackjack_main")}>Take Me There</Button>
                            </CardFooter>
                        </Card>
                        <Card className="flex flex-col relative items-center m-10 bg-wheel">
                            <CardHeader>
                                <CardTitle className="text-yellow-400">Wheel of Fortune</CardTitle>
                                <CardDescription className="text-yellow-300">one of the all time best casino games</CardDescription>
                            </CardHeader>
                            <CardContent>
                            </CardContent>
                            <CardFooter className="flex items-center justify-center absolute bottom-0">
                                <Button className="text-yellow-300" onClick={() => navigate("/games/7/wheel_of_fortune")}>Take Me There</Button>
                            </CardFooter>
                        </Card>

                        <Card className="flex flex-col m-10 bg-poker relative bg-cover bg-center items-center text-yellow-300">
                            <CardHeader>
                                <CardTitle>Poker</CardTitle>
                                <CardDescription className="text-yellow-300">certainly the all time best casino game</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                            </CardContent>
                            <CardFooter className="flex items-center justify-center absolute bottom-0">
                                <Button onClick={() => navigate("/poker_main")} className="text-yellow-300">Take Me There</Button>
                            </CardFooter>
                        </Card>
                    </div>

                </div>
                <div className="bg-black flex items-center justify-center flex-col text-yellow-300 rounded-3xl mt-10">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full max-w-2xl"
                    >
                        <CarouselContent>
                            {reviews.map((d) => (
                                <CarouselItem key={d.name} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Card className="aspect-[5/2]">
                                            <CardContent className="items-center justify-center p-6">
                                                <div className="flex flex-col w-full">
                                                    <div className="flex items-center">
                                                        <div className={"rounded-full text-2xl px-2 mx-2 h-fit w-fit bg-" + d.color}>{d.name.slice(0, 1)}</div>
                                                        <div className="text-l font-semibold text-black ">{d.name}</div>
                                                    </div>
                                                    <div className="flex w-full flex-col items-center justify-center">
                                                        <div className="text-yellow-300">{"★".repeat(d.stars)}</div>
                                                    </div>
                                                </div>
                                                <div className="text-l font-semibold">{'"' + d.review + '"'}</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                    <div className="bg-green-300 bg-purple-300 bg-blue-300 bg-orange-300 bg-red-300"></div>
                    <p>'אין אתר' ~ N. Atar</p>
                    <p>🌟🌟🌟🌟🌟</p>
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

const reviews = [
    {
        "name": "N. Atar",
        "color": "blue-300",
        "review": "אין אתר",
        "stars": 5
    },
    {
        "name": "E. Yokneam",
        "color": "orange-300",
        "review": "?איפה המטבוחה",
        "stars": 3
    },
    {
        "name": "N. Atar",
        "color": "green-300",
        "review": "אין אתר",
        "stars": 5
    },
    {
        "name": "E. Yokneam",
        "color": "purple-300",
        "review": "?איפה המטבוחה",
        "stars": 3
    },
    {
        "name": "N. Atar",
        "color": "red-300",
        "review": "אין אתר",
        "stars": 5
    }
]