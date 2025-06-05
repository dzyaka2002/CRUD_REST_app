import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductDetail from './Detail';
import http from '../../http';

jest.mock('../../http', () => ({
  get: jest.fn()
}));

describe('ProductDetail Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100
  };

  const mockMatch = { params: { id: '1' } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Загружает и отображает данные продукта', async () => {
    http.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDetail match={mockMatch} />
        </MemoryRouter>
      );
    });

    expect(screen.getByDisplayValue(mockProduct.id)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.price)).toBeInTheDocument();
  });

  test('2. Отображает кнопки Back и Edit', async () => {
    http.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDetail match={mockMatch} />
        </MemoryRouter>
      );
    });

    // Ищем кнопки по точному тексту
    const backButton = screen.getByText('Back');
    const editButton = screen.getByText('Edit');

    expect(backButton).toHaveAttribute('href', '/product');
    expect(editButton).toHaveAttribute('href', `/product/edit/${mockProduct.id}`);
  });

  test('3. Обрабатывает ошибку при загрузке', async () => {
    const errorMessage = 'Load failed';
    http.get.mockRejectedValue({ response: { data: errorMessage } });

    window.alert = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDetail match={mockMatch} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });
});
