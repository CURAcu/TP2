import { useState } from "react"
import { register } from "../services/authService"
import useForm from "./useForm"
import useRequest from "./useRequest"

function useRegister() {
    const { loading, error, response, sendRequest } = useRequest()
    const [localError, setLocalError] = useState(null)

    const form_initial_state = {
        username: "",
        password: "",
        email: "",
    }

    async function enviarRegistro(form_state) {
        setLocalError(null)

        if (!form_state.username?.trim()) return setLocalError("Falta el nombre de usuario")
        if (!form_state.email?.trim()) return setLocalError("Falta el email")
        if (!form_state.password?.trim()) return setLocalError("Falta la contraseña")

        return sendRequest(() => {
            return register(form_state.username, form_state.password, form_state.email)
        })
    }

    const { form_state, onChangeFieldValue, onSubmitForm } = useForm({
        initial_form_fields: form_initial_state,
        onSubmit: enviarRegistro,
    })

    return {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        loading,
        error,
        response,
        localError,
    }
}

export default useRegister