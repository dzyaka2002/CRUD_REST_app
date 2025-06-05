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

    expect(await screen.findByDisplayValue(mockProduct.id)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.price)).toBeInTheDocument();
  });

  test('2. Отображает правильные кнопки действий', async () => {
    http.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductDetail match={mockMatch} />
        </MemoryRouter>
      );
    });

    // Находим все кнопки (ссылки) внутри формы
    const buttons = screen.getAllByRole('link');
    
    // Проверяем, что есть хотя бы две кнопки (Back и Edit)
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    
    // Ищем кнопки по тексту (без учета регистра)
    const backButton = buttons.find(button => 
      button.textContent.match(/back/i)
    );
    const editButton = buttons.find(button => 
      button.textContent.match(/edit/i)
    );

    // Проверяем что кнопки найдены
    expect(backButton).toBeDefined();
    expect(editButton).toBeDefined();
    
    // Проверяем атрибуты
    expect(backButton).toHaveAttribute('href', '/product');
    expect(editButton).toHaveAttribute('href', `/product/edit/${mockProduct.id}`);
    
    // Проверяем классы (опционально)
    expect(backButton).toHaveClass('btn-secondary');
    expect(editButton).toHaveClass('btn-primary');
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
