# Caffe App

Aplicación web para la gestión de una cafetería. Implementa un frontend moderno con React y un backend robusto con Django REST Framework.

---

## Tecnologías utilizadas

### Frontend

* React
* Vite
* CSS / Tailwind

### Backend

* Django
* Django REST Framework

### Base de datos

* SQLite (desarrollo)

---

## Instalación y ejecución

### Backend (Django)

```bash
cd Backend
python -m venv env
env\Scripts\activate

python manage.py migrate
python manage.py runserver
```

---

### Frontend (React)

```bash
cd Frontend
npm install
npm run dev
```

---

## Notas importantes

* Ejecute las migraciones antes de iniciar el backend.
* Puede crear el primer usuario administrador desde consola con:

```bash
python manage.py seed_admin
```

---

## Autores

* **Maria Cristina Enriquez Ambrosio**
* **Alexander Juárez Pacheco**

