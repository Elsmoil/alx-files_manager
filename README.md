# ALX Files Manager API

This is a simple file management system built with Node.js, Express, MongoDB, and Redis. It allows you to create users, upload files, manage files in directories, and authenticate users with a token-based system.

## Features

1. **User Management**: Allows users to sign up, authenticate via token, and manage files.
2. **File Management**: Upload files, create folders, and organize files in a structured manner.
3. **Database Integration**: Uses MongoDB to store user data and file metadata.
4. **Redis Integration**: Uses Redis for user session management via authentication tokens.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (version 12.x.x)
- **MongoDB** (version 3.6+)
- **Redis** (version 5.0+)
- **npm** (Node Package Manager)

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Elsmoil/alx-files_manager.git
cd alx-files_manager
