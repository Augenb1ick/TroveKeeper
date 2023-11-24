import { Api, apiConfig } from './api';

class FieldValueApi extends Api {
    createFieldValue = (value: string, itemId: string, fieldId: string) => {
        return this.createRequest(
            'field-values/create',
            'POST',
            this.authHeaders(),
            {
                value,
                itemId,
                fieldId,
            }
        );
    };

    deleteFieldValues = (itemId: string, fieldId: string) => {
        return this.createRequest(
            'field-values/delete',
            'DELETE',
            this.authHeaders(),
            {
                itemId,
                fieldId,
            }
        );
    };

    updateFieldValue = (itemId: string, fieldId: string, newValue: string) => {
        return this.createRequest(
            'field-values/update',
            'PATCH',
            this.authHeaders(),
            {
                itemId,
                fieldId,
                newValue,
            }
        );
    };

    getItemFieldValue = (itemId: string, fieldId: string) => {
        return this.createRequest(
            `field-values/all/${itemId}/${fieldId}`,
            'GET',
            this.noAuthHeaders
        );
    };
}

export const fieldValueApi = new FieldValueApi(apiConfig);
