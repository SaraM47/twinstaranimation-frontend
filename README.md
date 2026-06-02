# Twinstar Animation Frontend

## Description

Twinstar Animation Frontend is the client-side application of the Twinstar Animation platform, a digital content and entertainment project focused on publishing comics, manga, animations and related media content.

The frontend provides the user interface for visitors, customers and creators. It allows users to browse content, read comics, watch animation-related media, purchase products, manage accounts and interact with the platform through a modern web experience.

The application communicates with the ASP.NET Core Web API backend through REST API requests and is responsible for presenting data, handling user interactions and managing client-side state.

This project was developed as part of a bachelor's thesis in Web Development and demonstrates how a modern React application can integrate with a .NET backend, SQL database and external services such as Stripe and YouTube.

---

## Technologies

The frontend is built with:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Zustand
- TanStack Query
- Axios

---

## Main features

### Public content

Visitors can:

- Browse animation series
- Browse comics and manga
- Read chapters and pages
- Watch video content through YouTube integration
- View product listings
- Navigate through the platform without page reloads

### Authentication

Users can:

- Register an account
- Log in
- Log out
- Access role-based functionality
- Maintain authenticated sessions through HttpOnly Cookies

### Creator Dashboard

Creators can:

- Create series
- Edit series
- Delete series
- Create chapters
- Manage media content
- Create products
- Update products
- Monitor content through the dashboard

### E-Commerce

Customers can:

- Browse products
- Add products to cart
- Manage cart contents
- Complete checkout through Stripe
- Gain access to premium content after purchase

## Project structure
### Folder overview
| Folder        | Purpose                         |
| ------------- | ------------------------------- |
| `api/`        | API communication with backend  |
| `components/` | Reusable UI components          |
| `layouts/`    | Shared layouts                  |
| `pages/`      | Application pages               |
| `routes/`     | Route configuration             |
| `stores/`     | Zustand state management        |
| `hooks/`      | Custom React hooks              |
| `types/`      | TypeScript interfaces and types |
| `utils/`      | Utility functions               |
| `assets/`     | Images, icons and static assets |

## Routing

Routing is handled using React Router.

The application contains three primary route groups:

### Public Routes

Examples:
```bash
/
 /animations
 /comics
 /shop
 /support
 /login
 /register
 ```
### Protected Routes

Examples:

```bash
/cart
/profile
/orders
```

### Creator Routes

Examples:

```bash
/creator
/creator/series
/creator/chapters
/creator/products
/creator/media
```
ProtectedRoute and RoleRoute components are used to control access.

## State management

The application uses two state management solutions.

### Zustand

Used for client-side state such as:

- Shopping cart
- User session state
- UI state
- User information

### TanStack Query

Used for server-side state such as:

- Series
- Chapters
- Products
- Ratings
- Orders
- Media content

Benefits include:

- Automatic caching
- Query invalidation
- Loading states
- Reduced manual state management

## Authentication flow

Authentication is based on JWT Authentication stored in HttpOnly Cookies.

Flow:

1. User submits login form.
2. Backend validates credentials.
3. JWT token is stored in HttpOnly Cookie.
4. Frontend requests current user information.
5. User session is established.
6. Protected routes become available.

Because the token is stored in a HttpOnly Cookie, frontend JavaScript cannot directly access the token.

## API communication

Frontend communicates with the backend through REST API requests.

Examples:

Authentication
```bash
POST /api/Auth/register
POST /api/Auth/login
GET  /api/Auth/me
```

Series
```bash
GET /api/Series
GET /api/Series/{id}
```

Chapters
```bash
GET /api/Chapters/series/{seriesId}
```

Products
```bash
GET /api/Products
GET /api/Products/{id}
```

Orders
```bash
POST /api/Orders/checkout
```

## Creator Dashboard

The Creator Dashboard serves as the administrative workspace for content creators.

Main functionality:

* Manage series
* Manage chapters
* Manage products
* Manage episodes
* Manage media content
* Create and update content
* Delete content
* Access creator-specific tools

The dashboard allows creators to work with content without directly interacting with the database or backend APIs manually.

## Stripe Checkout

The platform integrates Stripe for payment processing.

Payment flow:

1. Customer adds products to cart.
2. Checkout request is sent to backend.
3. Backend creates order.
4. Stripe PaymentIntent is created.
5. Frontend receives clientSecret.
6. Stripe Checkout UI is displayed.
7. Customer completes payment.
8. Stripe webhook verifies payment.
9. Premium access can be granted.
 

## External integrations

The platform integrates with:

* Stripe
* YouTube
* Patreon
* BuyMeACoffee

### Stripe

Used for secure payment processing.

### YouTube

Used for animation and video content.

### Patreon

Used as an external creator support platform.

### BuyMeACoffee

Used as an alternative creator support platform.

## Responsive Design

The user interface is designed to support:

- Desktop devices
- Tablets
- Mobile devices

Tailwind CSS is used to create responsive layouts and maintain a consistent visual design throughout the platform.

## Development status

The frontend should currently be considered a functional prototype.

Implemented functionality includes:

* Authentication
* Role-based navigation
* Creator Dashboard
* Series browsing
* Chapter reading
* Product pages
* Shopping cart
* Stripe checkout
* API integration

Areas prepared for future development include:

* Production deployment
* Additional creator tools
* Expanded premium content functionality
* Enhanced analytics
* Advanced testing coverage