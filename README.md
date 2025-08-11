# Social Media Backend

A comprehensive Node.js backend API for a social media platform with real-time chat functionality, content sharing, and advanced social features.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Email, phone, Google, and Apple sign-in
- **Real-time Chat** - Socket.io powered messaging with typing indicators
- **Content Management** - Posts, reels, stories, and file uploads
- **Social Features** - Friends, matching algorithm, compliments, and ratings
- **Event Management** - Create, join, and manage events
- **Geolocation Services** - Location-based features and matching
- **Advanced Privacy** - Blocking, reporting, and privacy settings

### Key Features
- **Matching Algorithm** - Smart user matching based on preferences
- **Video Calls** - Agora integration for voice/video calling
- **Content Moderation** - Report and block functionality
- **Subscription System** - Premium features and monetization
- **Admin Panel** - Administrative controls and user management
- **File Management** - Image, video, and document upload with thumbnails
- **Push Notifications** - Firebase integration for notifications
- **SOS Feature** - Emergency safety functionality

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT, bcrypt
- **File Storage**: Multer with local storage
- **Video Processing**: FFmpeg
- **Email**: Nodemailer
- **Push Notifications**: Firebase Admin SDK
- **Video Calling**: Agora SDK
- **Validation**: Joi
- **Security**: Helmet, CORS

## 📁 Project Structure

```
src/
├── config/           # Database and service configurations
├── controllers/      # Request handlers (admin & user)
├── middlewares/      # Authentication, validation, and utility middlewares
├── models/          # Mongoose schemas and models
├── routes/          # API route definitions
├── schemas/         # Joi validation schemas
├── services/        # Business logic layer
├── utilities/       # Helper functions and algorithms
└── validators/      # Input validation utilities
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Firebase project (for notifications)
- Agora account (for video calls)
- SSL certificates (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-media-backend-node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   BASE_URL=http://localhost:3000
   SECRET_KEY=your-session-secret
   MAX_AGE=2592000000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/spont-network
   MONGODB_USERNAME=your-username  # Production only
   MONGODB_PASSWORD=your-password  # Production only
   
   # Security
   SALT_ROUNDS=10
   
   # Firebase (for push notifications)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-password
   
   # Agora (for video calls)
   AGORA_APP_ID=your-agora-app-id
   AGORA_APP_CERTIFICATE=your-agora-certificate
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on the specified port (default: 3000) and automatically connect to MongoDB.

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://your-domain.com/api/v1`

### Authentication
Most endpoints require authentication via session tokens. Include the session token in headers or cookies.

### Main Endpoints

#### Authentication
- `POST /auth/signup-signin` - User registration/login
- `POST /auth/social-signup-signin` - Social media authentication

#### User Management
- `GET /profiles/me` - Get current user profile
- `PUT /profiles/me` - Update user profile
- `POST /profiles/upload-picture` - Upload profile picture

#### Social Features
- `GET /friends` - Get friends list
- `POST /friends/add` - Send friend request
- `GET /profiles/matches` - Get potential matches
- `POST /compliments` - Send compliments

#### Content
- `POST /stories` - Create story
- `GET /stories` - Get stories feed
- `POST /reels` - Upload reel
- `GET /reels/feed` - Get reels feed

#### Real-time Features
- `GET /chats/inbox` - Get chat inbox
- Socket events: `new-chat`, `get-chats`, `chat-typing`

#### Events
- `POST /events` - Create event
- `GET /events` - Get events
- `POST /events/:id/join` - Join event

## 🔌 Socket.io Events

### Client → Server
- `get-inbox` - Retrieve user's chat inbox
- `new-chat` - Send new message
- `get-chats` - Get conversation history
- `chat-typing` - Send typing indicator

### Server → Client
- `response` - General response data
- `error` - Error messages
- `get-inbox` - Updated inbox data

## 🗄️ Database Models

Key models include:
- **User** - User profiles and authentication
- **Chat** - Real-time messaging
- **Content** - User posts and media
- **Event** - Social events and gatherings
- **Friend** - Friend relationships
- **Notification** - Push notifications
- **Report** - Content and user reports

## 🔐 Security Features

- **Authentication Middleware** - Session-based authentication
- **Account Status Verification** - Check for suspended/banned accounts
- **User Verification** - Email/phone verification system
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Joi schema validation
- **Password Hashing** - bcrypt encryption
- **CORS Protection** - Cross-origin request handling

## 🚀 Deployment

### Production Setup
1. Configure SSL certificates in `/etc/letsencrypt/`
2. Set `NODE_ENV=production`
3. Configure MongoDB with authentication
4. Set up proper firewall rules
5. Use PM2 or similar for process management

### SSL Configuration
The app automatically uses HTTPS in production with Let's Encrypt certificates.

## 🧪 Testing

Currently, tests are not configured. To add testing:
```bash
npm install --save-dev jest supertest
# Add test scripts to package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the logs in the console
- Ensure all environment variables are set
- Verify MongoDB connection
- Check Firebase and Agora configurations

## 🔄 Recent Updates

- Real-time chat functionality with Socket.io
- Advanced matching algorithm
- Event management system
- Enhanced security middleware
- File upload and processing
- Push notification integration

---

**Note**: This is a comprehensive social media backend with advanced features. Ensure all third-party services (Firebase, Agora, MongoDB) are properly configured before deployment.
