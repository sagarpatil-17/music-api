# Fresh Music — Backend API

The backend API for **Fresh Music**, a full-stack music streaming application. Built with NestJS, Prisma, and MongoDB, the API supports application workflows for music discovery, content management, authentication, and audio delivery.

## ✨ Features

- 🔐 User authentication and role-based authorization
- 🎵 Song listing and search
- 💿 Album management
- ☁️ Audio and cover-image storage integration with Supabase
- 🔗 Signed audio URLs for playback
- 👤 User and administrator workflows
- 🛡️ Protected endpoints and request validation

Additional functionality, such as playlists, likes, and listening history, should be documented according to the endpoints implemented in the current version.

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MongoDB
- **ORM:** Prisma
- **Storage:** Supabase Storage
- **Authentication:** JWT-based authentication, if enabled in the current configuration
- **API Style:** REST

## 🏗️ Architecture

The backend is responsible for:

- Managing users and access permissions
- Serving published music and album information
- Handling administrator operations for music content
- Generating signed URLs for protected audio files
- Integrating with MongoDB through Prisma
- Managing audio and image storage through Supabase

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection
- Supabase project with the required storage buckets

### Installation

```bash
git clone https://github.com/sagarpatil-17/music_api.git
cd music_api
npm install
```

### Environment Variables

Create a `.env` file with the variables required by your application.

Example:

```env
PORT=3000

DATABASE_URL="your-mongodb-connection-string"

SUPABASE_URL="your-supabase-project-url"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_MUSIC_BUCKET="music"
```

### Database Setup

Run the Prisma commands appropriate for your project's installed Prisma version and configuration. Review the project scripts and Prisma configuration before running migrations or generating the client.

### Run the Application

For a typical NestJS development setup:

```bash
npm run start:dev
```

### Build for Production

```bash
npm run build
```

Use the production start command configured in your `package.json`.

## 🔌 API Modules

The following describes the intended API areas; replace example routes with the exact routes exposed by your controllers.

| Module | Responsibility |
|---|---|
| Authentication | User login and authentication |
| Songs | List, search, upload, and manage songs |
| Albums | Retrieve and manage albums |
| Playback | Generate signed URLs for audio playback |
| Users | User-related operations and profile data |
| Playlists | Playlist operations, if implemented |
| Likes and History | Listening preferences and history, if implemented |

## 🔐 Security

- Protect administrative endpoints with authentication and role checks.
- Validate uploaded audio files and enforce size limits.
- Keep the Supabase service-role key on the server.
- Generate time-limited signed URLs for private storage.
- Validate request data and handle errors consistently.
- Avoid logging credentials or sensitive user information.

## 🧪 Testing

Run the test commands defined in your project.

```bash
npm test
```

## 🔗 Related Repository

**Frontend:** [music_web](https://github.com/sagarpatil-17/music_web)

## 👨‍💻 Author

**Sagar Patil**

- GitHub: [@sagarpatil-17](https://github.com/sagarpatil-17)

---

Built with NestJS, Prisma, MongoDB, and Supabase.
