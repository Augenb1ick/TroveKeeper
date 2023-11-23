import {
    EMAIL_PATTERN,
    EMAIL_PATTERN_ERROR_MESSAGE,
    REQUIRED_ERROR_MESSAGE,
} from '../utills/constants';

export const NAME_VALIDATION_CONFIG = {
    required: REQUIRED_ERROR_MESSAGE,
};

export const EMAIL_VALIDATION_CONFIG = {
    required: REQUIRED_ERROR_MESSAGE,
    pattern: {
        value: EMAIL_PATTERN,
        message: EMAIL_PATTERN_ERROR_MESSAGE,
    },
};

export const PASSWORD_VALIDATION_CONFIG = {
    required: REQUIRED_ERROR_MESSAGE,
};
