FROM nginx:alpine

# Копируем конфигурацию Nginx из корня проекта в контейнер
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем статические файлы фронтенда в директорию, которую использует nginx
COPY . /usr/share/nginx/html

# Открываем порт 80 для nginx
EXPOSE 80