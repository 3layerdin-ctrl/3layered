'use client';

import { useEffect } from 'react';
import { PrebookPopup } from '@/components/PrebookPopup';
import { getPrebookPopupProduct } from '@/data/prebook-popup-config';
import { usePrebookPopup } from '@/hooks/usePrebookPopup';

interface PrebookPopupWrapperProps {
    productSlug: string;
    isPrebook?: boolean;
}

export function PrebookPopupWrapper({ productSlug, isPrebook }: PrebookPopupWrapperProps) {
    const popupProduct = getPrebookPopupProduct(productSlug);
    const { isOpen, handleClose } = usePrebookPopup({
        productSlug,
        delay: 3000,
        enabled: isPrebook && !!popupProduct
    });

    if (!popupProduct || !isPrebook) {
        return null;
    }

    return (
        <PrebookPopup
            product={popupProduct}
            isOpen={isOpen}
            onClose={handleClose}
        />
    );
}
