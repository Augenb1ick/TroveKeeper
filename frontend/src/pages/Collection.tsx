import { ChangeEvent, FC, useState } from 'react';
import { Box, Button } from '@mui/material';
import ItemsTable from '../Components/ItemsTable';
import EditableField from '../Components/EditableField';
import {
    COLLECTION_FIELD_MAPPINGS,
    UPDATING_COLLECTION_ERROR_MESSAGE,
    DELETING_COLLECTION_ERROR_MESSAGE,
} from '../utills/constants';
import AddPosterComponent from '../Components/AddPosterComponent';
import { collectionsApi } from '../utills/api/collectionsApi';
import { useCollections } from '../context/CollectionsContext';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';
import { useUsers } from '../context/UsersContext';
import { useSnackBars } from '../context/SnackBarsContext';
import ConfirmationDialog from '../Components/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import CategoriesMenu from '../Components/CategoriesMenu';
import { useTranslation } from 'react-i18next';

interface CollectionProps {
    id: string;
}

interface CollectionFields {
    [key: string]: string | number;

    description: string;
    name: string;
    poster: string;
    category: number;
}

const Collection: FC<CollectionProps> = ({ id }) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'collection',
    });
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] =
        useState(false);
    const { allCollections, setChangedCollection } = useCollections();
    const { currentUser } = useUsers();
    const { handleErrorSnackOpen } = useSnackBars();
    const navigate = useNavigate();

    const getCollection = (id: string) => {
        return (
            allCollections.find((item) => item._id === id) ||
            ({} as CollectionDataType)
        );
    };

    const currentCollection = getCollection(id);
    const isOwner =
        currentUser._id === currentCollection.owner ||
        currentUser.role === 'admin';

    const [collectionFields, setCollectionFields] = useState<CollectionFields>({
        description: currentCollection.description,
        name: currentCollection.name,
        poster: currentCollection.poster,
        category: currentCollection.category,
    });

    const handleChangeCollectionCategory = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const newCategory = event.target.value;
        handleFieldUpdate('category', newCategory);
    };

    const handleFieldUpdate = (fieldType: string, newValue: string) => {
        if (!newValue) return;
        const apiField = COLLECTION_FIELD_MAPPINGS[fieldType];

        if (newValue === collectionFields[apiField]) {
            return;
        }

        if (apiField) {
            collectionsApi
                .updateCollection(id, apiField, newValue)
                .then((res) => {
                    if (res) {
                        setCollectionFields((prevFields) => ({
                            ...prevFields,
                            [apiField]: res[apiField],
                        }));
                    }
                })
                .catch(() =>
                    handleErrorSnackOpen(UPDATING_COLLECTION_ERROR_MESSAGE)
                );
        }
    };

    const handleClickDeleteBtn = () => {
        setConfirmDeleteDialogOpen(true);
    };

    const handleCloseDialogs = () => {
        setConfirmDeleteDialogOpen(false);
    };

    const handleConfirmDeleteCollection = () => {
        collectionsApi
            .deleteCollection(id)
            .then((collection) => {
                setChangedCollection(collection._id);
                navigate('/my-collections');
            })
            .catch(() => {
                handleErrorSnackOpen(DELETING_COLLECTION_ERROR_MESSAGE);
            })
            .finally(() => handleCloseDialogs());
    };

    return (
        <>
            <ConfirmationDialog
                isOpen={confirmDeleteDialogOpen}
                handleClose={handleCloseDialogs}
                handleConfirm={handleConfirmDeleteCollection}
            />
            <Box
                margin='10px auto'
                display='flex'
                maxWidth='90%'
                flexDirection='column'
                gap={2}
            >
                <Box
                    display='flex'
                    flexDirection={{ xs: 'column-reverse', sm: 'row' }}
                    gap={3}
                    justifyContent='space-between'
                    alignItems='start'
                >
                    <Box display='flex' flexDirection='column' gap={2}>
                        <EditableField
                            typographyVariant='h4'
                            initialValue={collectionFields.name}
                            onUpdate={(newValue) =>
                                handleFieldUpdate('name', newValue)
                            }
                            key={collectionFields.name}
                            disabled={!isOwner}
                        />
                        <EditableField
                            initialValue={collectionFields.description}
                            onUpdate={(newValue) =>
                                handleFieldUpdate('description', newValue)
                            }
                            key={collectionFields.description}
                            disabled={!isOwner}
                        />
                        <CategoriesMenu
                            onChange={handleChangeCollectionCategory}
                            defaultValue={collectionFields.category}
                            key={collectionFields.category}
                        />
                    </Box>
                    <AddPosterComponent
                        posterSize={300}
                        disabled={!isOwner}
                        key={collectionFields.poster}
                        defaultPoster={collectionFields.poster}
                        getPoster={(newPoster) =>
                            handleFieldUpdate('poster', newPoster)
                        }
                    />
                </Box>
                <ItemsTable collectionId={id} isOwner={isOwner} />
                {isOwner && (
                    <Button
                        onClick={handleClickDeleteBtn}
                        sx={{ alignSelf: 'end', textTransform: 'none' }}
                        variant='outlined'
                        color='error'
                    >
                        {t('deleteCollectionButtonText')}
                    </Button>
                )}
            </Box>
        </>
    );
};

export default Collection;
