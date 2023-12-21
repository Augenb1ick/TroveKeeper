import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CollecctionCardProps {
    collectionPoster: string;
    collectionName: string;
    collectionCategory: number;
    numberOfItems: number;
    collectionId: string;
}

const CollectionCard: FC<CollecctionCardProps> = ({
    collectionPoster,
    collectionName,
    collectionCategory,
    numberOfItems,
    collectionId,
}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/collection/${collectionId}`);
    };

    const { t } = useTranslation('translation', {
        keyPrefix: 'myCollections',
    });

    const collectionCategories = [
        { name: t('categorySelectItemNoCategory'), value: 0 },
        { name: t('categorySelectItemBooks'), value: 1 },
        { name: t('categorySelectItemFilms'), value: 2 },
        { name: t('categorySelectItemStamps'), value: 3 },
        { name: t('categorySelectItemOther'), value: 4 },
    ];

    function getCategoryName(categoryValue: number) {
        const selectedCategory = collectionCategories.find(
            (category) => category.value === categoryValue
        );
        return selectedCategory
            ? selectedCategory.name
            : t('categorySelectItemNoCategory');
    }

    return (
        <Box
            sx={{ cursor: 'pointer' }}
            width='200px'
            height='300px'
            border='1px solid #90caf9'
            borderRadius='5px'
            display='flex'
            flexDirection='column'
            position='relative'
        >
            <img
                style={{
                    height: '150px',
                    width: '198px',
                    objectFit: 'cover',
                    borderRadius: '5px 5px 0 0',
                }}
                src={collectionPoster}
                alt='collection-poster'
                onClick={handleCardClick}
            />
            <Box
                padding='10px'
                display='flex'
                flexDirection='column'
                gap='10px'
                onClick={handleCardClick}
            >
                <Typography
                    sx={{
                        maxWidth: '160px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                    }}
                    variant='h5'
                >
                    {collectionName}
                </Typography>
                <Typography
                    sx={{
                        padding: '8px',
                        textAlign: 'start',
                        backgroundColor: '#1976d2',
                        maxWidth: 'fit-content',
                        borderRadius: '5px',
                    }}
                >
                    {getCategoryName(collectionCategory)}
                </Typography>
                <Typography>
                    {t('itemsQuantity')} {numberOfItems}
                </Typography>
            </Box>
        </Box>
    );
};

export default CollectionCard;
