# 🛍️ Made-Store

> **Modular Server-Rendered E-commerce App**  
> Built for **MadePetal Clinic & Spa** using **Express**, **Handlebars**, **Sequelize (Postgres)**, **Multer**, **Cloudinary**, and **Passport (Local Auth)** — all structured in modular domains for clarity and scalability.

---

## 📖 Overview

**Made-Store** is a modular, server-rendered e-commerce web app for managing and selling beauty products at MadePetal Clinic & Spa.  
It’s built on [nathius262/nexusjs](https://github.com/nathius262/nexusjs) modular starter and emphasizes clean architecture, beginner-friendly code, and secure integrations.

Each core domain (`auth`, `products`, `admin`, `uploads`) lives in its own module — each with its own routes, controllers, services, and views — allowing the app to scale easily and stay maintainable.

---

## ⚙️ Core Features

| Feature | Description |
|----------|--------------|
| **Modular Architecture** | Each domain (auth, product, admin, uploads) is independent for maintainability. |
| **Server-Rendered Views** | Built with Express-Handlebars, using layouts and reusable partials. |
| **Auth (Passport Local)** | Secure login/register with password hashing (bcrypt) and session-based auth. |
| **Roles & Permissions** | Role-based access for `admin` and `staff`. |
| **Product CRUD** | Full create, read, update, and delete of products with title, description, price, stock, category, and image. |
| **Image Upload Pipeline** | `multer` + `Cloudinary` for image uploads, validations, and storage. |
| **Database** | `Sequelize ORM` with PostgreSQL models for `User`, `Product`, and `Category`. |
| **Session Management** | `express-session` + `connect-session-sequelize` for persistent sessions. |
| **Clean Views** | Reusable components: navbar, product cards, flash messages, responsive forms. |
| **Deployment Ready** | Configured for Vercel + Cloudinary with `.env` environment support. |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | [nathius262/nexusjs](https://github.com/nathius262/nexusjs) modular starter |
| **Backend** | Node.js, Express.js |
| **View Engine** | Express-Handlebars (SSR) |
| **Database** | PostgreSQL + Sequelize ORM |
| **Authentication** | Passport (local strategy) + bcrypt |
| **File Uploads** | Multer + Cloudinary |
| **Sessions** | express-session + connect-session-sequelize |
| **Environment Management** | dotenv |
| **Code Quality** | ESLint + Prettier |
| **Testing (optional)** | Mocha / Supertest (to be added) |

---

## 📁 Project Structure

