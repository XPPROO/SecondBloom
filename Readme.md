# Введение
## Для начала работы необходимо активировать вирутальное окружение и скачать все необходимые утилиты:
`python -m venv .venv`\
`pip install django`\
`pip install python-dotenv`\
`... (будет дополнятся в ходе разработки)`

### Помимо первой настройки во имя избежания каких-либо неприятностей перед началом работы следует прописать 
- `git pull`

### После *успешной* работы следует прописать 
1. `git add .` или `git add путь/к/файлу1 путь/к/файлу2 ...`
2. `git commit -m "Название коммита"`
3. `git push`


## Настройка окружения

1. **Клонируйте репозиторий (git clone https://github.com/XPPROO/SecondBloom.git)** и перейдите в папку проекта.
2. **Создайте `.env` файл**:  
   - Скопируйте содержимое `.env.example` в `.env`
   - Заполните своими значениями (пароли, ключи).  
   - Для `DJANGO_SECRET_KEY` сгенерируйте новый: `python -c "import secrets; print(secrets.token_urlsafe(50))"` и вставьте выданный ключ в `DJANGO_SECRET_KEY` в созданном файле `.env`
3. **Настройте базу данных**: Создайте PostgreSQL БД и заполните параметры в `.env`.
4. **Примените миграции**: `python manage.py migrate`
5. **Запустите сервер**: `python manage.py runserver`

# Запуск 
## из \XPPRO:
    - python Secondbloom/manage.py runserver
### или (если установлена утилита make)
    - make start
## из \XPPRO\SecondBloom:
    - python manage.py runserver
