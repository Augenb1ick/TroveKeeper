import React, { createContext, useState, ReactNode, useContext } from 'react';

interface SnackBarsContextType {
    successSnackText: string;
    setSuccessSnackText: (text: string) => void;
    errorSnackText: string;
    setErrorSnackText: (text: string) => void;
    isSuccessSnackOpen: boolean;
    setIsSuccessSnackOpen: (isOpen: boolean) => void;
    isErrorSnackOpen: boolean;
    setIsErrorSnackOpen: (isOpen: boolean) => void;
    handleErrorSnackOpen: (text: string) => void;
    handleSuccessSnackOpen: (text: string) => void;
    handleSnacksClose: () => void;
}

const defaultSnackBarsContext: SnackBarsContextType = {
    successSnackText: '',
    setSuccessSnackText: (text: string) => {},
    errorSnackText: '',
    setErrorSnackText: (text: string) => {},
    isSuccessSnackOpen: false,
    setIsSuccessSnackOpen: (isOpen: boolean) => {},
    isErrorSnackOpen: false,
    setIsErrorSnackOpen: (isOpen: boolean) => {},
    handleErrorSnackOpen: (text: string) => {},
    handleSuccessSnackOpen: (text: string) => {},
    handleSnacksClose: () => {},
};

export const SnackBarsContext = createContext<SnackBarsContextType>(
    defaultSnackBarsContext
);

export const SnackBarsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [successSnackText, setSuccessSnackText] = useState('');
    const [isSuccessSnackOpen, setIsSuccessSnackOpen] = useState(false);
    const [errorSnackText, setErrorSnackText] = useState('');
    const [isErrorSnackOpen, setIsErrorSnackOpen] = useState(false);

    const handleErrorSnackOpen = (text: string) => {
        setErrorSnackText(text);
        setIsSuccessSnackOpen(false);
        setIsErrorSnackOpen(true);
    };

    const handleSuccessSnackOpen = (text: string) => {
        setSuccessSnackText(text);
        setIsErrorSnackOpen(false);
        setIsSuccessSnackOpen(true);
    };

    const handleSnacksClose = () => {
        setIsErrorSnackOpen(false);
        setIsSuccessSnackOpen(false);
    };

    const contextValue: SnackBarsContextType = {
        successSnackText,
        setSuccessSnackText,
        errorSnackText,
        setErrorSnackText,
        isSuccessSnackOpen,
        setIsSuccessSnackOpen,
        isErrorSnackOpen,
        setIsErrorSnackOpen,
        handleErrorSnackOpen,
        handleSuccessSnackOpen,
        handleSnacksClose,
    };

    return (
        <SnackBarsContext.Provider value={contextValue}>
            {children}
        </SnackBarsContext.Provider>
    );
};

export const useSnackBars = () => {
    const context = useContext(SnackBarsContext);
    return context;
};
