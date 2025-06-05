import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductDelete from './Delete';
import * as Service from './Service';

jest.mock('./Service', () => ({
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

  test('1. Отображает данные продукта', async () => {
    Service.delete.mockResolvedValue({ data: mockProduct });

    render(
      <MemoryRouter>
        <ProductDelete match={mockMatch} />
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue(mockProduct.id)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.price)).toBeInTheDocument();
  });

  test('2. Успешное удаление продукта', async () => {
    Service.delete
      .mockResolvedValueOnce({ data: mockProduct }) // Первый вызов - загрузка данных
      .mockResolvedValueOnce({}); // Второй вызов - удаление

    render(
      <MemoryRouter>
        <ProductDelete match={mockMatch} history={mockHistory} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Delete'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(Service.delete).toHaveBeenCalledWith('1', mockProduct);
    expect(mockHistory.push).toHaveBeenCalledWith('/product');
  });

  test('3. Обработка ошибки при удалении', async () => {
    const errorMessage = 'Delete failed';
    Service.delete
      .mockResolvedValueOnce({ data: mockProduct })
      .mockRejectedValueOnce({ response: { data: errorMessage } });

    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <ProductDelete match={mockMatch} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Delete'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
  });

  test('4. Кнопка Cancel ведет на страницу /product', () => {
    Service.delete.mockResolvedValue({ data: mockProduct });

    render(
      <MemoryRouter>
        <ProductDelete match={mockMatch} />
      </MemoryRouter>
    );

    const cancelLink = screen.getByRole('link', { name: /cancel/i });
    expect(cancelLink).toHaveAttribute('href', '/product');
  });
});
