import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductDelete from './Delete';
import http from '../../http';

// Мокаем весь http модуль
jest.mock('../../http', () => ({
  get: jest.fn(),
  delete: jest.fn()
}));

describe('ProductDelete Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100
  };

  const mockHistory = { push: jest.fn() };
  const mockMatch = { params: { id: '1' } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Загружает и отображает данные продукта', async () => {
    http.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDelete match={mockMatch} />
        </MemoryRouter>
      );
    });

    expect(screen.getByDisplayValue(mockProduct.id)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.price)).toBeInTheDocument();
  });

  test('2. Успешно удаляет продукт', async () => {
    http.get.mockResolvedValue({ data: mockProduct });
    http.delete.mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDelete match={mockMatch} history={mockHistory} />
        </MemoryRouter>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(http.delete).toHaveBeenCalledWith(`/products/${mockProduct.id}`);
      expect(mockHistory.push).toHaveBeenCalledWith('/product');
    });
  });

  test('3. Обрабатывает ошибку при удалении', async () => {
    const errorMessage = 'Delete failed';
    http.get.mockResolvedValue({ data: mockProduct });
    http.delete.mockRejectedValue({ response: { data: errorMessage } });

    window.alert = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDelete match={mockMatch} />
        </MemoryRouter>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('4. Кнопка Cancel ведет на /product', async () => {
    http.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDelete match={mockMatch} />
        </MemoryRouter>
      );
    });

    const cancelLink = screen.getByRole('link', { name: /cancel/i });
    expect(cancelLink).toHaveAttribute('href', '/product');
  });
});
