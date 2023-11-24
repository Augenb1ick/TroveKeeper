import { Box, Typography } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import { useCollections } from '../context/CollectionsContext';
import CollectionCard from '../Components/CollectionCard';
import { TagCloud } from 'react-tagcloud';
import { useTags } from '../context/TagsContext';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../Components/ItemCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CloudTag {
    value: string;
    count: number;
}

const AllCollections = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'allCollections',
    });
    const { fiveBiggestCollections } = useCollections();
    const { fiveRecentItems } = useItems();
    const { tags } = useTags();
    const [tagCloudData, setTagCloudData] = useState<CloudTag[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const formattedTags = tags.map((tag) => {
            return {
                value: tag.name,
                count: tag.items.length,
            };
        });
        setTagCloudData(formattedTags);
    }, [tags]);

    const AllCollectionsSection = ({
        sectionTitle,
        children,
        column,
    }: {
        sectionTitle: string;
        children: ReactNode;
        column?: boolean;
    }) => {
        return (
            <Box
                component='section'
                display='flex'
                flexDirection='column'
                gap='20px'
            >
                <Typography variant='h4' component='h2'>
                    {sectionTitle}
                </Typography>
                <Box
                    display='flex'
                    flexDirection={column ? 'column' : 'row'}
                    flexWrap='wrap'
                    gap='20px'
                    mb={'20px'}
                >
                    {children}
                </Box>
            </Box>
        );
    };

    return (
        <Box
            display='flex'
            flexDirection='column'
            width='90%'
            margin='20px auto'
            flexWrap='wrap'
        >
            <AllCollectionsSection
                column
                sectionTitle={t('recentlyAddedItems')}
            >
                {fiveRecentItems.map((item) => (
                    <ItemCard itemId={item._id} key={item._id} />
                ))}
            </AllCollectionsSection>
            <AllCollectionsSection sectionTitle={t('biggestCollections')}>
                {fiveBiggestCollections.map((collection) => (
                    <CollectionCard
                        collectionPoster={collection.poster}
                        collectionName={collection.name}
                        collectionCategory={collection.category}
                        numberOfItems={collection.items.length || 0}
                        collectionId={collection._id}
                        key={collection._id}
                    />
                ))}
            </AllCollectionsSection>
            <AllCollectionsSection sectionTitle={t('popularTags')}>
                {tags.length ? (
                    <Box sx={{ cursor: 'pointer' }}>
                        <TagCloud
                            minSize={10}
                            maxSize={50}
                            tags={tagCloudData}
                            onClick={(tag: CloudTag) => {
                                navigate(`/tag/${tag.value}`);
                            }}
                        />
                    </Box>
                ) : (
                    t('noTags')
                )}
            </AllCollectionsSection>
        </Box>
    );
};

export default AllCollections;
