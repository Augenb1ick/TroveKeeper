import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteBtn = ({ onClick }: { onClick: () => void }) => {
    return (
        <Button
            onClick={onClick}
            variant='contained'
            sx={{
                padding: 0,
                margin: 0,
                position: 'absolute',
                top: '5px',
                right: '5px',
                minWidth: '25px',
                minHeight: '25px',
                zIndex: 5,
            }}
        >
            <DeleteIcon sx={{ width: '20px' }} />
        </Button>
    );
};

export default DeleteBtn;
