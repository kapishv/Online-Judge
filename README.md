# Online Judge System

## Overview
An Online Judge System is a platform for coding enthusiasts and competitive programmers to practice and improve coding skills. This repository details the design and implementation of such a system, including database design, web server architecture, evaluation system, and additional features.

## Features
- **Problem Management:** Browse and view detailed problem descriptions, including statement, name, code, difficulty level, and example test cases.
- **User Authentication:** Secure login/signup functionality with encrypted storage of user data.
- **Code Submission and Evaluation:** Submit code for real-time evaluation in a secure sandbox environment using Docker. Verdicts provided based on predefined test cases.
- **Submission History and Logs:** Accessible logs of recent submissions, displaying verdicts, execution time, memory usage, and programming language.
- **Profile Management:** Update personal information, change passwords, and view submission statistics.
- **Leaderboard:** Dynamic leaderboard showcasing top performers.

## High Level Design
### Database Design
- **Collections:** Problems, Solutions, Test Cases, Login/Signup
- **Document Structure:** Detailed structure for each collection defining fields such as problem statement, name, difficulty level, verdict, etc.

### Web Server Design
- **UI Screens:** Home, Specific Problem, Leaderboard, Show Submissions
- **Functional Requirements:** Detailed frontend and backend implementation for problem listing, individual problems, code submission, showing submissions, and leaderboard.

### Evaluation System
- **Code Execution:** Docker setup for containerized execution, resource management, and security measures.

## Tech Stack
- **Frontend:** React.js for building the user interface.
- **Backend:** Node.js with Express.js for building the server-side logic and RESTful APIs.
- **Database:** MongoDB for storing application data.
- **Compiler:** Docker for containerized execution of code submissions.

## Contents
1. **Database:** Contains database files and configurations.
2. **Doc:** Documentation including design documents, user manuals, and API references.
3. **Backend:** Logic and APIs implemented using Express.js for Node.js.
4. **Frontend:** UI components and implementations using React.js.
5. **Models:** Database models and schemas for MongoDB.
6. **Compiler:** Logic and configurations for code compilation and execution using Docker.
