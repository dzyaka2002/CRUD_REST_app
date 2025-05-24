import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.main import app
from app.models.product import Product
from app.schemas.product import ProductCreate

# Настройка тестовой базы данных
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Фикстуры
@pytest.fixture()
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture()
def client(test_db):
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

@pytest.fixture()
def product_payload():
    return {"name": "Test Product", "price": 123.45}

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Тесты для моделей
def test_product_model():
    product = Product(name="Test Model", price=99.99)
    assert str(product) == f"Product(id=None, name=Test Model, price=99.99)"
    assert product.price == 99.99

# Тесты API
def test_index_empty_products(client: TestClient, test_db):
    response = client.get("/api/products")
    assert response.status_code == 200
    assert response.json() == []

def test_create_and_retrieve_product(client: TestClient, test_db, product_payload):
    # Создание
    create_resp = client.post("/api/products", json=product_payload)
    assert create_resp.status_code == 200
    product_data = create_resp.json()
    
    # Получение
    get_resp = client.get(f"/api/products/{product_data['id']}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Test Product"

@pytest.mark.parametrize("data,expected_status", [
    ({"name": "Valid", "price": 1}, 200),
    ({"name": "", "price": 1}, 422),  # Пустое имя
    ({"name": "A", "price": -1}, 422),  # Отрицательная цена
    ({"name": "A"*101, "price": 1}, 422),  # Слишком длинное имя
    ({"name": "No Price"}, 422),  # Нет цены
])
def test_product_validation(client, test_db, data, expected_status):
    response = client.post("/api/products", json=data)
    assert response.status_code == expected_status

def test_update_product(client: TestClient, test_db, product_payload):
    # Создаем продукт
    create_resp = client.post("/api/products", json=product_payload)
    product_id = create_resp.json()["id"]
    
    # Обновляем
    update_data = {"name": "Updated", "price": 999}
    response = client.put(f"/api/products/{product_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated"

def test_delete_product(client: TestClient, test_db, product_payload):
    # Создаем
    create_resp = client.post("/api/products", json=product_payload)
    product_id = create_resp.json()["id"]
    
    # Удаляем
    response = client.delete(f"/api/products/{product_id}")
    assert response.status_code == 200
    
    # Проверяем удаление
    get_resp = client.get(f"/api/products/{product_id}")
    assert get_resp.status_code == 404

def test_product_not_found(client: TestClient, test_db):
    response = client.get("/api/products/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

def test_bulk_operations(client: TestClient, test_db):
    # Создаем несколько продуктов
    products = [
        {"name": f"Product {i}", "price": i*10}
        for i in range(1, 6)
    ]
    
    for p in products:
        client.post("/api/products", json=p)
    
    # Проверяем список
    response = client.get("/api/products")
    assert response.status_code == 200
    assert len(response.json()) == 5
    assert all(p["price"] > 0 for p in response.json())

# Тесты для схем данных
def test_product_schema():
    product = ProductCreate(name="Schema Test", price=50.0)
    assert product.price == 50.0
    assert product.model_dump() == {"name": "Schema Test", "price": 50.0}
