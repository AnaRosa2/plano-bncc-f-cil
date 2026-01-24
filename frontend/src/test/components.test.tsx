import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, CardSkeleton, ListSkeleton } from '@/components/ui/skeleton';

describe('Skeleton Components', () => {
    describe('Skeleton', () => {
        it('deve renderizar com classes padrão', () => {
            const { container } = render(<Skeleton />);
            const skeleton = container.firstChild as HTMLElement;

            expect(skeleton).toHaveClass('animate-pulse');
            expect(skeleton).toHaveClass('rounded-md');
            expect(skeleton).toHaveClass('bg-muted');
        });

        it('deve aceitar classes customizadas', () => {
            const { container } = render(<Skeleton className="h-10 w-full" />);
            const skeleton = container.firstChild as HTMLElement;

            expect(skeleton).toHaveClass('h-10');
            expect(skeleton).toHaveClass('w-full');
        });
    });

    describe('CardSkeleton', () => {
        it('deve renderizar estrutura de card skeleton', () => {
            const { container } = render(<CardSkeleton />);

            // Deve ter múltiplos elementos skeleton
            const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
            expect(skeletons.length).toBeGreaterThan(3);
        });

        it('deve ter classe de animação scale-in', () => {
            const { container } = render(<CardSkeleton />);
            const card = container.firstChild as HTMLElement;

            expect(card).toHaveClass('animate-scale-in');
        });
    });

    describe('ListSkeleton', () => {
        it('deve renderizar 3 itens por padrão', () => {
            const { container } = render(<ListSkeleton />);

            const items = container.querySelectorAll('.edu-card');
            expect(items).toHaveLength(3);
        });

        it('deve renderizar número customizado de itens', () => {
            const { container } = render(<ListSkeleton items={5} />);

            const items = container.querySelectorAll('.edu-card');
            expect(items).toHaveLength(5);
        });

        it('deve aplicar delay de animação incremental', () => {
            const { container } = render(<ListSkeleton items={3} />);

            const items = container.querySelectorAll('.edu-card');

            expect((items[0] as HTMLElement).style.animationDelay).toBe('0ms');
            expect((items[1] as HTMLElement).style.animationDelay).toBe('100ms');
            expect((items[2] as HTMLElement).style.animationDelay).toBe('200ms');
        });
    });
});
