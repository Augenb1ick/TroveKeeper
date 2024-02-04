interface UsersTableProps {
    handleDeleteUsers: (usersIds: string[]) => void;
    handleBlockUsers: (usersIds: string[]) => void;
    handleUnblockUsers: (usersIds: string[]) => void;
    handleAssignAdmin: (usersIds: string[]) => void;
    handleDemoteAdmin: (usersIds: string[]) => void;
    isLoading: boolean;
}

export default UsersTableProps;
