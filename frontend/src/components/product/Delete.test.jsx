import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ProductDelete from './ProductDelete';
import * as Service from './Service';

// Мокаем модуль Service
jest.mock('./Service');

describe('ProductDelete Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100
  };

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
  });

  test('renders with product data', async () => {
    Service.delete.mockResolvedValueOnce({ data: mockProduct });
    
    render(
      <MemoryRouter initialEntries={['/product/1/delete']}>
        <Route path="/product/:id/delete">
          <ProductDelete />
        </Route>
      </MemoryRouter>
    );

    // Проверяем, что поля заполнились данными
    expect(await screen.findByDisplayValue(mockProduct.id)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.price)).toBeInTheDocument();
  });

  test('handles delete success', async () => {
    Service.delete.mockResolvedValueOnce({ data: mockProduct })
      .mockResolvedValueOnce({});
    
    const historyMock = { push: jest.fn() };

    render(
      <MemoryRouter initialEntries={['/product/1/delete']}>
        <Route path="/product/:id/delete">
          <ProductDelete history={historyMock} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText('Delete'));
    
    expect(Service.delete).toHaveBeenCalledWith('1', mockProduct);
    expect(historyMock.push).toHaveBeenCalledWith('/product');
  });

  test('handles delete error', async () => {
    const error = { response: { data: 'Delete failed' } };
    Service.delete.mockResolvedValueOnce({ data: mockProduct })
      .mockRejectedValueOnce(error);
    
    window.alert = jest.fn();

    render(
      <MemoryRouter initialEntries={['/product/1/delete']}>
        <Route path="/product/:id/delete">
          <ProductDelete />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText('Delete'));
    
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(window.alert).toHaveBeenCalledWith(error.response.data);
  });

  test('handles initial load error', async () => {
    const error = { response: { data: 'Load failed' } };
    Service.delete.mockRejectedValueOnce(error);
    window.alert = jest.fn();

    render(
      <MemoryRouter initialEntries={['/product/1/delete']}>
        <Route path="/product/:id/delete">
          <ProductDelete />
        </Route>
      </MemoryRouter>
    );

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(window.alert).toHaveBeenCalledWith(error.response.data);
  });

  test('cancels properly', async () => {
    Service.delete.mockResolvedValueOnce({ data: mockProduct });
    
    const { container } = render(
      <MemoryRouter initialEntries={['/product/1/delete']}>
        <Route path="/product/:id/delete">
          <ProductDelete />
        </Route>
      </MemoryRouter>
    );

    const cancelLink = container.querySelector('a.btn-secondary');
    expect(cancelLink).toHaveAttribute('href', '/product');
  });
});
