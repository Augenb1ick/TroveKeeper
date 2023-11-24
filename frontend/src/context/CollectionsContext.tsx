import React, { createContext, useState, ReactNode, useContext } from 'react';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';

interface CollectionContextType {
    allCollections: CollectionDataType[];
    usersCollections: CollectionDataType[];
    fiveRecentCollections: CollectionDataType[];
    fiveBiggestCollections: CollectionDataType[];
    changedCollection: string;
    setChangedCollection: React.Dispatch<React.SetStateAction<string>>;
    setAllCollections: React.Dispatch<
        React.SetStateAction<CollectionDataType[]>
    >;
    setUsersCollections: React.Dispatch<
        React.SetStateAction<CollectionDataType[]>
    >;
}

const defaultCollectionContext: CollectionContextType = {
    allCollections: [],
    usersCollections: [],
    fiveRecentCollections: [],
    fiveBiggestCollections: [],
    changedCollection: '',
    setChangedCollection: () => {},
    setAllCollections: () => {},
    setUsersCollections: () => {},
};

export const CollectionsContext = createContext<CollectionContextType>(
    defaultCollectionContext
);

export const CollectionsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [allCollections, setAllCollections] = useState<CollectionDataType[]>(
        []
    );
    const [usersCollections, setUsersCollections] = useState<
        CollectionDataType[]
    >([]);
    const [changedCollection, setChangedCollection] = useState<string>('');

    const fiveRecentCollections = allCollections.slice().reverse().slice(0, 5);
    const fiveBiggestCollections = allCollections
        .sort((a, b) => b.items.length - a.items.length)
        .slice(0, 5);

    const contextValue: CollectionContextType = {
        fiveRecentCollections,
        fiveBiggestCollections,
        allCollections,
        setAllCollections,
        usersCollections,
        setUsersCollections,
        changedCollection,
        setChangedCollection,
    };

    return (
        <CollectionsContext.Provider value={contextValue}>
            {children}
        </CollectionsContext.Provider>
    );
};

export const useCollections = () => {
    const context = useContext(CollectionsContext);
    return context;
};
