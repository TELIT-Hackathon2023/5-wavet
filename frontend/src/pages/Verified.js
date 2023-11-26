import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect } from "react"

const Verified = () =>{
    const { user } = useAuthContext()

    useEffect(() =>{
        const setVerified = async () => {
            const response = await fetch(`${process.env.REACT_APP_PATH}/api/user/verify?id=${user.id}`, {
            method: 'PATCH',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
            })
            if(!response.ok){
                const json = await response.json()
                alert(json.error)
            }
        }
        if(!!user){
            console.log(user.id);
            setVerified()
        }
    },[user])
    return(
        <div className="mt-16  w-screen flex items-center justify-center flex-col">
            <div className="bg-white p-8 rounded shadow-md flex flex-col items-center justify-center">
                <h1 className="text-3xl mb-4">Email Verified Successfully!</h1>
                <p className="text-gray-700">
                Thank you for verifying your email address. You can now book your parking.
                </p>
                <Link to={'/home'} className="btn !mt-6">Go to website</Link>

            </div>
        </div>
    )
}
export default Verified