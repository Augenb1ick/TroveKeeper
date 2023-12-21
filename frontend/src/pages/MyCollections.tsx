import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { collectionsApi } from '../utills/api/collectionsApi';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';
import { CREATING_COLLECTION_ERROR_MESSAGE } from '../utills/constants';
import { useTranslation } from 'react-i18next';
import CreateCollectionDialog from '../сomponents/CreateCollectionDialog';
import CollectionCard from '../сomponents/CollectionCard';
import { useDispatch, useSelector } from 'react-redux';
import { handleErrorSnackOpen } from '../redux/slices/snackBarsSlice';
import { RootState } from '../redux/store';
import {
    setAllCollections,
    setUsersCollections,
} from '../redux/slices/collectionsSlice';

const MyCollections = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'myCollections',
    });

    const dispatch = useDispatch();

    const { usersCollections, allCollections } = useSelector(
        (state: RootState) => state.collections
    );

    const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
        useState(false);

    const handleCloseDialogs = () => {
        setCreateCollectionDialogOpen(false);
    };

    const handleClickAddCollection = () => {
        setCreateCollectionDialogOpen(true);
    };

    const handleCreateCollection = (data: CollectionDataType) => {
        collectionsApi
            .createCollection(data)
            .then((collection) => {
                dispatch(
                    setUsersCollections([collection, ...usersCollections])
                );
                dispatch(setAllCollections([...allCollections, collection]));
                handleCloseDialogs();
            })
            .catch(() => {
                dispatch(
                    handleErrorSnackOpen(CREATING_COLLECTION_ERROR_MESSAGE)
                );
            });
    };

    useEffect(() => {
        collectionsApi
            .getMyCollections()
            .then((collections) => {
                const activeCollections = collections.filter(
                    (collection: CollectionDataType) => collection.isActive
                );
                dispatch(setUsersCollections(activeCollections.reverse()));
            })
            // TODO: handle errors with snakbars
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <CreateCollectionDialog
                handleSubmitDialog={handleCreateCollection}
                isOpen={createCollectionDialogOpen}
                handleClose={handleCloseDialogs}
            />
            <Box
                display='flex'
                width='90%'
                margin='20px auto'
                gap='35px'
                flexWrap='wrap'
                component='section'
                alignItems='center'
                justifyContent={{ xs: 'center', sm: 'start' }}
            >
                <Typography
                    component='h1'
                    sx={{
                        flexBasis: '100%',
                        fontSize: { xs: 36, sm: 48 },
                        textAlign: { xs: 'center', sm: 'start' },
                    }}
                >
                    {t('collections')}
                </Typography>
                <Button
                    onClick={handleClickAddCollection}
                    sx={{
                        width: '200px',
                        height: '300px',
                    }}
                    variant='outlined'
                >
                    {!usersCollections.length ? t('empty') : t('addCollection')}
                </Button>
                {usersCollections
                    ? usersCollections.map((collection) => (
                          <CollectionCard
                              key={collection._id}
                              collectionId={collection._id}
                              collectionPoster={collection.poster}
                              collectionName={collection.name}
                              collectionCategory={collection.category}
                              numberOfItems={collection.items?.length || 0}
                          />
                      ))
                    : ''}
            </Box>
        </>
    );
};

export default MyCollections;
