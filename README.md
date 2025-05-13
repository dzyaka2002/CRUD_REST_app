# Установка #

1. Необходимо скопировать репозиторий ```git clone https://github.com/stackpuz/Example-CRUD-React-18-FastAPI```
2. Требуется установить Node.js не ниже 18 версии (лучше это сделать через nvm):
   ```apt install curl
   curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
   source ~/.bashrc
   nvm install 18
   node -v
   ```
4. Перейти в каталог view ```cd view```
5. Установить зависимости для React 18 ```npm install```
6. Далее перейти в директорию FastAPI ```cd ../api```
7. Установить все необходимые зависимости (предварительно должен быть установлен Python не ниже 3.6 и pip3) ```pip install -r requirements.txt```
8. Установить MySQL ```apt install mysql-server```
9. Запуск и проверка статуса MySQL systemctl start mysql
   ```systemctl start mysql
   systemctl status mysql
   ```
10. Выполнить скрипт для повышения безопасности MySQL ```mysql_secure_installation```
11. Выполнить sql-запросы:
    ```CREATE USER 'new_user'@'localhost' IDENTIFIED BY '1';
    GRANT ALL PRIVILEGES ON *.* TO 'a1'@'localhost' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    CREATE DATABASE test;
    quit
    ```
12. Затем нужно импортировать дамп ```mysql -u root -p test < database.sql```
13. Изменить конфигурацию /api/.env:
    ```DB_HOST=localhost
    DB_PORT=3306
    DB_DATABASE=test
    DB_USER=a1
    DB_PASSWORD=1
    ```
14. Запустить из каталога view клиента:
    ```npm run dev```
15. Запустить из каталога api сервер:
    ```uvicorn app.main:app```

# Устроство приложения #
## Client ##
React 18 + Node.js 18

**Каталог RESTful_CRUD_app/view/**

public/css - хранятся данные о стилях css

index.html - базовый HTML-шаблон для React-приложения, отсылается к main.jsx

package.json - конфигурация проекта и зависимости, основной файл Node.js/NPM-проекта

vite.config.js - файл настроек для сборщика Vite, который позволяет:

                  - Настроить пути к файлам (алиасы, папка сборки).
                  - Оптимизировать процесс разработки (HMR, прокси).
                  - Подключить плагины (React, SVG-оптимизатор, ESLint).

Логика:
1. Браузер загружает index.html.
1. Видит ```<div id="root"></div>``` — это пустой контейнер.
1. Загружает /src/main.jsx (через ```<script type="module" src="/src/main.jsx">```).
1. main.jsx находит root и вставляет туда React-приложение (<App />).

```<App />```
Это главный компонент, который:

- Содержит общий layout (шапку, меню, футер).
- Управляет маршрутизацией (если используется react-router-dom).
- Хранит глобальное состояние (например, через Context или Redux).

**Каталог RESTful_CRUD_app/view/src**

app.jsx - это корневой компонент, который настраивает роутинг в приложении с помощью react-router-dom. 

history.js — это библиотека, которая управляет сессиями браузера (переходами по страницам, URL, навигацией) в JavaScript-приложениях

http.js - это кастомный модуль для работы с HTTP-запросами, созданный на основе библиотеки Axios. Он настраивает базовые параметры для всех запросов к API (например, базовый URL, заголовки) и экспортирует готовый экземпляр Axios для повторного использования в проекте.

main.jsx - это точка входа (entry point) React-приложения. Он отвечает за рендеринг корневого компонента (<App />) в DOM. 

router.jsx - это файл, который определяет маршруты (routes) React-приложения с помощью библиотеки react-router-dom. Например, при переходе по /product/create рендерится Create.jsx и т.д.
Он отвечает за:

- Сопоставление URL-путей с компонентами.
- Ленивую загрузку (lazy loading) компонентов.
- Перенаправления (редиректы).

**Каталог RESTful_CRUD_app/view/src/components/product**

Create.jsx — это React-компонент, который отвечает за создание нового товара (продукта) в приложении. Представляет собой форму с полями для ввода данных, которая отправляет их на сервер через API.

Delete.jsx - для удаления товаров.

Detail.jsx - для просмотра деталей.

Edit.jsx - для редактирования информации о товаре.

Index.jsx - отвечает за отображение списка товаров и предоставляет интерфейс для взаимодействия с ними. 

service.js - выступает в роли сервисного слоя (Service Layer), который отвечает за централизованное управление API-запросами
