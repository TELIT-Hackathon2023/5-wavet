import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar"
import { useAuthContext } from "../hooks/useAuthContext"
import { useFetch } from "../hooks/useFetch";
import { format } from "date-fns";

const ReservationList = () => {
    const { user } = useAuthContext()

    const { data: fetchedReservations } = useFetch(`/api/reservation/employee_id/${user.id}`);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (fetchedReservations) {
            setReservations(fetchedReservations);
        }
    }, [fetchedReservations]);

    return(
        <div className="flex">
            <AdminNavbar />
            <div className="flex-1 p-8 ">
            <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                            #
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Car Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start Time
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            End Time
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Spot No.
                        </th>
                        </tr>                        
                    </thead>
                    {<tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((reservation, i) => (
                            <tr key={reservation.reservation.id}>
                            <td className="px-6 py-4 whitespace-nowrap w-1/12">
                                {i+1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {reservation.car.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {reservation.reservation.status}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {format(new Date(reservation.reservation.start_time), "HH:mm")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {format(new Date(reservation.reservation.end_time), "HH:mm")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {reservation.car.evc}
                            </td>
                            </tr>
                        ))}
                    </tbody>}
                </table>
            </div>
        </div>
    )
}

export default ReservationList;