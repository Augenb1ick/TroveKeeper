import { Api, apiConfig } from './api';

type Tag = {
    name: string;
};

class TagsApi extends Api {
    createTags = (tags: Tag[], itemId: string) => {
        return this.createRequest('tags/create', 'POST', this.authHeaders(), {
            tags,
            itemId,
        });
    };

    addItemsToTags = (tags: Tag[], itemId: string) => {
        return this.createRequest(
            'tags/add-items',
            'PATCH',
            this.authHeaders(),
            {
                tags,
                itemId,
            }
        );
    };

    deleteTags = (tags: Tag[], itemId: string) => {
        return this.createRequest(
            'tags/delete-items',
            'PATCH',
            this.authHeaders(),
            {
                tags,
                itemId,
            }
        );
    };

    getItemTags = (id: string) => {
        return this.createRequest(`tags/all/${id}`, 'GET', this.noAuthHeaders);
    };
    getAllTags = () => {
        return this.createRequest('tags/all/', 'GET', this.noAuthHeaders);
    };
}

export const tagsApi = new TagsApi(apiConfig);
