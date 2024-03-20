import { Box, Button } from '@mui/material';
import { storage } from '../configs/firebaseconfig';
import UploadIcon from '@mui/icons-material/Upload';

import React, { FC, useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import CircularProgressComponent from './CircularProgress';
import DeleteBtn from './DeleteBtn';
import { useTranslation } from 'react-i18next';

interface AddPosterComponent {
    getPoster: (poster: string) => void;
    defaultPoster?: string;
    disabled?: boolean;
    posterSize?: number;
}

const AddPosterComponent: FC<AddPosterComponent> = ({
    getPoster,
    defaultPoster,
    disabled,
    posterSize,
}) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'addPoster',
    });
    const [collectionPoster, setPoster] = useState(defaultPoster || '');
    const [uploadPropgress, setUploadProgress] = useState(0);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        uploadFileToCloud(file);
    };

    const uploadFileToCloud = (file: File) => {
        if (!file) return;

        const storageRef = ref(storage, `/files/images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setUploadProgress(progress);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) =>
                    setPoster(url)
                );
            }
        );
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        uploadFileToCloud(file);
        setIsDraggingOver(false);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    useEffect(() => {
        if (!collectionPoster || collectionPoster === defaultPoster) return;
        getPoster(collectionPoster);
    }, [collectionPoster]);

    return (
        <div>
            {collectionPoster ? (
                <Box sx={{ position: 'relative' }}>
                    <img
                        style={{
                            height: `${posterSize || 200}px`,
                            width: `${posterSize || 200}px`,
                            objectFit: 'cover',
                            borderRadius: '10px',
                        }}
                        src={collectionPoster}
                        alt='poster'
                    />

                    {!disabled && (
                        <DeleteBtn
                            onClick={() => {
                                setPoster('');
                            }}
                        />
                    )}
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center',
                        height: `${posterSize || 200}px`,
                        width: `${posterSize || 200}px`,
                        border: isDraggingOver
                            ? '2px dashed #1F2227'
                            : '2px solid #1F2227',
                        transition: 'opacity 0.3s ease-in-out',
                        borderRadius: '10px',
                        justifyContent: 'center',
                        position: 'relative',
                        opacity: isDraggingOver ? 0.7 : 1,
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {uploadPropgress !== 0 && uploadPropgress !== 100 ? (
                        <CircularProgressComponent value={uploadPropgress} />
                    ) : (
                        <>
                            <p
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                {t('addPoster')}
                            </p>
                            <Button
                                variant='contained'
                                component='label'
                                sx={{ maxWidth: '90%' }}
                                endIcon={<UploadIcon />}
                            >
                                {t('uploadButtonText')}
                                <input
                                    type='file'
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </Button>
                        </>
                    )}
                </Box>
            )}
        </div>
    );
};

export default AddPosterComponent;
