FROM python:3.10-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файл зависимостей (если он есть)
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все остальные файлы в контейнер
COPY . .

# Открываем порт 5000
EXPOSE 5000

# Команда для запуска Flask приложения
CMD ["flask", "run", "--host=0.0.0.0"]