import { Box, Button, Typography } from '@mui/material';
import React, { FC } from 'react';
import ReactNiceAvatar, {
    AvatarFullConfig,
    genConfig,
} from 'react-nice-avatar';
import { useUsers } from '../context/UsersContext';

interface CommentProps {
    ownerName: string;
    commentDate: string;
    commentText: string;
    commentId: string;
    ownerId: string;
    avatarSeed: number;
    handleDeleteComment: (commentId: string) => void;
}

const Comment: FC<CommentProps> = ({
    ownerName,
    commentDate,
    commentText,
    commentId,
    avatarSeed,
    handleDeleteComment,
    ownerId,
}) => {
    const myConfig = genConfig(String(avatarSeed));
    const { currentUser } = useUsers();
    const isOwner = currentUser._id === ownerId || currentUser.role === 'admin';

    return (
        <Box
            display='flex'
            flexDirection='row'
            flexWrap={'wrap'}
            gap='20px'
            p={'10px'}
            border={'1px solid gray'}
            borderRadius={'8px'}
        >
            <ReactNiceAvatar
                style={{ width: '80px', height: '80px' }}
                {...myConfig}
            />
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                width={'400px'}
            >
                <Typography sx={{ fontWeight: 'bold' }} variant='h6'>
                    {ownerName}
                </Typography>
                <Typography sx={{ opacity: 0.7 }}>{commentDate}</Typography>
                <Typography sx={{ wordBreak: 'break-word' }}>
                    {commentText}
                </Typography>
            </Box>
            {isOwner ? (
                <Button
                    sx={{
                        ml: 'auto',
                        mb: 'auto',
                        alignSelf: 'flex-end',
                    }}
                    variant='contained'
                    onClick={() => handleDeleteComment(commentId)}
                >
                    Delete
                </Button>
            ) : (
                ''
            )}
        </Box>
    );
};

export default Comment;
