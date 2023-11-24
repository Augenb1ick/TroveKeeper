import { Api, apiConfig } from './api';

interface FieldDataType {
    name: string;
    isRequired: boolean;
    fieldType: string;
    collectionId: string;
}

class FieldsApi extends Api {
    createField = (field: FieldDataType) => {
        return this.createRequest(
            'fields/create',
            'POST',
            this.authHeaders(),
            field
        );
    };

    getAllCollectionFields = (id: string) => {
        return this.createRequest(
            `fields/all/${id}`,
            'GET',
            this.noAuthHeaders
        );
    };
}

export const fieldsApi = new FieldsApi(apiConfig);
