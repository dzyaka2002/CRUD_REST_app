import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductIndex from './Index';
import Service from './Service';

// Мокаем зависимости
jest.mock('./Service', () => ({
  get: jest.fn()
}));

global.alert = jest.fn();

describe('ProductIndex Component', () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Отображает список товаров после загрузки', async () => {
    Service.get.mockResolvedValue({ data: mockProducts });

    render(
      <MemoryRouter>
        <ProductIndex />
      </MemoryRouter>
    );

    // Проверяем состояние загрузки
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Ждем завершения запроса
    await waitFor(() => {
      // Проверяем заголовки таблицы
      expect(screen.getByText('Id')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();

      // Проверяем отображение данных
      mockProducts.forEach(product => {
        expect(screen.getByText(product.id.toString())).toBeInTheDocument();
        expect(screen.getByText(product.name)).toBeInTheDocument();
        expect(screen.getByText(product.price.toString())).toBeInTheDocument();
      });

      // Проверяем кнопки действий
      const viewButtons = screen.getAllByTitle('View');
      expect(viewButtons).toHaveLength(mockProducts.length);
    });
  });

  test('2. Отображает кнопку Create', async () => {
    Service.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <ProductIndex />
      </MemoryRouter>
    );

    await waitFor(() => {
      const createButton = screen.getByRole('link', { name: /create/i });
      expect(createButton).toHaveAttribute('href', '/product/create');
    });
  });

  test('3. Обрабатывает ошибку загрузки данных', async () => {
    const error = { response: { data: 'Ошибка сервера' } };
    Service.get.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <ProductIndex />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Ошибка сервера');
    });
  });

 test('4. Ссылки действий содержат правильные пути', async () => {
  Service.get.mockResolvedValue({ data: mockProducts });

  render(
    <MemoryRouter>
      <ProductIndex />
    </MemoryRouter>
  );

  await waitFor(() => {
    // Получаем все строки таблицы
    const rows = screen.getAllByRole('row');
    
    // Первая строка - заголовок, поэтому начинаем с индекса 1
    mockProducts.forEach((product, index) => {
      const row = rows[index + 1]; // Пропускаем заголовок
      const viewLink = row.querySelector('[title="View"]');
      const editLink = row.querySelector('[title="Edit"]');
      const deleteLink = row.querySelector('[title="Delete"]');

      expect(viewLink).toHaveAttribute('href', `/product/${product.id}`);
      expect(editLink).toHaveAttribute('href', `/product/edit/${product.id}`);
      expect(deleteLink).toHaveAttribute('href', `/product/delete/${product.id}`);
    });
  });
});
});