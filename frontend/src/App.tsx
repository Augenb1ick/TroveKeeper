import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import AdminPanel from './pages/AdminPanel';
import SignUp from './pages/SignUp';
import { useUsers } from './context/UsersContext';
import { useEffect, useState } from 'react';
import { managingUsersApi } from './utills/api/usersApi';
import Collection from './pages/Collection';
import Header from './Components/Header';
import MyCollections from './pages/MyCollections';
import NotFound from './pages/NotFound';
import Main from './pages/Main';
import { useCollections } from './context/CollectionsContext';
import { collectionsApi } from './utills/api/collectionsApi';
import ProtectedUsersRouteElement from './Components/PortectedUsersRoute';
import Snackbars from './Components/Snackbar';
import AllCollections from './pages/AllCollections';
import ProtectedAdminRouteElement from './Components/ProtectedAdminRoute';
import { CollectionDataType } from './types/dataTypes/CollectionDataType';
import { useTags } from './context/TagsContext';
import { tagsApi } from './utills/api/tagsApi';
import { itemsApi } from './utills/api/itemsApi';
import ItemPage from './pages/ItemPage';
import { useItems } from './context/ItemsContext';
import SearchResults from './pages/SearchResults';
import Preloader from './Components/Preloader';
import TagsPage from './pages/TagsPage';

function App() {
    const { setIsLoggedIn, setCurrentUser, isLoggedIn, currentUser } =
        useUsers();
    const { allCollections, setAllCollections, changedCollection } =
        useCollections();
    const { setTags, tags, updatedTags } = useTags();
    const { allItems, setAllItems } = useItems();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            managingUsersApi
                .getCurrentUserInfo()
                .then(() => {
                    setIsLoggedIn(true);
                    setIsLoading(false);
                    navigate(location.pathname);
                })
                .catch((err) => console.log(err))
                .finally(() => setIsLoading(false));
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        tagsApi
            .getAllTags()
            .then((allTags) => {
                setTags(allTags);
                setIsLoading(false);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    }, [updatedTags]);

    useEffect(() => {
        setIsLoading(true);
        if (isLoggedIn) {
            managingUsersApi
                .getCurrentUserInfo()
                .then((user) => {
                    setCurrentUser(user);
                    setIsLoading(false);
                })
                .catch((err) => console.log(err))
                .finally(() => setIsLoading(false));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        setIsLoading(true);
        collectionsApi
            .getAllCollections()
            .then((collections) => {
                const activeCollections = collections.filter(
                    (collection: CollectionDataType) => collection.isActive
                );
                setAllCollections(activeCollections);
                setIsLoading(false);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
        setIsLoading(true);
        itemsApi
            .getAllItems()
            .then((items) => {
                setAllItems(items);
                setIsLoading(false);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
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
