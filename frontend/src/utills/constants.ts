import { SnackbarOrigin } from '@mui/material';
import { UserDataType } from '../types/dataTypes/userData';

export const API_URL = 'https://testing-web.site';

export const EMAIL_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const TABLE_INITIAL_PAGE = 0;
export const TABLE_PAGE_SIZE = 5;
export const TABLE_PAGE_SIZE_OPTIONS = [5, 10, 50, 100];

export const defaultUserData: UserDataType = {
    email: '',
    isBlocked: false,
    lastLogin: '',
    name: '',
    regDate: '',
    _id: '',
    role: '',
};

export const DENIED_ERROR = 'Error:401';

export const SERVER_ERROR_MESSAGE = 'Something went wrong! Please try again.';

export const DELETE_ERROR_MESSAGE =
    'An error occurred during deletion, please try again later!';
export const BLOCK_ERROR_MESSAGE =
    'An error occurred during blocking, please try again later!';
export const UNBLOCK_ERROR_MESSAGE =
    'An error occurred during unblocking, please try again later!';
export const UPDATE_USERS_ERROR_MESSAGE =
    'An error occurred while updating the list of users, please try again later!';

export const SUCCESS_SIGNUP_TEXT =
    'Registration is completed. Welcome to TroveKeeper!';

export const SNACK_POSITION: SnackbarOrigin = {
    vertical: 'top',
    horizontal: 'right',
};
export const AUTO_HIDE_SNACK_DURATION = 3500;

export const SELF_BAN_MESSAGE = 'Oops, you blocked or deleted your account!';
export const MANAGING_USERS_ERROR_MESSAGE = 'Something went wrong!';

export const ADD_NEW_FIELD_DIALOG_TITLE = 'New field';
export const ADD_NEW_FIELD_DIALOG_TEXT =
    'Please fill in the information about the new field';

export const ADD_NEW_ITEM_DIALOG_TITLE = 'Add item to your collection';
export const ADD_NEW_ITEM_DIALOG_TEXT =
    'Please fill in the information about the new item in your collection';

export const EDIT_ITEM_DIALOG_TITLE = 'Edit item of your collection';
export const EDIT_ITEM_DIALOG_TEXT =
    'Please edit the information of selected item';

export const CREATE_COLLECTION_DIALOG_TITLE = 'Create collection';
export const CREATE_COLLECTION_DIALOG_TEXT =
    'Please fill the information below to create your collection';

export const DELETE_COLLECTION_DIALOG_TITLE =
    'Are you sure you want to delete your collection?';

export const DELETE_COLLECTION_DIALOG_BTN_TEXT = 'Delete';

export const CREATING_ITEM_ERROR_MESSAGE =
    'Error accured while creating item. Please try again';

export const COLLECTION_FIELD_MAPPINGS: {
    [key: string]: string;
} = {
    name: 'name',
    description: 'description',
    category: 'category',
    poster: 'poster',
};

export const UPDATING_ITEM_POSTER_ERROR_MESSAGE =
    'An error occurred while attempting to update the item poster. Changes will not be saved.';

export const NO_AUTH_LIKE_ERROR_MESSAGE =
    'You need to be authorized to like or dislike an item';
export const LIKE_ERROR_MESSAGE =
    'Error accured when while attempting to like or dislike an item. Please try again';

export const UPDATING_COLLECTION_ERROR_MESSAGE =
    'An error occurred while attempting to update the collection. Changes will not be saved.';

export const CREATING_COLLECTION_ERROR_MESSAGE =
    'Error accured when creating collection. Please try again';

export const DELETING_COLLECTION_ERROR_MESSAGE =
    'Error accured when deleting collection. Please try again';

export const ADDING_FIELD_ERROR_MESSAGE =
    'Error accured when adding new field. Please try again';

export const HEADER_MENU_ITEMS = [
    {
        name: 'Home',
        route: '/',
        allowed: ['user', 'admin', ''],
    },
    {
        name: 'All collections',
        route: '/all-collections',
        allowed: ['user', 'admin', ''],
    },
    {
        name: 'My Collections',
        route: '/my-collections',
        allowed: ['user', 'admin'],
    },
    {
        name: 'Admin panel',
        route: '/admin-panel',
        allowed: ['admin'],
    },
];

export const DARK_THEME_CREATABLE_SELECT_STYLES = {
    input: (styles: any) => ({
        ...styles,
        color: 'white',
    }),
    control: (styles: any, state: any) => ({
        ...styles,
        backgroundColor: '#333',
        padding: '3px',
    }),
    menu: (base: any, state: any) => ({
        ...base,
        backgroundColor: '#333',
        color: '#fff',
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? '#444' : '#222',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#555',
        },
    }),
    multiValueRemove: (styles: any) => ({
        ...styles,
        color: 'black',
    }),
};
