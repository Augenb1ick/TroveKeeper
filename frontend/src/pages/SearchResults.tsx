import { Box, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { itemsApi } from '../utills/api/itemsApi';
import { ItemDataType } from '../types/dataTypes/ItemDataType';
import ItemCard from '../Components/ItemCard';
import { useTranslation } from 'react-i18next';

const SearchResults = () => {
    const { searchQuery } = useSearch();
    const [foundItems, setFoundItems] = useState<ItemDataType[]>();

    const { t } = useTranslation('translation', {
        keyPrefix: 'searchPage',
    });

    useEffect(() => {
        if (searchQuery) {
            if (searchQuery) {
                itemsApi.searchItemsByQuery(searchQuery).then((items) => {
                    setFoundItems(items);
                });
            }
        }
    }, [searchQuery]);

    return (
        <Box
            component='section'
            display='flex'
            flexDirection='column'
            width='90%'
            margin='20px auto'
            gap='30px'
        >
            <Typography component='h2' variant='h4'>
                {`${t('resultsFor')} ''${searchQuery}'':`}
            </Typography>
            <Box display='flex' flexDirection='column' gap='20px'>
                {foundItems?.length ? (
                    foundItems?.map((item) => (
                        <ItemCard key={item._id} itemId={item._id} />
                    ))
                ) : (
                    <Typography component='h2' variant='h6'>
                        {t('noResults')}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default SearchResults;
