'use client';

import { HomePrebookPopup } from './HomePrebookPopup';
import { useHomePrebookPopup } from '@/hooks/useHomePrebookPopup';

export function HomePrebookPopupWrapper() {
    const { isOpen, handleClose } = useHomePrebookPopup(3000);

    return (
        <HomePrebookPopup
            isOpen={isOpen}
            onClose={handleClose}
        />
    );
}
