# Transaction Approval Simulator

## Project Overview

The Transaction Approval Simulator is a full-stack application for simulating whether a transaction should be approved or rejected. A user selects a region and transaction time, and the system determines the result according to that region's local business hours.

Transactions are converted from the submitted UTC time to the selected region's local time. Transactions submitted during the configured approval window, 08:00 to 18:00 local time, are approved; transactions outside that window are rejected.

## Architecture

### Backend

The backend is organized as a layered .NET Core solution:

- `Shva.TransactionApprovalSimulator.Api` - ASP.NET Core Web API entry point. Configures controllers, Swagger, CORS, JWT authentication, middleware, dependency injection, and API endpoints.
- `Shva.TransactionApprovalSimulator.Application` - Application layer. Contains DTOs, service interfaces, and transaction approval business workflows.
- `Shva.TransactionApprovalSimulator.Domain` - Domain layer. Contains core entities and enums such as `Transaction` and `TransactionStatus`.
- `Shva.TransactionApprovalSimulator.Infrastructure` - Infrastructure layer. Contains EF Core persistence, database context, migrations, and repository implementation.
- `Shva.TransactionApprovalSimulator.Tests` - Backend unit tests for transaction approval behavior and service mapping.

### Frontend

The frontend is a React + TypeScript application built with Vite:

- Feature-based folder structure under `src/features`, including authentication, layout, simulator, and transaction views.
- API layer under `src/api`, which centralizes HTTP requests, auth token handling, and endpoint wrappers.
- Authentication layer that stores the JWT, attaches it to protected API requests, and handles login/logout flow.
- Shared transaction types under `src/types`.

## Technologies

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL via `Npgsql.EntityFrameworkCore.PostgreSQL`
- JWT Authentication
- Swagger / OpenAPI
- xUnit

### Frontend

- React
- TypeScript
- Vite
- CSS
- JWT Authentication

## Features

- Transaction simulation
- Region selection: `Israel`, `France`, `USA`, `Japan`
- Time selection
- Transaction approval/rejection based on local business hours
- Approved transactions carousel
- All transactions view
- Search transaction by ID
- JWT login/logout

## API Endpoints

Transaction endpoints require a JWT bearer token returned from `POST /api/auth/login`.

### Authentication

#### `POST /api/auth/login`

Purpose: Authenticates the demo user and returns a JWT access token.

Request example:

```json
{
  "username": "admin",
  "password": "admin"
}
```

Response example:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Transactions

#### `POST /api/transactions/simulate`

Purpose: Simulates a transaction for the selected region and submitted UTC date/time, then stores and returns the result.

Request example:

```json
{
  "region": "Israel",
  "submittedDateTime": "2026-01-15T10:00:00Z"
}
```

Response example:

```json
{
  "id": "3f2f2d9b-2f66-41c3-9bb3-3d1d2adf7a31",
  "region": "Israel",
  "submittedDateTimeUtc": "2026-01-15T10:00:00Z",
  "localDateTime": "2026-01-15T12:00:00",
  "status": 0
}
```

`status` is serialized from `TransactionStatus`: `0` = `Approved`, `1` = `Rejected`.

#### `GET /api/transactions/approved`

Purpose: Returns all approved transactions for display in the approved transactions carousel.

Request example:

```http
GET /api/transactions/approved
Authorization: Bearer <jwt-token>
```

Response example:

```json
[
  {
    "id": "3f2f2d9b-2f66-41c3-9bb3-3d1d2adf7a31",
    "region": "Israel",
    "localDateTime": "2026-01-15T12:00:00"
  }
]
```

#### `GET /api/transactions`

Purpose: Returns all simulated transactions.

Request example:

```http
GET /api/transactions
Authorization: Bearer <jwt-token>
```

Response example:

```json
[
  {
    "id": "3f2f2d9b-2f66-41c3-9bb3-3d1d2adf7a31",
    "region": "Israel",
    "submittedDateTimeUtc": "2026-01-15T10:00:00Z",
    "localDateTime": "2026-01-15T12:00:00",
    "status": 0
  },
  {
    "id": "9c810d44-7831-4887-9c59-46c38513b802",
    "region": "Japan",
    "submittedDateTimeUtc": "2026-01-15T20:00:00Z",
    "localDateTime": "2026-01-16T05:00:00",
    "status": 1
  }
]
```

#### `GET /api/transactions/{id}`

Purpose: Returns a single transaction by its ID.

Request example:

```http
GET /api/transactions/3f2f2d9b-2f66-41c3-9bb3-3d1d2adf7a31
Authorization: Bearer <jwt-token>
```

Response example:

```json
{
  "id": "3f2f2d9b-2f66-41c3-9bb3-3d1d2adf7a31",
  "region": "Israel",
  "submittedDateTimeUtc": "2026-01-15T10:00:00Z",
  "localDateTime": "2026-01-15T12:00:00",
  "status": 0
}
```

## Running the Backend

1. Open the backend solution: `Shva.TransactionApprovalSimulator/Shva.TransactionApprovalSimulator.sln`.
2. Restore packages:

```powershell
dotnet restore .\Shva.TransactionApprovalSimulator\Shva.TransactionApprovalSimulator.sln
```

3. Ensure PostgreSQL is running and matches the connection string in `Shva.TransactionApprovalSimulator/Shva.TransactionApprovalSimulator.Api/appsettings.json`.
4. Run the API project:

```powershell
dotnet run --project .\Shva.TransactionApprovalSimulator\Shva.TransactionApprovalSimulator.Api\Shva.TransactionApprovalSimulator.Api.csproj --launch-profile https
```

5. Open Swagger: `https://localhost:7085/swagger`.
6. Expected local API URL: `https://localhost:7085`.

The HTTPS launch profile also exposes `http://localhost:5234`.

## Running the Frontend

1. Navigate to the client folder:

```powershell
cd .\Shva.TransactionApprovalSimulator.Client
```

2. Install dependencies:

```powershell
npm install
```

3. Create a `.env` file in `Shva.TransactionApprovalSimulator.Client`.
4. Add:

```env
VITE_API_BASE_URL=https://localhost:7085
```

5. Run:

```powershell
npm run dev
```

6. Open: `http://localhost:5173`.

## Authentication

Demo credentials:

```text
Username: admin
Password: admin
```

After login, the frontend stores the JWT and sends it as a bearer token for protected transaction requests.

## Testing

Run backend tests from the repository root:

```powershell
dotnet test .\Shva.TransactionApprovalSimulator\Shva.TransactionApprovalSimulator.sln
```

## Design Decisions

- Layered architecture separates API concerns, business logic, domain objects, and persistence so each layer has a clear responsibility and is easier to test.
- API calls are isolated in `src/api` so HTTP behavior, base URL configuration, JWT headers, and error handling remain centralized.
- JWT authentication was implemented to protect transaction endpoints while keeping the demo login flow simple for review.
- Feature-based React folders keep UI components grouped by product capability, which makes the simulator, authentication, layout, and transaction management areas easier to navigate.

## Future Improvements

- Database persistence setup automation with migrations applied during local startup or deployment.
- Pagination and filtering for the all transactions view.
- Refresh tokens and stronger token lifecycle management.
- Role-based authorization for administrative workflows.
- Enhanced reporting and transaction analytics.
