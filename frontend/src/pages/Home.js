import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { format } from "date-fns"
import { useFetch } from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";
import NonlinearSlider from "../components/NonlinearSlider";
import ThreeScene from "../components/ThreeScene";


const Home = () => {

    const [end, setEnd] = useState(15)
    const { user } = useAuthContext();
    let { data: reservations } = useFetch("/api/reservation/in_range", `?startRange=${Date.now()}&endRange=${Date.now() + 1000}`)
    const { data: cars } = useFetch(`/api/car/employee_id/${user.id}`)
    const { data: spots } = useFetch(`/api/spot`)
    const day = 24 * 60 * 60 * 1000;
    const [isPending, setIsPending] = useState(false)
    const [canReserve, setCanReserve] = useState(true)
    const [lastStrike, setLastStrike] = useState(Date.now())
    const [spot, setSpot] = useState(0);

    var plusMonth = new Date()
    var X = new Date()
    X.setHours(0, 0, 0, 0)
    const [dates, setDates] = useState({
        start: X.getTime()
    })

    const [reservation, setReservation] = useState({
        employee_id: Number(user.id),
        status: "planned",
        spot_id: 0,
        created_at: Date.now(),
        start_time: Date.now(),
        end_time: Date.now() + convertTimeToMilliseconds(`00:${15}`),
        car_id: 0
    })

    useEffect(() => {
        const getStrikes = async () => {
            const response = await fetch(`${process.env.REACT_APP_PATH}/api/strike?id=${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json()

            if (response.ok) {
                if (json.length >= 3) {
                    setCanReserve(false)
                    json.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    setLastStrike(new Date(json[0].created_at))
                }
            } else {
                alert(json.error)
            }
        }
        getStrikes()
    }, [])

    useEffect(() => {
        setReservation({
            employee_id: Number(user.id),
            status: "planned",
            spot_id: 0,
            created_at: Date.now(),
            start_time: Date.now(),
            end_time: Date.now() + convertTimeToMilliseconds(`00:${15}`),
            car_id: 0
        })
    }, [user])

    useEffect(() => {
        setReservation({
            employee_id: Number(user.id),
            status: "planned",
            spot_id: 0,
            created_at: Date.now(),
            start_time: dates.start,
            end_time: dates.start + convertTimeToMilliseconds(`00:${15}`),
            car_id: 0
        })
    }, [dates])

    useEffect(() => {
        setReservation({ ...reservation, spot_id: spot })
        if (spot === 0) {
            handleSpotClick(0)
        }
    }, [spot])

    useEffect(() => {
        searchSpaces()

    }, [reservation])




    const searchSpaces = async () => {
        console.log(reservation.start_time);
        console.log(new Date(reservation.start_time));
        setIsPending(true)
        const response = await fetch(`${process.env.REACT_APP_PATH}/api/reservation/in_range?startRange=${reservation.start_time}&endRange=${reservation.end_time}`)
        const json = await response.json()

        if (response.ok) {
            console.log(json);

        } else {
            alert(json)
        }
        setIsPending(false)


    }

    const addReservation = async () => {
        setIsPending(true)
        const response = await fetch(`${process.env.REACT_APP_PATH}/api/reservation/`, {
            method: 'POST',
            body: JSON.stringify({ ...reservation }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            window.location.reload();
        } else {
            alert(json.error)
        }
        setIsPending(false)


    }

    function convertTimeToMilliseconds(timeString) {
        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(':').map(Number);

        // Calculate the total milliseconds
        const totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

        return totalMilliseconds;
    }


    function formatTimeToHHMM(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function updateEnd(value) {
        setEnd(value);
        const endTimeInMilliseconds = reservation.start_time + convertTimeToMilliseconds(`00:${value}`);
        setReservation({ ...reservation, end_time: endTimeInMilliseconds });
        setSpot(0)
    }

    const [parkingSpotsData, setParkingSpotsData] = useState([]);

    const handleSpotClick = (spotId) => {
        setSpot(spotId)
        if (spots) {
            spots.filter(x => {
                if (x.id === spotId) {
                    x.color = 0x9c0251
                    x.height = 0.5
                } else {
                    x.color = 0xe20074
                    x.height = 0.1
                }
            })
        }

    };




    useEffect(() => {
        if (!!spots) {
            let temp = [...spots]

            temp.forEach(e => {
                console.log(e);
                console.log(reservations);
                if (reservations.find(x => x.spot_id == e.id)) {
                    e.color = 0x999999
                } else {
                    e.color = 0xe20074
                }
                e.lable = e.name.toUpperCase();
                e.height = 0.1
            })
            setParkingSpotsData(temp)
        }


    }, [spots])


    function addOneMonth(date) {
        const newDate = new Date(date);
        newDate.setUTCMonth(newDate.getUTCMonth() + 1);
        return newDate;
    }

    useEffect(() => {
        plusMonth = addOneMonth(lastStrike)
    }, [lastStrike])

    return (
        <div className="flex">
            <AdminNavbar />
            <div className="flex-1 p-8 ">
                {/* <img src="./map.png" className="opacity-30" alt="" /> */}
                <ThreeScene className={"w-[10vw]"} parkingSpotsData={parkingSpotsData} handleSpotClick={handleSpotClick} />
                <div className="fixed right-8 top-20 z-10 h-[80vh] w-80 bg-white p-5  ">
                    <h2 className="text-center text-2xl text-accent font-semibold">Reserve parking</h2>
                    {canReserve && <form >
                        <div className="flex flex-col my-5 child:mb-3 select-none">
                            <div className="flex justify-around items-center px-12">
                                <span className={`font-bold cursor-pointer text-2xl ${dates.start > X.getTime() ? "text-accent" : "text-accent-light"}`} onClick={e => (dates.start - day < X.getTime() ? setDates({ ...dates, start: X.getTime() }) : setDates({ ...dates, start: dates.start - day }))}>&#60;</span>
                                <span>{format(new Date(format(new Date(dates.start), "yyyy-MM-dd")), "EEEE d.L.")}</span>
                                <span className={`font-bold cursor-pointer text-2xl ${dates.start <= X.getTime() + day ? "text-accent" : "text-accent-light"}`} onClick={e => { ((dates.start + day > X.getTime() + day * 2) ? setDates({ ...dates, start: X.getTime() + day * 2 }) : setDates({ ...dates, start: dates.start + day })) }}>&#62;</span>
                            </div>
                            <div className=" mx-auto text-center">
                                <p>From</p>
                                <input type="time" value={formatTimeToHHMM(new Date(reservation.start_time))} onChange={e => { setSpot(0); setReservation({ ...reservation, start_time: dates.start + convertTimeToMilliseconds(e.target.value), end_time: dates.start + convertTimeToMilliseconds(e.target.value) + convertTimeToMilliseconds(`00:${end}`) }) }} className="border-[3px] rounded-sm border-accent mx-3 px-3 py-1 w-36     " />
                                <p className="mt-3">Length</p>
                                <NonlinearSlider end={end} updateEnd={updateEnd} />
                            </div>

                        </div>

                        <div className="btn w-min mx-auto" onClick={searchSpaces}>Search</div>
                    </form>}
                    {canReserve &&
                        <div className="h-full">
                            {spot !== 0 && <form action="">
                                {spots && <div className="flex flex-col my-5 child:mb-3">
                                    {!!cars && <div className=" mx-auto text-center">
                                        <p>Spot</p>
                                        {/* <p>{spots.find(x => x.id = reservation.spot_id).id}</p> */}
                                        {spots && <p>{spots.find(x => x.id === spot).lable}</p>}
                                        <p>Car</p>
                                        <select onChange={e => setReservation({ ...reservation, car_id: e.target.value })}>
                                            <option value=""></option>
                                            {cars.map(e => (
                                                <option key={e.id} className="justify-between flex" value={e.id}>{e.name}  -- {e.evc} </option>
                                            ))}
                                        </select>
                                    </div>}


                                </div>}

                                <div className="btn w-min mx-auto" onClick={addReservation}>Reserve</div>
                            </form>}
                            {spot === 0 &&
                                <div action="" className="text-center flex flex-col justify-center items-center h-1/3 text-accent text-lg">
                                    <h1>Select free spot on map</h1>
                                    <h2 className="text-sm">(higlighted in magenta)</h2>
                                </div>
                            }
                        </div>


                    }
                    {!canReserve &&
                        <div className="flex h-full flex-col items-center justify-center">

                            <h2 className="font-semibold text-3xl">Too many strikes!</h2>
                            <p className="text-center">You cannot make any more reservations until</p>
                            <p>{format(plusMonth, "EEEE d.L.yyyy")}</p>
                        </div>
                    }
                </div>


            </div >
        </div >
    );
}

export default Home;