import React, { createContext, useState, ReactNode, useContext } from 'react';

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const defaultSearchContext: SearchContextType = {
    searchQuery: '',
    setSearchQuery: () => {},
};

export const SearchContext =
    createContext<SearchContextType>(defaultSearchContext);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [searchQuery, setSearchQuery] = useState<string>(
        localStorage.getItem('last-search-query') || ''
    );

    const contextValue: SearchContextType = {
        searchQuery,
        setSearchQuery,
    };

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    return context;
};
