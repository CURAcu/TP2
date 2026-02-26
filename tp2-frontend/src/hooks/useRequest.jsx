import { useState } from "react"

function useRequest() {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)

    async function sendRequest(requestCallback, options = {}) {
        const { onUnauthorized } = options

        try {
            setLoading(true)
            setResponse(null)
            setError(null)
            const response = await requestCallback()
            setResponse(response)
        } catch (err) {
            const status = err?.status

            if (status === 401 && typeof onUnauthorized === "function") {
                onUnauthorized()
            }

            if (status) {
                setError(err)
            } else {
                setError({ message: err?.message || "Ha ocurrido una excepcion" })
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, response, error, sendRequest }
}

export default useRequest