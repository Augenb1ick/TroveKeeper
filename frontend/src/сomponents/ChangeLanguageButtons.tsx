import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChangeLanguageButtons = () => {
    const { i18n } = useTranslation();
    const savedLanguage = localStorage.getItem('language');
    const [language, setLanguage] = useState(savedLanguage || 'en');

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        selectedLng: string
    ) => {
        i18n.changeLanguage(selectedLng);
        localStorage.setItem('language', selectedLng);
        setLanguage(selectedLng);
    };

    useEffect(() => {
        if (savedLanguage) i18n.changeLanguage(savedLanguage);
    }, []);

    return (
        <ToggleButtonGroup
            color='primary'
            value={language}
            exclusive
            onChange={handleChange}
            aria-label='Platform'
            sx={{ maxHeight: '40px' }}
        >
            <ToggleButton value='en'>EN</ToggleButton>
            <ToggleButton value='ru'>RU</ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ChangeLanguageButtons;
