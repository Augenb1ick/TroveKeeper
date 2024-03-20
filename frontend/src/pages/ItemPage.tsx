import { Box, Chip, IconButton, TextField, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { TagDataType } from '../types/dataTypes/TagDataType';
import { itemsApi } from '../utills/api/itemsApi';
import { CollectionDataType } from '../types/dataTypes/CollectionDataType';
import { useNavigate } from 'react-router-dom';
import { fieldValueApi } from '../utills/api/fieldValueApi';
import { fieldsApi } from '../utills/api/fieldsApi';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {
    API_URL,
    UPDATING_ITEM_POSTER_ERROR_MESSAGE,
} from '../utills/constants';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { formatDate } from '../utills/formatDate';
import SendIcon from '@mui/icons-material/Send';
import ItemCard from '../сomponents/ItemCard';
import Comment from '../сomponents/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { handleErrorSnackOpen } from '../redux/slices/snackBarsSlice';

interface CommentDataType {
    _id: string;
    itemId: string;
    owner: string;
    ownerName: string;
    text: string;
    createdAt: string;
}

interface ItemPageProps {
    itemId: string;
}

const ItemPage: FC<ItemPageProps> = ({ itemId }) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'itemPage',
    });
    const { allCollections } = useSelector(
        (state: RootState) => state.collections
    );
    const { tags } = useSelector((state: RootState) => state.appTags);
    const { currentUser, isLoggedIn } = useSelector(
        (state: RootState) => state.appUsers
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [itemTags] = useState<TagDataType[]>(
        tags.filter((tag) => tag.items.includes(itemId))
    );

    const [itemsTable, setItemTable] = useState<{ [key: string]: string }[]>(
        []
    );
    const [socket, setSocket] = useState<any>(null);
    const [comments, setComments] = useState<CommentDataType[]>([]);
    const [userComment, setUserComment] = useState('');

    const handleChangeItemPoster = (poster: string) => {
        if (!poster) return;
        itemsApi
            .changeItemPoster(poster, itemId)
            .catch(() =>
                dispatch(
                    handleErrorSnackOpen(UPDATING_ITEM_POSTER_ERROR_MESSAGE)
                )
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

    useEffect(() => {
        const newSocket = io(API_URL);

        newSocket.on('connect', () => {
            console.log('Connected to socket');
            newSocket.emit('joinItemRoom', itemId);
        });

        newSocket.on('allComments', (commentsData: CommentDataType[]) => {
            setComments(commentsData);
        });

        newSocket.on('newComment', (newComment: CommentDataType) => {
            setComments((prevComments) => [...prevComments, newComment]);
        });
        newSocket.on('deleteComment', (deletedCommentId: string) => {
            setComments((prevComments) =>
                prevComments.filter(
                    (comment) => comment._id !== deletedCommentId
                )
            );
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [itemId]);

    const handleAddComment = () => {
        if (!userComment) return;
        if (socket) {
            socket.emit('addComment', {
                itemId,
                owner: currentUser._id,
                ownerName: currentUser.name,
                text: userComment,
            });
            setUserComment('');
        }
    };

    const handleDeleteComment = (commentId: string) => {
        if (socket) {
            socket.emit('deleteComment', { itemId, commentId });
        }
    };

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
            <Typography variant='h6'>{t('info')}</Typography>
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

            <Typography variant='h6'>{t('comments')}</Typography>
            <Box display='flex' flexDirection={'column'} gap='20px'>
                {comments.length
                    ? comments.map(
                          (comment: CommentDataType, index: number) => (
                              <Comment
                                  key={index}
                                  avatarSeed={index}
                                  ownerName={comment.ownerName}
                                  ownerId={comment.owner}
                                  commentDate={formatDate(comment.createdAt)}
                                  commentText={comment.text}
                                  commentId={comment._id}
                                  handleDeleteComment={handleDeleteComment}
                              />
                          )
                      )
                    : t('noComments')}
            </Box>
            {isLoggedIn && (
                <Box
                    display={'flex'}
                    flexDirection={'row'}
                    flexWrap={'wrap'}
                    gap='20px'
                    width={'100%'}
                >
                    <TextField
                        sx={{ width: 'calc(100% - 80px)' }}
                        placeholder='Add comment'
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleAddComment();
                            }
                        }}
                        value={userComment}
                        onChange={(event) => {
                            setUserComment(event.target.value);
                        }}
                    />
                    <IconButton sx={{ p: '15px' }} onClick={handleAddComment}>
                        <SendIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default ItemPage;
