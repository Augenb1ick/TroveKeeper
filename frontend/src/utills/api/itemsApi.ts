import { Api, apiConfig } from './api';

class ItemsApi extends Api {
    createItem = (
        name: string,
        collectionId: string,
        ownerName: string,
        collectionName: string
    ) => {
        return this.createRequest('items/create', 'POST', this.authHeaders(), {
            name,
            collectionId,
            ownerName,
            collectionName,
        });
    };

    getCollectionItems = (id: string) => {
        return this.createRequest(
            `items/collection/${id}`,
            'GET',
            this.noAuthHeaders
        );
    };

    getAllItems = () => {
        return this.createRequest(`items/all`, 'GET', this.noAuthHeaders);
    };

    changeItemName = (newName: string, itemId: string) => {
        return this.createRequest(
            'items/update/name',
            'PATCH',
            this.authHeaders(),
            {
                newName,
                itemId,
            }
        );
    };

    changeItemPoster = (newPoster: string, itemId: string) => {
        return this.createRequest(
            'items/update/poster',
            'PATCH',
            this.authHeaders(),
            {
                newPoster,
                itemId,
            }
        );
    };

    deleteItems = (items: string[]) => {
        return this.createRequest(
            'items/delete',
            'DELETE',
            this.authHeaders(),
            {
                items,
            }
        );
    };

    getItemInfo = (id: string) => {
        return this.createRequest(
            `items/info/${id}`,
            'GET',
            this.noAuthHeaders
        );
    };

    changeLikeItemStatus = (id: string, itemIsLiked: boolean) => {
        if (itemIsLiked) {
            return this.createRequest(
                `items/likes/${id}`,
                'DELETE',
                this.authHeaders()
            );
        }
        return this.createRequest(
            `items/likes/${id}`,
            'PUT',
            this.authHeaders()
        );
    };

    searchItemsByQuery = (query: string) => {
        return this.createRequest(
            `items/search/${query}`,
            'GET',
            this.noAuthHeaders
        );
    };
}

export const itemsApi = new ItemsApi(apiConfig);
