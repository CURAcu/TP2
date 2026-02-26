import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import useRequest from "./useRequest"
import { createWorkspace } from "../services/workspaceService"
import useForm from "./useForm"
import { AuthContext } from "../Context/AuthContext"

const useCreateWorkspace = () => {
    const navigate = useNavigate()
    const { loading, error, sendRequest } = useRequest()
    const { authToken, clearSession } = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const handleCreateWorkspace = async (form_values) => {
        const newErrors = {}

        if (!form_values.title || form_values.title.trim() === "") {
            newErrors.title = "El titulo del espacio de trabajo es obligatorio"
        }

        if (!form_values.description || form_values.description.trim() === "") {
            newErrors.description = "La descripcion es obligatoria"
        } else if (form_values.description.length > 1000) {
            newErrors.description = "La descripcion no puede superar los 1000 caracteres"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})

        await sendRequest(
            async () => {
                await createWorkspace(form_values, authToken)
                navigate("/home")
            },
            {
                onUnauthorized: () => clearSession(),
            }
        )
    }

    const { form_state, onChangeFieldValue, onSubmitForm } = useForm({
        initial_form_fields: {
        title: "",
        description: "",
        },
        onSubmit: handleCreateWorkspace,
    })

    return {
        form_state,
        onChangeFieldValue,
        onSubmitForm,
        isLoading: loading,
        error,
        errors,
    }
}

export default useCreateWorkspace