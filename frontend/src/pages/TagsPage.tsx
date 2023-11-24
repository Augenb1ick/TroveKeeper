import { Box, Chip, Typography } from '@mui/material';
import React from 'react';
import { useItems } from '../context/ItemsContext';
import { TagDataType } from '../types/dataTypes/TagDataType';
import ItemCard from '../Components/ItemCard';
import { useTranslation } from 'react-i18next';

const TagsPage = ({ tag }: { tag: TagDataType }) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'tagPage',
    });
    const { allItems } = useItems();
    const allTagsItems = allItems.filter((item) =>
        tag.items.includes(item._id)
    );
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
                {t('title')}
                <Chip sx={{ ml: '5px' }} color='primary' label={tag.name} />
            </Typography>
            <Box display='flex' flexDirection='column' gap='20px'>
                {allTagsItems?.length ? (
                    allTagsItems?.map((item) => (
                        <ItemCard key={item._id} itemId={item._id} />
                    ))
                ) : (
                    <Typography component='h2' variant='h6'>
                        No items yet
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default TagsPage;
