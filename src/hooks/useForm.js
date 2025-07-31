import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidation] = useState({});

    useEffect(() => { //Crea las validaciones del formulario cuando cambia el estado del formulario
        createValidators();
    }, [formState]);

    useEffect(() => { //Este efecto cambia el estado del formulario cuando cambia el initialForm
        setFormState( initialForm );
    }, [initialForm]);

    const isFormValid = useMemo( () => {
        for (const formValue of Object.keys(formValidation)) {
            if(formValidation[formValue] !== null ) return false;
        }
        
        return true;
    }, [formValidation]);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const onResetForm = () => {
        setFormState(initialForm);
        setFormValidation({}); // Reiniciar las validaciones
    };

    const createValidators = () => {
        const formCheckedValues = {};

        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage] = formValidations[formField];
            const fieldValue = formState[formField] || '';
            // Si la función de validación acepta 2 o más argumentos, pasa formState como segundo argumento
            const isValid = fn.length >= 2 ? fn(fieldValue, formState) : fn(fieldValue);
            formCheckedValues[`${formField}Valid`] = isValid ? null : errorMessage;
        }

        setFormValidation(formCheckedValues);
    };

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        ...formValidation,
        isFormValid,
    };
};