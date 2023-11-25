import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { format } from "date-fns"
import { useFetch } from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";


const Home = () => {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const { user } = useAuthContext();
    const { data: reservations } = useFetch("/api/reservation/in_range", `?startRange=${Date.now()}&endRange=${Date.now() + 1000}`)
    const { data: cars } = useFetch(`/api/car/employee_id/${user.id}`)
    useEffect(() => {
        console.log(reservations);
    }, [reservations])



    return (
        <div className="flex">
            <AdminNavbar />
            <div className="flex-1 p-8 ">
                <img src="./map.png" className="opacity-30" alt="" />
                <div className="fixed right-8 top-20 z-10 h-[80vh] w-80 bg-white p-5  ">
                    <h2 className="text-center text-2xl text-accent font-semibold">Reserve parking</h2>
                    <form action="">
                        <div className="flex flex-col my-5 child:mb-3">
                            <div className="flex justify-around items-center px-12">
                                <span className=" text-accent-light font-bold cursor-pointer text-2xl">&#60;</span>
                                <span>{format(new Date(date), "EEEE d.L.")}</span>
                                <span className="text-accent font-bold cursor-pointer text-2xl">&#62;</span>
                            </div>
                            <div className=" mx-auto text-center">
                                <p>From</p>
                                <input type="time" className="border-[3px] rounded-sm border-accent mx-3 px-3 py-1 w-36     " />
                                <p>Length</p>
                                <input type="number" className="border-[3px] rounded-sm border-accent mx-3 px-3 py-1 w-36" />
                            </div>

                        </div>

                        <div className="btn w-min mx-auto">Vyhľadaj</div>
                    </form>
                    <form action="">
                        <div className="flex flex-col my-5 child:mb-3">
                            <div className="flex justify-around items-center px-12">
                                <span className=" text-accent-light font-bold cursor-pointer text-2xl">&#60;</span>
                                <span>{format(new Date(date), "EEEE d.L.")}</span>
                                <span className="text-accent font-bold cursor-pointer text-2xl">&#62;</span>
                            </div>
                            {<div className=" mx-auto text-center">
                                <p>Car</p>
                                <select>
                                    <option value="">X</option>
                                </select>
                            </div>}
                            {/* <input type="text" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} /> */}

                        </div>

                        <div className="btn w-min mx-auto">Rezervuj</div>
                    </form>

                </div>


            </div>
        </div>
    );
}

export default Home;