import {
    DataGrid,
    GridRenderCellParams,
    GridRowId,
    GridRowParams,
    ruRU,
} from '@mui/x-data-grid';
import { FC, useEffect, useState } from 'react';
import {
    ADDING_FIELD_ERROR_MESSAGE,
    CREATING_ITEM_ERROR_MESSAGE,
    SERVER_ERROR_MESSAGE,
    TABLE_INITIAL_PAGE,
    TABLE_PAGE_SIZE,
    TABLE_PAGE_SIZE_OPTIONS,
} from '../utills/constants';
import { Box, Button, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogFormValues } from './CollectionDialog';
import CollectionDialog from './CollectionDialog';
import { fieldsApi } from '../utills/api/fieldsApi';
import { itemsApi } from '../utills/api/itemsApi';
import { tagsApi } from '../utills/api/tagsApi';
import { fieldValueApi } from '../utills/api/fieldValueApi';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { collectionsApi } from '../utills/api/collectionsApi';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DialogSelectsFields } from '../types/dataTypes/DialogSelectsFields';
import DownloadIcon from '@mui/icons-material/Download';
import exportFromJSON from 'export-from-json';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { handleErrorSnackOpen } from '../redux/slices/snackBarsSlice';
import { setChangedCollection } from '../redux/slices/collectionsSlice';
import { setAllItems } from '../redux/slices/itemsSlice';
import { setUpdatedTags } from '../redux/slices/tagsSlice';

export type ItemType = {
    id: string;
    name?: string;
    tags?: string[];
    [key: string]: string | string[] | undefined;
};

type tagType = {
    _id: string;
    name: string;
    itemId: string;
};

export interface TableField {
    field: string;
    headerName: string;
    width: number;
    type: string;
    id: string;
    isRequired: boolean;
}

interface CollectionField {
    _id: string;
    name: string;
    isRequired: boolean;
    isActive: boolean;
    fieldType: string;
    collectionId: string;
}

interface ItemsTableProps {
    isOwner: boolean;
    collectionId: string;
}

