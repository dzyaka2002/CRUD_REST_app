import pytest
import sqlite3
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.db import Base, get_db
from app.main import app
from app.models.product import Product
from app.schemas.product import ProductCreate
from app.routers import product  # Импортируйте модуль роутера

# URL тестовой базы данных (можно использовать in-memory SQLite)
TEST_DATABASE_URL = "sqlite:///:memory:"

# Создаем тестовый движок базы данных
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)

# Создаем сессию для работы с базой данных
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Переопределяем зависимость get_db
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Переопределяем зависимость в FastAPI приложении
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture()
def test_db():
    # Создаем таблицы в тестовой базе данных
    Base.metadata.create_all(bind=engine)
    yield
    # Удаляем таблицы после завершения тестов
    Base.metadata.drop_all(bind=engine)

@pytest.fixture()
def client(test_db):
    # Создаем тестовый клиент FastAPI
    return TestClient(app)

@pytest.fixture()
def product_payload():
    return {"name": "Test Product", "price": 123.45}

def test_index_products(client: TestClient, test_db):
    response = client.get("/api/products")
    assert response.status_code == 200

def test_create_product(client: TestClient, test_db, product_payload):
    response = client.post("/api/products", json=product_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["price"] == 123.45
