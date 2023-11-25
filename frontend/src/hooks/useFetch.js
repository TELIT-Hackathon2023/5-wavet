import { useEffect, useState } from "react"

export const useFetch = (url, query) => {
    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)

    if (!query) {
        query = ""
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true)
            const response = await fetch(`${process.env.REACT_APP_PATH}${url}${query}`)
            const json = await response.json()

            if (response.ok) {
                setData(json)
            } else {
                alert(json)
            }
            setIsPending(false)

        }
        fetchData()
    }, [url])
    return { data, isPending }
}