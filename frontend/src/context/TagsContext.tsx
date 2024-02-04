import React, { createContext, useState, ReactNode, useContext } from 'react';
import { TagDataType } from '../types/dataTypes/TagDataType';

interface TagContextType {
    tags: TagDataType[];
    setTags: React.Dispatch<React.SetStateAction<TagDataType[]>>;
    updatedTags: string[];
    setUpdatedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const defaultTagsContext: TagContextType = {
    tags: [],
    setTags: () => {},
    updatedTags: [],
    setUpdatedTags: () => {},
};

export const TagsContext = createContext<TagContextType>(defaultTagsContext);

export const TagsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [tags, setTags] = useState<TagDataType[]>([]);
    const [updatedTags, setUpdatedTags] = useState([] as string[]);

    const contextValue: TagContextType = {
        tags,
        setTags,
        updatedTags,
        setUpdatedTags,
    };

    return (
        <TagsContext.Provider value={contextValue}>
            {children}
        </TagsContext.Provider>
    );
};

export const useTags = () => {
    const context = useContext(TagsContext);
    return context;
};
