import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { format } from "date-fns"
import { useFetch } from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";
import NonlinearSlider from "../components/NonlinearSlider";


const Home = () => {

    const [end, setEnd] = useState(15)
    const { user } = useAuthContext();
    let { data: reservations } = useFetch("/api/reservation/in_range", `?startRange=${Date.now()}&endRange=${Date.now() + 1000}`)
    const { data: cars } = useFetch(`/api/car/employee_id/${user.id}`)
    const { data: spots } = useFetch(`/api/spot`)
    const day = 24 * 60 * 60 * 1000;
    const [isPending, setIsPending] = useState(false)
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


    useEffect(() => console.log(reservation), [reservation])

    const searchSpaces = async () => {

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
        console.log(reservation);
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
            console.log(json);
        } else {
            alert(json.error)
        }
        setIsPending(false)


    }

    function convertTimeToMilliseconds(timeString) {
        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(':').map(Number);
        // Calculate the total milliseconds
        const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
        return totalMilliseconds;
    }

    function formatTimeToHHMM(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function updateEnd(value) {
        setEnd(value);
        setReservation({ ...reservation, end_time: dates.start + convertTimeToMilliseconds(`00:${value}`), spot_id: 0 })


    }

    return (
        <div className="flex">
            <AdminNavbar />
            <div className="flex-1 p-8 ">
                <img src="./map.png" className="opacity-30" alt="" />
                <div className="fixed right-8 top-20 z-10 h-[80vh] w-80 bg-white p-5  ">
                    <h2 className="text-center text-2xl text-accent font-semibold">Reserve parking</h2>
                    <form >
                        <div className="flex flex-col my-5 child:mb-3 select-none">
                            <div className="flex justify-around items-center px-12">
                                <span className={`font-bold cursor-pointer text-2xl ${dates.start > Date.now() ? "text-accent" : "text-accent-light"}`} onClick={e => (dates.start - day < Date.now() ? setDates({ ...dates, start: Date.now() }) : setDates({ ...dates, start: dates.start - day }))}>&#60;</span>
                                <span>{format(new Date(format(new Date(dates.start), "yyyy-MM-dd")), "EEEE d.L.")}</span>
                                <span className={`font-bold cursor-pointer text-2xl ${dates.start < Date.now() + day ? "text-accent" : "text-accent-light"}`} onClick={e => { ((dates.start + day > Date.now() + day * 2) ? setDates({ ...dates, start: Date.now() + day * 2 }) : setDates({ ...dates, start: dates.start + day })) }}>&#62;</span>
                            </div>
                            <div className=" mx-auto text-center">
                                <p>From</p>
                                <input type="time" value={formatTimeToHHMM(new Date(reservation.start_time))} onChange={e => { setReservation({ ...reservation, spot_id: 0, start_time: dates.start + convertTimeToMilliseconds(e.target.value), end_time: dates.start + convertTimeToMilliseconds(e.target.value) + convertTimeToMilliseconds(`00:${end}`) }) }} className="border-[3px] rounded-sm border-accent mx-3 px-3 py-1 w-36     " />
                                <p className="mt-3">Length</p>
                                <NonlinearSlider end={end} updateEnd={updateEnd} />
                            </div>

                        </div>

                        <div className="btn w-min mx-auto" onClick={searchSpaces}>Search</div>
                    </form>
                    <form action="">
                        <div className="flex flex-col my-5 child:mb-3">
                            <input type="number" value={reservation.spot_id} onChange={e => setReservation({ ...reservation, spot_id: Number(e.target.value) })} name="" id="" />
                            {!!cars && <div className=" mx-auto text-center">
                                <p>Car</p>
                                <select onChange={e => setReservation({ ...reservation, car_id: Number(e.target.value) })}>
                                    <option value=""></option>
                                    {cars.map(e => (
                                        <option key={e.id} className="justify-between flex" value={e.id}>{e.name}  -- {e.evc} </option>
                                    ))}
                                </select>
                            </div>}


                        </div>

                        <div className="btn w-min mx-auto" onClick={addReservation}>Reserve</div>
                    </form>

                </div>


            </div >
        </div >
    );
}

export default Home;