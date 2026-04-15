import { HeroUIProvider } from '@heroui/react';
import {
    type RenderOptions,
    render as rtlRender,
} from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';

const Providers = ({ children }: PropsWithChildren) => {
    return <HeroUIProvider>{children}</HeroUIProvider>;
};

export const render = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => {
    return rtlRender(ui, {
        wrapper: Providers,
        ...options,
    });
};

export * from '@testing-library/react';
