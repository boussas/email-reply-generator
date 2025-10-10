# Email Reply Generator

A web application and browser extension that generates smart, context-aware email replies with configurable tones using the **Google Gemini API**.

## 🚀 Features

* ✉️ Compose intelligent email replies
* 🎨 Choose reply tone (Professional, Friendly, Apologetic, etc.)
* 🧠 Powered by Gemini API
* 🌐 Chrome & Firefox Extension to integrate directly with Gmail
* 🌍 React + Spring Boot web application

---

## 🧩 Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Frontend   | React, TailwindCSS       |
| Backend    | Spring Boot              |
| AI API     | Google Gemini Pro        |
| Extensions | Chrome + Firefox support |

---

## 📁 Project Structure

```
smart-email-assistant/
├── chrome extension/         # Chrome Gmail integration
├── firefox extension/        # Firefox Gmail integration
├── email-reply-generator/    # Spring Boot (BACKEND)
├── frontend/                 # React frontend app
```

---

## 🛠️ Environment Variables

In the `email-reply-generator/src/main/resources/application.properties`:

```
gemini.api.url=${GEMINI_URL}
gemini.api.key=${GEMINI_KEY}
```

You should define the following in your system environment or `.env` file:

```bash
GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=
GEMINI_KEY=your_google_api_key_here
```

---

## 🧪 Run the Project

### 1. Backend - Spring Boot

```bash
cd email-reply-generator
./mvnw spring-boot:run
```

### 2. Frontend - React

```bash
cd frontend
npm install
npm run dev
```

Then visit: `http://localhost:5173`
![image](https://github.com/user-attachments/assets/cffc601e-6680-4307-b727-105170326b21)

---

## 🧩 Browser Extension

1. Go to `chrome://extensions` in Chrome or `about:debugging` in Firefox
2. Enable **Developer Mode**
3. Click **Load unpacked** and select the folder:
Firefox:

![image](https://github.com/user-attachments/assets/7c4bccc5-374e-4dd8-b1f8-d8361dee52de)

Chrome:

![image](https://github.com/user-attachments/assets/b4328b87-f4b6-4ed8-9012-d1a2be89458f)

5. Use Gmail and see the **AI Reply** button in compose window!
![image](https://github.com/user-attachments/assets/eccf94b7-4651-4e1c-ae0f-205c7eefea24)

---

## Author

Developed by **Mohamed Boussas**

GitHub: [@boussas](https://github.com/boussas)
