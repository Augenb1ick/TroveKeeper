import { Box, Chip, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { TagDataType } from '../types/dataTypes/TagDataType';
import { itemsApi } from '../utills/api/itemsApi';
import { useCollections } from '../context/CollectionsContext';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';
import { useTags } from '../context/TagsContext';
import { useNavigate } from 'react-router-dom';
import { fieldValueApi } from '../utills/api/fieldValueApi';
import { fieldsApi } from '../utills/api/fieldsApi';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ItemCard from '../Components/ItemCard';
import { useSnackBars } from '../context/SnackBarsContext';
import { UPDATING_ITEM_POSTER_ERROR_MESSAGE } from '../utills/constants';
import { useTranslation } from 'react-i18next';

interface ItemPageProps {
    itemId: string;
}

const ItemPage: FC<ItemPageProps> = ({ itemId }) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'itemPage',
    });
    const { allCollections } = useCollections();
    const { tags } = useTags();
    const { handleErrorSnackOpen } = useSnackBars();
    const navigate = useNavigate();

    const [itemTags] = useState<TagDataType[]>(
        tags.filter((tag) => tag.items.includes(itemId))
    );

    const [itemsTable, setItemTable] = useState<{ [key: string]: string }[]>(
        []
    );

    const handleChangeItemPoster = (poster: string) => {
        if (!poster) return;
        itemsApi
            .changeItemPoster(poster, itemId)
            .catch(() =>
                handleErrorSnackOpen(UPDATING_ITEM_POSTER_ERROR_MESSAGE)
            );
    };

    useEffect(() => {
        itemsApi
            .getItemInfo(itemId)
            .then((foundItem) => {
                const item = foundItem[0];
                const foundCollection = allCollections.find(
                    (collection: CollectionDataType) =>
                        collection._id === item.collectionId
                );

                if (foundCollection) {
                    fieldsApi
                        .getAllCollectionFields(foundCollection._id)
                        .then((fields) => {
                            const promises = fields.map((field: any) =>
                                fieldValueApi.getItemFieldValue(
                                    itemId,
                                    field._id
                                )
                            );

                            Promise.all(promises)
                                .then((fieldValues) => {
                                    const modifiedFields = fields.map(
                                        (field: any, index: number) => ({
                                            ...field,
                                            fieldValue:
                                                fieldValues[index][0] || '',
                                        })
                                    );

                                    setItemTable(modifiedFields);
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <Box
            component='section'
            display='flex'
            flexDirection='column'
            width='90%'
            margin='20px auto'
            gap='30px'
        >
            <ItemCard
                handleChangePoster={handleChangeItemPoster}
                itemId={itemId}
            />
            {itemTags.length ? (
                <Box
                    display='flex'
                    gap='10px'
                    width='100%'
                    justifyContent={'center'}
                >
                    {itemTags.map((tag, index: number) => (
                        <Chip
                            clickable
                            color='primary'
                            key={index}
                            label={tag.name}
                            onClick={() => {
                                navigate(`/tag/${tag.name}`);
                            }}
                        />
                    ))}
                </Box>
            ) : (
                ''
            )}
            {t('info')}
            <Box
                display='flex'
                flexDirection='row'
                p={'10px'}
                border={'1px solid gray'}
                borderRadius={'8px'}
                gap='60px'
            >
                {itemsTable.length ? (
                    <>
                        <Box display='flex' flexDirection='column' gap='10px'>
                            {itemsTable.map((el, index: number) =>
                                el.fieldType === 'checkbox' || el.fieldValue ? (
                                    <Typography
                                        sx={{ fontWeight: 'bold' }}
                                        key={index}
                                    >
                                        {el.name}
                                    </Typography>
                                ) : null
                            )}
                        </Box>
                        <Box display='flex' flexDirection='column' gap='10px'>
                            {itemsTable.map((el: any, index: number) =>
                                el.fieldType === 'checkbox' ? (
                                    el.fieldValue === false ||
                                    el.fieldValue === '' ? (
                                        <DoNotDisturbIcon
                                            sx={{ color: 'red' }}
                                            key={index}
                                        />
                                    ) : (
                                        <TaskAltIcon
                                            sx={{ color: 'green' }}
                                            key={index}
                                        />
                                    )
                                ) : el.fieldType !== 'checkbox' &&
                                  el.fieldValue ? (
                                    <Typography key={index}>
                                        {el.fieldValue}
                                    </Typography>
                                ) : null
                            )}
                        </Box>
                    </>
                ) : (
                    <Typography p='30px 0'>{t('noInfo')}</Typography>
                )}
            </Box>
            {t('comments')}
            <Box p={'10px'} border={'1px solid gray'} borderRadius={'8px'}>
                {t('noComments')}
            </Box>
        </Box>
    );
};

export default ItemPage;
