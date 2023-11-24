import { CollectionDataType } from '../../types/dataTypes/CollectionDataType';
import { Api, apiConfig } from './api';

class CollectionsApi extends Api {
    createCollection = (data: CollectionDataType) => {
        return this.createRequest(
            'collections/create',
            'POST',
            this.authHeaders(),
            data
        );
    };

    getAllCollections = () => {
        return this.createRequest('collections/all', 'GET', this.noAuthHeaders);
    };

    getMyCollections = () => {
        return this.createRequest('collections/my', 'GET', this.authHeaders());
    };

    getCollectionById = (id: string) => {
        return this.createRequest(
            `collections/id/${id}`,
            'GET',
            this.noAuthHeaders
        );
    };

    addItemToCollection = (_id: string, itemId: string) => {
        return this.createRequest(
            'collections/add-item/',
            'PATCH',
            this.authHeaders(),
            {
                _id,
                itemId,
            }
        );
    };

    deleteItemsFromCollection = (_id: string, itemsTobeDeleted: string[]) => {
        return this.createRequest(
            'collections/delete-items/',
            'PATCH',
            this.authHeaders(),
            {
                _id,
                itemsTobeDeleted,
            }
        );
    };

    updateCollection = (_id: string, field: string, value: string) => {
        return this.createRequest(
            `collections/update/${field}`,
            'PATCH',
            this.authHeaders(),
            {
                _id,
                field,
                value,
            }
        );
    };

    hideCollection = (_id: string) => {
        return this.createRequest(
            'collections/change/visability',
            'PATCH',
            this.authHeaders(),
            {
                _id,
                field: 'isActive',
                value: 'false',
            }
        );
    };

    deleteCollection = (_id: string) => {
        return this.createRequest(
            'collections/delete',
            'DELETE',
            this.authHeaders(),
            {
                _id,
            }
        );
    };
}

export const collectionsApi = new CollectionsApi(apiConfig);
