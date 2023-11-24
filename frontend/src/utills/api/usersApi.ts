import { AuthFormValues } from '../../types/dataTypes/FormValues';
import { Api, apiConfig } from './api';

export class UsersApi extends Api {
    register = (registerData: AuthFormValues) => {
        return this.createRequest(
            'signup',
            'POST',
            this.noAuthHeaders,
            registerData
        );
    };

    login = (loginData: AuthFormValues) => {
        return this.createRequest(
            'signin',
            'POST',
            this.noAuthHeaders,
            loginData
        );
    };

    getCurrentUserInfo = () => {
        return this.createRequest('users/me', 'GET', this.authHeaders());
    };

    getUsersInfo = () => {
        return this.createRequest('users/all', 'GET', this.authHeaders());
    };

    deleteUsers = (userIds: string[]) => {
        return this.createRequest('users', 'DELETE', this.authHeaders(), {
            userIds,
        });
    };

    blockUsers = (userIds: string[]) => {
        return this.createRequest('users/block', 'PATCH', this.authHeaders(), {
            userIds,
        });
    };

    unblockUsers = (userIds: string[]) => {
        return this.createRequest(
            'users/unblock',
            'PATCH',
            this.authHeaders(),
            { userIds }
        );
    };

    assignAdmin = (userIds: string[]) => {
        return this.createRequest(
            'users/assign/admin',
            'PATCH',
            this.authHeaders(),
            { userIds }
        );
    };

    demoteAdmin = (userIds: string[]) => {
        return this.createRequest(
            'users/assign/user',
            'PATCH',
            this.authHeaders(),
            { userIds }
        );
    };
}

export const managingUsersApi = new UsersApi(apiConfig);
