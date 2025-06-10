# this is the backend for my personnal project VisitZarzis
A MERN stack app with [feature summary, e.g., JWT auth, Cloudinary uploads].

## Features
- ✅ JWT Authentication  
- 🖼️ Cloudinary Image Upload  
- 📧 Nodemailer (Gmail)  

## Setup
1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/repo.git
   cd repo

#install dependencies 
npm install

# create and configure the .env file   

  PORT=3001
  DB=mongodb://localhost:27017/mernproject
  JWT_SECRET=secret123
  GMAIL_EMAIL=your@gmail.com
  GMAIL_APP_PASSWORD=your_gmail_app_password
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret


  # Run 
  npm start
