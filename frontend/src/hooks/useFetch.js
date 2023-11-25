import { useEffect, useState } from "react"

export const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const fetchData = async() => {
            setIsPending(true)
            const response = await fetch(`${process.env.REACT_APP_PATH}${url}`)
            const json = await response.json()
            setIsPending(false)
            setData(json)
        }
        fetchData()
    }, [url])
    return { data, isPending }
}