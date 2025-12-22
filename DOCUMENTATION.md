# 📘 Project Documentation — ApniSec

ApniSec is a cybersecurity service platform that enables users and organizations to raise, track, and manage security issues efficiently. It helps enterprises handle cyber protection challenges with a secure logging and monitoring system.

---

## 🚀 Features

- Attractive and user-friendly landing page  
- Email-based user registration  
- JWT authentication and secure login sessions  
- User dashboard to manage all issues  
- Create issues with **title, description, and type**
- Search functionality to quickly locate issues  
- Filters based on **issue type** and **creation time**
- Issue lifecycle management → **Open, In Progress, Closed**
- Edit/Update existing issues  
- Welcome emails for new users  
- Email notifications on issue updates  

---

## 🏗️ Tech Stack

### Frontend (TypeScript)
- React 19.2.0  
- React Router DOM 7.11.0  
- Axios 1.13.2  
- CSS

### Backend (TypeScript + OOP)
- Express 5.2.1  
- CORS 2.8.5  
- Bcrypt 6.0.0  
- Dotenv 17.2.3  
- Nodemailer 7.0.11

### Database
- MongoDB  
- Mongoose 9.0.2

### Authentication
- JSON Web Token (JWT) 9.0.3

### Deployment
- Frontend → Vercel  
- Backend → Render

---

## ⚙️ Setup & Installation

### Clone Repository
```bash
git clone https://github.com/SonuuChowdhury/Apni-Sec
```

### Frontend Setup
```bash
cd ./Frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd ./Backend
npx ts-node ./src/index.ts
```

### Environment Setup
Use `.env.example`, create `.env`, and configure required variables.

---

## ▶️ Usage
Users can centrally **report, manage, and review cybersecurity issues** with filtering, lifetime tracking, and notifications.

---

## 📡 APIs

### User APIs
- **POST** `/api/users/register` — Register new user  
- **POST** `/api/users/login` — Login user  
- **GET** `/api/users/verify` — Verify user token  
- **PUT** `/api/users/update` — Update user details  

### Issue APIs
- **GET** `/api/users/issues` — Get all user issues  
- **POST** `/api/users/issues/new` — Create a new issue  
- **PUT** `/api/users/issues/update` — Update an issue  

---

## 🗄️ Database Schema Overview

### 🧾 Issue Schema
| Field | Type | Description |
|------|------|-------------|
| issueUserId | ObjectId (Reference) | Identifies which user created the issue |
| issueTitle | String | Title of the security issue |
| issueDescription | String | Full explanation of the problem |
| issueStatus | String (open / in progress / closed) | Tracks issue progress |
| issueType | String (predefined categories) | Defines type such as Network Security, SOC, DevSecOps, API Security, etc. |
| createdAt | Date | Timestamp when issue was created |
| lastUpdatedAt | Date | Timestamp of last update |

---

### 👤 User Schema
| Field | Type | Description |
|------|------|-------------|
| name | String | User’s full name |
| email | String (Unique) | User login & communication |
| password | String (Hashed) | Secure password storage |
| age | Number | Age of user |
| gender | String | Gender info |
| timestamps | Auto | Stores creation & update time |

---

## 🗂️ Folder Structure
```
├── Backend
│   ├── src
│   │   ├── app
│   │   ├── config
│   │   ├── controllers
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   └── index.ts
│
├── Frontend
│   ├── src
│   │   ├── Components
│   │   ├── Pages
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
│
└── Readme.md
```

---

## 👨‍💻 Developer
**Sonu Chowdhury**  
Portfolio: https://portfolio-sonuuchowdhury.vercel.app/

---

Thank you for exploring **ApniSec**.  
Suggestions, feedback, and contributions are welcome!
