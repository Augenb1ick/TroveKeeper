import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../redux/slices/searchSlice';

interface SearchQuery {
    searchQuery: string;
}

const SearchInput = () => {
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    const { t } = useTranslation('translation', { keyPrefix: 'header' });

    const { register, handleSubmit } = useForm<SearchQuery>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const isSearchPage = location.pathname === '/search';

    const onSubmit: SubmitHandler<SearchQuery> = (data) => {
        const inputSearchQuery = data.searchQuery;
        if (!inputSearchQuery) return;
        dispatch(setSearchQuery(inputSearchQuery));
        localStorage.setItem('last-search-query', inputSearchQuery);
        if (!isSearchPage) navigate('/search');
    };

    return (
        <Search sx={{ order: 3 }}>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                <StyledInputBase
                    {...register('searchQuery')}
                    type='search'
                    placeholder={t('searchInput')}
                    inputProps={{ 'aria-label': 'search' }}
                    autoComplete='off'
                />
            </Box>
        </Search>
    );
};

export default SearchInput;
