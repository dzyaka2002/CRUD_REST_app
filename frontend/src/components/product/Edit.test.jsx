import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductEdit from './Edit';
import http from '../../http';

jest.mock('../../http', () => ({
  get: jest.fn(),
  put: jest.fn()
}));

describe('ProductEdit Component', () => {
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
          <ProductEdit match={mockMatch} />
        </MemoryRouter>
      );
    });

    expect(screen.getByDisplayValue(mockProduct.id)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.price)).toBeInTheDocument();
  });

  test('2. Позволяет редактировать поля формы', async () => {
    http.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductEdit match={mockMatch} />
        </MemoryRouter>
      );
    });

    const nameInput = screen.getByLabelText('Name');
    const priceInput = screen.getByLabelText('Price');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Updated Product' } });
      fireEvent.change(priceInput, { target: { value: '200' } });
    });

    expect(nameInput.value).toBe('Updated Product');
    expect(priceInput.value).toBe('200');
  });

  test('3. Успешно сохраняет изменения', async () => {
    http.get.mockResolvedValue({ data: mockProduct });
    http.put.mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductEdit match={mockMatch} history={mockHistory} />
        </MemoryRouter>
      );
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Name'), { 
        target: { value: 'Updated Product' } 
      });
      fireEvent.click(screen.getByText('Save')); // Изменили с 'Submit' на 'Save'
    });

    await waitFor(() => {
      expect(http.put).toHaveBeenCalledWith(`/products/${mockProduct.id}`, {
        ...mockProduct,
        name: 'Updated Product'
      });
      expect(mockHistory.push).toHaveBeenCalledWith('/product');
    });
  });

  test('4. Обрабатывает ошибку при сохранении', async () => {
    const errorMessage = 'Update failed';
    http.get.mockResolvedValue({ data: mockProduct });
    http.put.mockRejectedValue({ response: { data: errorMessage } });

    window.alert = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductEdit match={mockMatch} />
        </MemoryRouter>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Save')); // Изменили с 'Submit' на 'Save'
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('5. Кнопка Cancel ведет на /product', async () => {
    http.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductEdit match={mockMatch} />
        </MemoryRouter>
      );
    });

    const cancelLink = screen.getByRole('link', { name: /cancel/i });
    expect(cancelLink).toHaveAttribute('href', '/product');
  });

  test('6. Обрабатывает ошибку при загрузке', async () => {
    const errorMessage = 'Load failed';
    http.get.mockRejectedValue({ response: { data: errorMessage } });

    window.alert = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductEdit match={mockMatch} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });
});
