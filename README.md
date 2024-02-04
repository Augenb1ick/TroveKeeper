# TroveKeeper

TroveKeeper is a dynamic web application designed for managing personal collections. Originally developed as a project during an internship at itransition, this application provides users with a platform to curate, organize, and maintain their personal collections effectively.

[Explore](https://trove-keeper.vercel.app/)

## Features

-   Authentication: Non-authenticated users have read-only access, while authenticated users enjoy full access, excluding the "admin area." Administrators can manage users within the admin area.

-   Personal Pages: Each user has a personalized page for managing their list of collections. Users can add, remove, or edit their collections. Collection management (edit/add/remove) rights are reserved for the owner (creator) or administrators.

-   Custom Fields: Collections support the definition of custom fields, which can be filled for each item within the collection. Users can export collections, including items and fields, to a CSV file.

-   Search & Filtering: Search functionality providing items as results. Users can filter items by tags.

-   Interactions: Authenticated users can comment on items. Any user, whether authenticated or not, can view new comments immediately. Items can also be liked.

-   Language & Themes: The app supports English and Russian languages and provides both dark and light visual themes.

## Tech Stack

-   Frontend: React, TypeScript
-   Styling: Material UI React UI components
-   Frontend additional tools: Firebase, I18next, i18next-browser-languagedetector, Socket.IO-Client, React Hook Form, React Nice Avatar, React Router DOM, React Select, React Tagcloud, Export-from-json, Marked-React
-   Backend: Express.js, MongoDB
-   Backend additional tools: Bcryptjs, Celebrate, Dotenv, Express-winston, Helmet, Jsonwebtoken, Socket.io, Validator, Winston
