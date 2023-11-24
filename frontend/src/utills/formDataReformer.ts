import { AuthFormValues } from '../types/dataTypes/FormValues';

export const reformFormData = (data: AuthFormValues) => {
    const lowerCaseEmail = data.email.toLowerCase();

    const processedData = {
        ...data,
        email: lowerCaseEmail,
    };
    return processedData;
};