const ItemsTable: FC<ItemsTableProps> = ({ isOwner, collectionId }) => {
    const { t, i18n } = useTranslation('translation', {
        keyPrefix: 'collection.dialogs',
    });

    const currentLanguage = i18n.language;
    const initialTableFields = [
        {
            field: 'id',
            headerName: 'Id',
            width: 90,
            type: 'string',
            id: '1',
            isRequired: false,
        },
        {
            field: 'name',
            headerName: t('addItemDialog.name'),
            width: 130,
            type: 'string',
            id: '2',
            isRequired: true,
        },
        {
            field: 'tags',
            headerName: t('addItemDialog.tags'),
            width: 200,
            type: 'string',
            id: '3',
            isRequired: false,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as ItemType;
                const fieldValue = row.tags;
                if (fieldValue || Array.isArray(fieldValue)) {
                    return (
                        <Box width={'100%'} display={'flex'} gap={'2px'}>
                            {fieldValue.map((item: string, index: number) => (
                                <Chip
                                    key={index}
                                    sx={{ mr: 'auto' }}
                                    color='primary'
                                    label={item}
                                    size='small'
                                />
                            ))}
                        </Box>
                    );
                }
            },
        },
    ];
    const addNewFieldInputs = [initialTableFields[1]];
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const buttonTextSx = { textTransform: 'none' };

    const { tags, updatedTags } = useSelector(
        (state: RootState) => state.appTags
    );
    const { currentUser } = useSelector((state: RootState) => state.appUsers);
    const { allItems } = useSelector((state: RootState) => state.items);
    const { allCollections } = useSelector(
        (state: RootState) => state.collections
    );

    const [allTags, setAllTags] = useState<string[]>([]);
    const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);

    const [items, setItems] = useState<ItemType[]>([]);
    const [tableFields, setTableFields] =
        useState<TableField[]>(initialTableFields);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const buttonIsDisabled = !selectedItems.length;
    const defaultInputValues = selectedItems
        ? items.find((item) => item.id === selectedItems[0])
        : undefined;

    const capitalizeFirstLetter = (array: string[]) => {
        if (!array) return [];
        return array.map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1)
        );
    };

    const handleRowClick = (rowId: GridRowId[]) => {
        const selectedItemsIds: string[] = rowId.map((id) => id.toString());
        setSelectedItems(selectedItemsIds);
    };

    const handleOpenItemPage = () => {
        navigate(`/item/${selectedItems[0]}`);
    };

    const handleItemClick = (params: GridRowParams) => {
        if (isOwner) return;
        navigate(`/item/${params.id}`);
    };

    const handleOpenFieldDialog = () => {
        setFieldDialogOpen(true);
    };

    const handleOpenItemDialog = () => {
        setItemDialogOpen(true);
    };

    const handleOpenEditItemDialog = () => {
        setEditItemDialogOpen(true);
    };

    const handleCloseAllDialogs = () => {
        setItemDialogOpen(false);
        setFieldDialogOpen(false);
        setEditItemDialogOpen(false);
    };

    const getCollectionName = (collectionId: string) => {
        return (
            allCollections.find((collection) => collectionId === collection._id)
                ?.name || ''
        );
    };
    const updateItemTagsInTable = (
        itemId: string,
        tags: string[],
        action: 'add' | 'remove'
    ) => {
        setItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.id === itemId) {
                    let updatedTags: string[] = [];
                    if (action === 'remove') {
                        if (item.tags?.length)
                            updatedTags = item.tags.filter(
                                (tag) => !tags.includes(tag)
                            );
                    } else if (action === 'add') {
                        if (item.tags?.length) {
                            const uniqueTags = new Set([...item.tags, ...tags]);
                            updatedTags = [...uniqueTags];
                        } else {
                            updatedTags = tags;
                        }
                    }

                    return {
                        ...item,
                        tags: updatedTags,
                    };
                }
                return item;
            });
        });
    };

    const handleTagsCreation = async (
        tagsToCreate: string[],
        tagsToAdd: string[],
        itemId: string
    ) => {
        try {
            if (tagsToCreate.length > 0) {
                const tagsToSend = tagsToCreate.map((tag: string) => ({
                    name: tag,
                }));
                await tagsApi.createTags(tagsToSend, itemId);

                dispatch(setUpdatedTags(tagsToCreate));
            }

            if (tagsToAdd.length > 0) {
                const tagsToSend = tagsToAdd.map((tag: string) => ({
                    name: tag,
                }));
                await tagsApi.addItemsToTags(tagsToSend, itemId);
                dispatch(setUpdatedTags(tagsToAdd));
            }
            const tagsToUpdateInTable = [...tagsToCreate, ...tagsToAdd];
            updateItemTagsInTable(itemId, tagsToUpdateInTable, 'add');
        } catch (error) {
            console.log(error);
            dispatch(handleErrorSnackOpen('Failed to update tags'));
        }
    };

    const hadleTagsDeletion = async (
        tagsToRemove: string[],
        itemId: string
    ) => {
        if (tagsToRemove.length > 0) {
            const tagsToRemoveObjects = tagsToRemove.map((tag) => ({
                name: tag,
            }));

            try {
                await tagsApi.deleteTags(tagsToRemoveObjects, itemId);
                setUpdatedTags(tagsToRemove);
                updateItemTagsInTable(itemId, tagsToRemove, 'remove');
            } catch (err) {
                console.error(err);
            }
        }
    };

    const updateItemTags = async (
        selectedItemId: string,
        editedItemValues: DialogFormValues,
        originalValues: any
    ) => {
        if (originalValues.tags) {
            const originalItemTags = capitalizeFirstLetter(originalValues.tags);

            if (editedItemValues.tags) {
                const editedTags = editedItemValues.tags;
                let formTags: string[] = [];

                if (Array.isArray(editedTags)) {
                    formTags = capitalizeFirstLetter(
                        editedTags.map(
                            (obj: { value: string; label: string }) => obj.value
                        )
                    );
                } else {
                    formTags = capitalizeFirstLetter(editedTags.split(','));
                }

                const tagsToRemove = originalItemTags.filter(
                    (tag) => !formTags.includes(tag)
                );
                const newTags = formTags.filter(
                    (tag) => !originalItemTags.includes(tag)
                );
                const tagsToCreate = newTags.filter(
                    (tag) => !allTags.includes(tag)
                );
                const tagsToAdd = newTags.filter((tag) =>
                    allTags.includes(tag)
                );

                hadleTagsDeletion(tagsToRemove, selectedItemId);

                handleTagsCreation(tagsToCreate, tagsToAdd, selectedItemId);
            }
        }
    };

    const extractCustomFieldValues = (
        newItemValues: DialogFormValues
    ): { fieldId: string; fieldValue: string; field: string }[] => {
        const customFieldValues: {
            fieldId: string;
            fieldValue: string;
            field: string;
        }[] = [];

        for (const key in newItemValues) {
            if (key !== 'name' && key !== 'tags' && key !== 'id') {
                const customField = tableFields.find(
                    (field) => field.field === key
                );
                if (customField && customField.id) {
                    customFieldValues.push({
                        fieldId: customField.id,
                        fieldValue: newItemValues[key] as string,
                        field: key,
                    });
                }
            }
        }

        return customFieldValues;
    };

    const handleCustomFieldValues = async (
        customFieldValues: {
            fieldId: string;
            fieldValue: string;
            field: string;
        }[],
        itemId: string
    ) => {
        try {
            for (const el of customFieldValues) {
                if (el.fieldValue) {
                    await fieldValueApi.createFieldValue(
                        el.fieldValue,
                        itemId,
                        el.fieldId
                    );
                    updateItemsWithNewValue(itemId, el.field, el.fieldValue);
                }
            }
        } catch (error) {
            console.error('Failed to create custom field values', error);
        }
    };

    const updateItemNameIfChanged = async (
        selectedItemId: string,
        editedItemValues: DialogFormValues,
        originalValues: any
    ) => {
        if (originalValues.name !== editedItemValues.name) {
            try {
                const newValue = await itemsApi.changeItemName(
                    editedItemValues.name,
                    selectedItemId
                );
                updateItemsWithNewValue(selectedItemId, 'name', newValue.name);
            } catch (error) {
                console.error('Failed to update item name', error);
            }
        }
    };

    const updateItemsWithNewValue = (
        itemId: string,
        key: string,
        updatedValue: any
    ) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        [key]: updatedValue,
                    };
                }
                return item;
            })
        );
    };

    const updateItemFields = async (
        selectedItemId: string,
        editedItemValues: DialogFormValues,
        originalValues: any
    ) => {
        for (const key in editedItemValues) {
            if (key !== 'name' && key !== 'tags' && key !== 'id') {
                let originalFieldValue = originalValues[key];
                const noFieldValue = originalFieldValue === undefined;

                const fieldType = tableFields.find(
                    (field) => field.field === key
                )?.type;

                if (fieldType === 'checkbox') {
                    originalFieldValue = noFieldValue
                        ? 'false'
                        : originalFieldValue;
                }

                originalFieldValue ??= '';

                const newFieldValue = String(editedItemValues[key]);

                const fieldIsChanged = originalFieldValue !== newFieldValue;

                if (fieldIsChanged) {
                    const fieldId = tableFields.find(
                        (field) => field.field === key
                    )?.id;

                    if (!fieldId) return;

                    if (noFieldValue) {
                        try {
                            const updatedFieldValue =
                                await fieldValueApi.createFieldValue(
                                    newFieldValue,
                                    selectedItemId,
                                    fieldId
                                );
                            updateItemsWithNewValue(
                                selectedItemId,
                                key,
                                updatedFieldValue.value
                            );
                        } catch (error) {
                            console.error(
                                `Failed to create field ${key}`,
                                error
                            );
                        }
                    } else {
                        try {
                            const updatedFieldValue =
                                await fieldValueApi.updateFieldValue(
                                    selectedItemId,
                                    fieldId,
                                    newFieldValue
                                );
                            updateItemsWithNewValue(
                                selectedItemId,
                                key,
                                updatedFieldValue.value
                            );
                        } catch (error) {
                            console.error(
                                `Failed to update field ${key}`,
                                error
                            );
                        }
                    }
                }
            }
        }
    };

    const handleAddNewField = (value: DialogFormValues) => {
        if (!value) return;
        const fieldName = value.name;
        console.log(value);
        const isFieldAlreadyExists = tableFields.some(
            (column) =>
                column.field === fieldName || column.headerName === fieldName
        );
        if (isFieldAlreadyExists) {
            dispatch(
                handleErrorSnackOpen(
                    `Field with the name "${fieldName}" already exists`
                )
            );
            return;
        }

        fieldsApi
            .createField({
                name: fieldName,
                isRequired: value.isRequired,
                fieldType: value.type,
                collectionId: collectionId,
            })
            .then((newField) => {
                if (!newField) return;
                if (newField.fieldType === 'date') {
                    setTableFields([...tableFields, createDateField(newField)]);
                } else {
                    setTableFields([...tableFields, createField(newField)]);
                }
            })
            .catch(() => {
                dispatch(handleErrorSnackOpen(ADDING_FIELD_ERROR_MESSAGE));
            });
        handleCloseAllDialogs();
    };

    const handleAddNewItem = async (newItemValues: DialogFormValues) => {
        if (!newItemValues) return;

        const newItemName = newItemValues.name;

        const tagFromForm = newItemValues.tags || [];

        const tagsToCreate: string[] = capitalizeFirstLetter(
            tagFromForm
                .map((tag: { value: string }) => tag.value)
                .filter((tag: string) => !allTags.includes(tag))
        );

        const tagsToAdd: string[] = capitalizeFirstLetter(
            tagFromForm
                .map((tag: { value: string }) => tag.value)
                .filter((tag: string) => allTags.includes(tag))
        );

        const customFieldValues: {
            fieldId: string;
            fieldValue: string;
            field: string;
        }[] = extractCustomFieldValues(newItemValues);

        try {
            const item = await itemsApi.createItem(
                newItemName,
                collectionId,
                currentUser.name,
                getCollectionName(collectionId) || ''
            );
            dispatch(setAllItems([...allItems, item]));
            setItems((prevItems) => [
                ...prevItems,
                {
                    id: String(item._id),
                    name: newItemName,
                },
            ]);
            if (!item) throw new Error('Failed to create item');

            await collectionsApi.addItemToCollection(collectionId, item._id);

            await handleTagsCreation(tagsToCreate, tagsToAdd, item._id);
            await handleCustomFieldValues(customFieldValues, item._id);
        } catch (error) {
            dispatch(handleErrorSnackOpen(CREATING_ITEM_ERROR_MESSAGE));
            console.error(error);
        }

        handleCloseAllDialogs();
    };

    const handleEditItem = async (editedItemValues: DialogFormValues) => {
        if (!editedItemValues || selectedItems.length !== 1) return;

        const selectedItemId = selectedItems[0];
        const originalValues = items.find((item) => item.id === selectedItemId);

        if (!originalValues) return;

        await updateItemNameIfChanged(
            selectedItemId,
            editedItemValues,
            originalValues
        );
        await updateItemTags(selectedItemId, editedItemValues, originalValues);
        await updateItemFields(
            selectedItemId,
            editedItemValues,
            originalValues
        );

        handleCloseAllDialogs();
    };

    const handleDeleteItems = () => {
        if (!selectedItems.length) return;
        itemsApi
            .deleteItems(selectedItems)
            .then(() => {
                const updatedItems = items.filter(
                    (item) => !selectedItems.includes(item.id)
                );
                setItems(updatedItems);
            })
            .catch((err) => console.log(err));
        collectionsApi
            .deleteItemsFromCollection(collectionId, selectedItems)
            .then((collection) => {
                dispatch(setChangedCollection(collection._id));
            })
            .catch((err) => console.log(err));

        selectedItems.forEach((item) => {
            const originalValues = items.find(
                (originalItem) => originalItem.id === item
            );
            if (originalValues?.tags) {
                const selectedItemTags = originalValues.tags;
                const tagsToRemoveObjects = selectedItemTags.map((tag) => ({
                    name: tag,
                }));
                tagsApi
                    .deleteTags(tagsToRemoveObjects, item)
                    .catch((err) => console.log(err));
            }
        });
    };

    const createField = (field: CollectionField) => {
        const fieldName = field.name;
        const headerName =
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        return {
            field: fieldName,
            headerName: headerName,
            type: field.fieldType,
            id: field._id,
            width: 100,
            isRequired: field.isRequired,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row;
                const fieldValue = row[fieldName];

                if (field.fieldType === 'checkbox') {
                    if (fieldValue !== 'true') {
                        return <DoNotDisturbIcon sx={{ color: 'red' }} />;
                    }
                    return <TaskAltIcon sx={{ color: 'green' }} />;
                }
                return fieldValue;
            },
        };
    };

    const createDateField = (field: CollectionField) => {
        const fieldName = field.name;
        const headerName =
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        return {
            field: fieldName,
            headerName: headerName,
            type: field.fieldType,
            id: field._id,
            width: 100,
            isRequired: field.isRequired,
            valueGetter: (params: GridRenderCellParams) => {
                const row = params.row;
                const fieldValue = row[fieldName] as string | undefined;

                if (fieldValue) {
                    return new Date(fieldValue);
                }
                return '';
            },
        };
    };

    useEffect(() => {
        fieldsApi
            .getAllCollectionFields(collectionId)
            .then((fields) => {
                const newTableFields = fields.map((field: CollectionField) => {
                    if (field.fieldType === 'date') {
                        return createDateField(field);
                    } else {
                        return createField(field);
                    }
                });

                setTableFields([...initialTableFields, ...newTableFields]);
            })
            .catch(() => {
                dispatch(handleErrorSnackOpen(SERVER_ERROR_MESSAGE));
            });
    }, []);

    useEffect(() => {
        itemsApi
            .getCollectionItems(collectionId)
            .then((itemsData: ItemType[]) => {
                const promises = itemsData.map((item) =>
                    Promise.all([
                        tagsApi
                            .getItemTags(item._id as string)
                            .then((tags) => ({
                                id: item._id,
                                name: item.name,
                                tags: tags.map((tag: tagType) => tag.name),
                            })),
                        ...tableFields
                            .filter(
                                (field) =>
                                    !['id', 'tags', 'name'].includes(
                                        field.field
                                    )
                            )
                            .map((field) =>
                                fieldValueApi
                                    .getItemFieldValue(
                                        item._id as string,
                                        field.id
                                    )
                                    .then((fieldValue) => {
                                        if (!fieldValue) return;
                                        return {
                                            [field.field]: fieldValue[0],
                                        };
                                    })
                            ),
                    ]).then(([tags, ...fieldValuesArray]) => {
                        const mergedFieldValues = Object.assign(
                            {},
                            ...fieldValuesArray
                        );
                        return {
                            id: item._id,
                            name: item.name,
                            tags: tags.tags,
                            ...mergedFieldValues,
                        };
                    })
                );

                Promise.all(promises)
                    .then((transformedItems) => {
                        setItems(transformedItems);
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch(handleErrorSnackOpen(SERVER_ERROR_MESSAGE));
                    });
            })
            .catch((err) => {
                console.log(err);
                dispatch(handleErrorSnackOpen(SERVER_ERROR_MESSAGE));
            });
    }, [tableFields, items.length]);

    useEffect(() => {
        const formattedTags = tags.map((tag: any) => tag.name);
        setAllTags(formattedTags);
    }, [updatedTags.length]);

    const addFieldSelects: DialogSelectsFields = [
        {
            label: t('addFieldDialog.requiredSelectTitle'),
            selectName: 'isRequired',
            selectItems: [
                {
                    name: t('addFieldDialog.requiredSelectItemNotRequired'),
                    index: 0,
                    value: 'false',
                },
                {
                    name: t('addFieldDialog.requiredSelectItemRequired'),
                    index: 1,
                    value: 'true',
                },
            ],
            defaultValue: 'false',
        },
        {
            label: t('addFieldDialog.typeSelectTitle'),
            selectName: 'type',
            selectItems: [
                {
                    name: t('addFieldDialog.typeSelectItemText'),
                    index: 0,
                    value: 'text',
                },
                {
                    name: t('addFieldDialog.typeSelectItemNumber'),
                    index: 1,
                    value: 'number',
                },
                {
                    name: t('addFieldDialog.typeSelectItemDate'),
                    index: 2,
                    value: 'date',
                },
                {
                    name: t('addFieldDialog.typeSelectItemCheckbox'),
                    index: 3,
                    value: 'checkbox',
                },
            ],
            defaultValue: 'text',
        },
    ];

    const handleDownloadTable = () => {
        const data = items.map((item, index) => {
            return {
                '#': index + 1,
                name: item.name,
                tags: item.tags?.join(', '),
                Year: item.Year,
                'Duration (min)': item['Duration (min)'],
            };
        });
        const fileName = getCollectionName(collectionId);
        const withBOM = true;
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, fileName, exportType, withBOM });
    };

    return (
        <>
            <CollectionDialog
                dialogText={t('addFieldDialog.text')}
                dialogTitle={t('addFieldDialog.title')}
                isOpen={fieldDialogOpen}
                handleClose={handleCloseAllDialogs}
                handleSubmitDialog={handleAddNewField}
                dialogInputs={addNewFieldInputs}
                dialogSelects={addFieldSelects}
                dialogBtnAltText={t('addFieldDialog.buttonText')}
            />

            <CollectionDialog
                dialogText={t('addItemDialog.text')}
                dialogTitle={t('addItemDialog.title')}
                isOpen={itemDialogOpen}
                handleClose={handleCloseAllDialogs}
                handleSubmitDialog={handleAddNewItem}
                dialogInputs={tableFields}
                dialogBtnAltText={t('addItemDialog.buttonText')}
                isDialogTags
                allTags={allTags}
                key={
                    JSON.stringify(tableFields) +
                    JSON.stringify(allTags) +
                    JSON.stringify(updatedTags)
                }
            />
            <CollectionDialog
                dialogText={t('editItemDialog.text')}
                dialogTitle={t('editItemDialog.title')}
                dialogBtnAltText={t('editItemDialog.buttonText')}
                isOpen={editItemDialogOpen}
                handleClose={handleCloseAllDialogs}
                handleSubmitDialog={handleEditItem}
                dialogInputs={tableFields}
                dialogInputsDefaultValues={defaultInputValues}
                key={
                    JSON.stringify(defaultInputValues) +
                    JSON.stringify(allTags) +
                    JSON.stringify(updatedTags)
                }
                isDialogTags
                allTags={allTags}
            />
            {!isOwner && (
                <Button
                    onClick={handleDownloadTable}
                    variant='outlined'
                    sx={{ minWidth: 0, maxWidth: 'fit-content', ml: 'auto' }}
                    disabled={!items.length}
                >
                    <DownloadIcon />
                </Button>
            )}
            {isOwner && (
                <Box
                    display='flex'
                    flexDirection='row'
                    flexWrap='wrap'
                    gap='8px'
                >
                    <Button
                        onClick={handleOpenEditItemDialog}
                        sx={buttonTextSx}
                        variant='outlined'
                        disabled={
                            !selectedItems.length || selectedItems.length > 1
                        }
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        onClick={handleOpenItemDialog}
                        sx={buttonTextSx}
                        variant='outlined'
                    >
                        {t('buttons.addItem')}
                    </Button>
                    <Button
                        focusVisibleClassName='red'
                        autoFocus={false}
                        onClick={handleOpenFieldDialog}
                        sx={buttonTextSx}
                        variant='outlined'
                    >
                        {t('buttons.addField')}
                    </Button>
                    <Button
                        onClick={handleOpenItemPage}
                        variant='outlined'
                        sx={{ minWidth: 0 }}
                        disabled={
                            !selectedItems.length || selectedItems.length > 1
                        }
                    >
                        <OpenInNewIcon />
                    </Button>
                    <Button
                        onClick={handleDownloadTable}
                        variant='outlined'
                        sx={{ minWidth: 0 }}
                        disabled={!items.length}
                    >
                        <DownloadIcon />
                    </Button>
                    <Button
                        sx={{ minWidth: 0, ml: 'auto !important' }}
                        disabled={buttonIsDisabled}
                        variant='contained'
                        color='error'
                        onClick={handleDeleteItems}
                    >
                        <DeleteIcon />
                    </Button>
                </Box>
            )}
            <Box width='100%'>
                <DataGrid
                    disableColumnSelector={!isOwner}
                    disableRowSelectionOnClick={!isOwner}
                    checkboxSelection={isOwner}
                    onRowSelectionModelChange={handleRowClick}
                    onRowClick={handleItemClick}
                    autoHeight
                    localeText={
                        currentLanguage === 'ru'
                            ? ruRU.components.MuiDataGrid.defaultProps
                                  .localeText
                            : undefined
                    }
                    rows={items}
                    columns={tableFields}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                page: TABLE_INITIAL_PAGE,
                                pageSize: TABLE_PAGE_SIZE,
                            },
                        },
                    }}
                    pageSizeOptions={TABLE_PAGE_SIZE_OPTIONS}
                />
            </Box>
        </>
    );
};

export default ItemsTable;
