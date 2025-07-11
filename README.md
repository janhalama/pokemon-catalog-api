# Pokemon Catalog API

A REST API for browsing Pokemon catalogs, managing user favorites, and providing authentication services.

## Overview

This API serves as the backend for a Pokemon catalog website where authenticated users can:
- Browse a comprehensive Pokemon database with pagination
- Search and filter Pokemon by name, type, and other criteria
- Manage personal favorites lists
- Register and authenticate securely

## Tech Stack

- **Framework**: Fastify
- **Database**: PostgreSQL with MikroORM
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Testing**: Jest