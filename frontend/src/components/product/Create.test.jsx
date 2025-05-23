import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCreate from './Create';

jest.mock('./Service', () => ({
  create: jest.fn().mockResolvedValue({})
}));

describe('ProductCreate Component', () => {
  test('1. Заполнение формы и отправка', () => {
    render(
      <MemoryRouter>
        <ProductCreate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test Product' }
    });
    
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '100' }
    });

    expect(screen.getByLabelText('Name').value).toBe('Test Product');
    expect(screen.getByLabelText('Price').value).toBe('100');
  });

  test('2. Кнопка Cancel ведет на страницу /product', () => {
    render(
      <MemoryRouter>
        <ProductCreate />
      </MemoryRouter>
    );

    const cancelLink = screen.getByRole('link', { name: /cancel/i });
    expect(cancelLink).toHaveAttribute('href', '/product');
  });
});