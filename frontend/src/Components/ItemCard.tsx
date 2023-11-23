import { Box, IconButton, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ItemDataType } from '../types/dataTypes/ItemDataType';
import { itemsApi } from '../utills/api/itemsApi';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';
import { useCollections } from '../context/CollectionsContext';
import AddPosterComponent from './AddPosterComponent';
import { useUsers } from '../context/UsersContext';
import { useSnackBars } from '../context/SnackBarsContext';

import { useTranslation } from 'react-i18next';

interface ItemCardInterface {
    itemId: string;
    handleChangePoster?: (poster: string) => void;
}

const ItemCard: FC<ItemCardInterface> = ({ itemId, handleChangePoster }) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'itemCard',
    });
    const [itemData, setItemData] = useState<ItemDataType>();
    const { currentUser, isLoggedIn } = useUsers();
    const currentUserId = currentUser._id;
    const itemIsLikedByCurrentUser =
        itemData?.likes.includes(currentUserId) || false;
    const [itemIsLiked, setItemIsLiked] = useState(itemIsLikedByCurrentUser);
    const [itemCollection, setItemCollection] = useState<CollectionDataType>(
        {} as CollectionDataType
    );
    const { allCollections } = useCollections();

    const { handleErrorSnackOpen } = useSnackBars();
    const location = useLocation();
    const navigate = useNavigate();

    const isOwner =
        currentUserId === itemCollection.owner || currentUser.role === 'admin';

    const itemPage = `/item/${itemId}`;
    const isItemsPage = location.pathname === itemPage;

    const handleCardClick = () => {
        if (isItemsPage) return;
        navigate(itemPage);
    };

    const handleLikeClick = () => {
        if (!isLoggedIn) {
            handleErrorSnackOpen(t('noAuthLike'));
            return;
        } else {
            itemsApi
                .changeLikeItemStatus(itemId, itemIsLiked)
                .then((item) => {
                    const isLiked = item.likes.some(
                        (i: string) => i === currentUser._id
                    );
                    setItemIsLiked(isLiked);
                })
                .catch(() => handleErrorSnackOpen(t('likeError')));
        }
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
                    setItemCollection(foundCollection);
                }

                setItemData(item);
                const isLiked = item.likes.some(
                    (i: string) => i === currentUser._id
                );
                setItemIsLiked(isLiked);
            })
            .catch((err) => console.log(err));
    }, [itemIsLiked]);

    return (
        <Box
            p={'10px'}
            border={'1px solid gray'}
            borderRadius={'8px'}
            display={'flex'}
            flexWrap='wrap'
            gap='20px'
            alignItems={'center'}
            onClick={handleCardClick}
            sx={{ cursor: `${isItemsPage ? '' : 'pointer'}` }}
        >
            <Box>
                {itemData && (
                    <AddPosterComponent
                        posterSize={150}
                        disabled={
                            !isOwner || !isItemsPage || !handleChangePoster
                        }
                        defaultPoster={itemData?.poster}
                        getPoster={(newPoster) => {
                            if (handleChangePoster) {
                                handleChangePoster(newPoster);
                            }
                        }}
                    />
                )}
            </Box>
            <Box>
                <Typography component='h1' variant='h3'>
                    {itemData?.name || ''}
                </Typography>
                <Box
                    display={'flex'}
                    columnGap='10px'
                    alignItems='center'
                    justifyItems={'start'}
                    flexDirection={{ xs: 'column', sm: 'row' }}
                >
                    <Typography
                        variant='h5'
                        textAlign='start'
                        alignSelf='flex-start'
                    >
                        {t('fromCollection')}
                    </Typography>
                    <Typography
                        variant='h6'
                        textAlign='start'
                        alignSelf='flex-start'
                    >
                        <Link
                            style={{ color: 'rgb(70 168 246)' }}
                            onClick={(e) => e.stopPropagation()}
                            to={`/collection/${itemCollection._id}`}
                        >
                            {itemData?.collectionName}
                        </Link>
                    </Typography>
                </Box>
                <Box display={'flex'} gap='10px' alignItems='center'>
                    <Typography variant='h5'>{t('createdBy')}</Typography>
                    <Typography variant='h6' color='primary'>
                        {itemData?.ownerName}
                    </Typography>
                </Box>
                <Box display='flex' alignItems='center'>
                    {itemData?.likes.length || 0}
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLikeClick();
                        }}
                        color='primary'
                    >
                        {' '}
                        {itemIsLiked ? (
                            <FavoriteIcon />
                        ) : (
                            <FavoriteBorderIcon />
                        )}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ItemCard;
