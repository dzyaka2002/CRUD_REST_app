FROM python:3.9-slim

WORKDIR /app

# Сначала копируем только requirements.txt для кэширования
COPY requirements.txt .
RUN pip install -r requirements.txt

# Затем копируем ВСЕ остальные файлы
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
