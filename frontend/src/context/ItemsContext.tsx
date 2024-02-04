import React, { createContext, useState, ReactNode, useContext } from 'react';
import { ItemDataType } from '../types/dataTypes/ItemDataType';

interface ItemContextType {
    allItems: ItemDataType[];
    fiveRecentItems: ItemDataType[];
    setAllItems: React.Dispatch<React.SetStateAction<ItemDataType[]>>;
}

const defaultItemContext: ItemContextType = {
    allItems: [],
    fiveRecentItems: [],
    setAllItems: () => {},
};

export const ItemsContext = createContext<ItemContextType>(defaultItemContext);

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [allItems, setAllItems] = useState<ItemDataType[]>([]);

    const fiveRecentItems = allItems.slice().reverse().slice(0, 5);

    const contextValue: ItemContextType = {
        allItems,
        setAllItems,
        fiveRecentItems,
    };

    return (
        <ItemsContext.Provider value={contextValue}>
            {children}
        </ItemsContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemsContext);
    return context;
};
