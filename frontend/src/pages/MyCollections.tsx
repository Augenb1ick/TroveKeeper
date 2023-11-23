import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CollectionCard from '../Components/CollectionCard';
import { collectionsApi } from '../utills/api/collectionsApi';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';
import { useCollections } from '../context/CollectionsContext';
import CreateCollectionDialog from '../Components/CreateCollectionDialog';
import { useSnackBars } from '../context/SnackBarsContext';
import { CREATING_COLLECTION_ERROR_MESSAGE } from '../utills/constants';
import { useTranslation } from 'react-i18next';

const MyCollections = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'myCollections',
    });

    const {
        usersCollections,
        setUsersCollections,
        setChangedCollection,
        changedCollection,
    } = useCollections();

    const { handleErrorSnackOpen } = useSnackBars();

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
                setUsersCollections([usersCollections, collection]);
                handleCloseDialogs();
            })
            .catch(() => {
                handleErrorSnackOpen(CREATING_COLLECTION_ERROR_MESSAGE);
            })
            .finally(() => setChangedCollection(''));
    };

    useEffect(() => {
        collectionsApi
            .getMyCollections()
            .then((collections) => {
                const activeCollections = collections.filter(
                    (collection: CollectionDataType) => collection.isActive
                );
                setUsersCollections(activeCollections.reverse());
            })
            // TODO: handle errors with snakbars
            .catch((err) => console.log(err));
    }, [changedCollection]);

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
