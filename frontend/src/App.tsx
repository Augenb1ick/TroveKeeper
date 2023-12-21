import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import AdminPanel from './pages/AdminPanel';
import SignUp from './pages/SignUp';
import { useEffect, useState } from 'react';
import { managingUsersApi } from './utills/api/usersApi';
import Collection from './pages/Collection';
import Header from './сomponents/Header';
import MyCollections from './pages/MyCollections';
import NotFound from './pages/NotFound';
import Main from './pages/Main';
import { collectionsApi } from './utills/api/collectionsApi';
import ProtectedUsersRouteElement from './сomponents/PortectedUsersRoute';
import Snackbars from './сomponents/Snackbar';
import AllCollections from './pages/AllCollections';
import ProtectedAdminRouteElement from './сomponents/ProtectedAdminRoute';
import { CollectionDataType } from './types/dataTypes/CollectionDataType';
import { tagsApi } from './utills/api/tagsApi';
import { itemsApi } from './utills/api/itemsApi';
import ItemPage from './pages/ItemPage';
import SearchResults from './pages/SearchResults';
import Preloader from './сomponents/Preloader';
import TagsPage from './pages/TagsPage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { setCurrentUser, setIsLoggedIn } from './redux/slices/usersSlice';
import { setAllCollections } from './redux/slices/collectionsSlice';
import { setAllItems } from './redux/slices/itemsSlice';
import { setTags } from './redux/slices/tagsSlice';

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentUser, isLoggedIn } = useSelector(
        (state: RootState) => state.appUsers
    );
    const { allCollections, changedCollection } = useSelector(
        (state: RootState) => state.collections
    );
    const { allItems } = useSelector((state: RootState) => state.items);

    const { tags, updatedTags } = useSelector(
        (state: RootState) => state.appTags
    );

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            managingUsersApi
                .getCurrentUserInfo()
                .then(() => {
                    dispatch(setIsLoggedIn(true));
                    navigate(location.pathname);
                })
                .catch((err) => console.log(err));
        }
    }, []);

    useEffect(() => {
        tagsApi
            .getAllTags()
            .then((allTags) => {
                dispatch(setTags(allTags));
            })
            .catch((err) => console.log(err));
    }, [updatedTags]);

    useEffect(() => {
        if (isLoggedIn) {
            managingUsersApi
                .getCurrentUserInfo()
                .then((user) => {
                    dispatch(setCurrentUser(user));
                })
                .catch((err) => console.log(err));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        collectionsApi
            .getAllCollections()
            .then((collections) => {
                const activeCollections = collections.filter(
                    (collection: CollectionDataType) => collection.isActive
                );
                dispatch(setAllCollections(activeCollections));
            })
            .catch((err) => console.log(err));
        itemsApi
            .getAllItems()
            .then((items) => {
                dispatch(setAllItems(items));
            })
            .catch((err) => console.log(err));
    }, [changedCollection]);

    const routeContainsHeader =
        location.pathname !== '/signin' && location.pathname !== '/signup';

    return (
        <div className='App'>
            {routeContainsHeader && <Header />}
            <Snackbars />
            <Routes>
                <Route path='/signup' element={<SignUp />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/' element={<Main />} />
                <Route path='/search' element={<SearchResults />} />
                <Route
                    path='/my-collections'
                    element={
                        <ProtectedUsersRouteElement
                            element={<MyCollections />}
                        />
                    }
                />
                {allCollections.length > 0 ? (
                    allCollections.map((collection) => (
                        <Route
                            key={collection._id}
                            path={`/collection/${collection._id}`}
                            element={<Collection id={collection._id} />}
                        />
                    ))
                ) : (
                    <Route path='/collection/:id' element={<Preloader />} />
                )}
                <Route path='/all-collections' element={<AllCollections />} />
                {currentUser.role && (
                    <Route
                        path='/admin-panel'
                        element={
                            <ProtectedAdminRouteElement
                                element={<AdminPanel />}
                            />
                        }
                    />
                )}
                {allItems.length > 0 ? (
                    allItems.map((item) => (
                        <Route
                            key={item._id}
                            path={`/item/${item._id}`}
                            element={<ItemPage itemId={item._id} />}
                        />
                    ))
                ) : (
                    <Route path='/item/:id' element={<Preloader />} />
                )}
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <Route
                            key={tag._id}
                            path={`/tag/${tag.name}`}
                            element={<TagsPage tag={tag} />}
                        />
                    ))
                ) : (
                    <Route path='/tag/:id' element={<Preloader />} />
                )}

                <Route path='*' element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
