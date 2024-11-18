# auth-proxy-router  

## Description  
A lightweight Node.js Express microservice that serves as a reverse proxy, forwarding API requests to an Authentication Microservice hosted on an EC2 server.  

## Features  
- Routes all requests seamlessly to the target authentication server.  
- Supports all HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, etc.).  
- Transparent request forwarding with minimal latency.  
- Built with Express and `http-proxy`.  

## Getting Started  

### Prerequisites  
- Node.js (v14 or later)  
- NPM  

### Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/MuhammedBasith/auth-proxy-router.git
   cd auth-proxy-router
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure `.env` (optional):  
   You can specify the dummy server's port in a `.env` file:  
   ```env
   PORT=3000
   ```

### Usage  
Start the dummy server:  
```bash
node dummy-server.ts
```  

The dummy server will run on `http://localhost:3000`. All incoming requests will be forwarded to the Authentication Microservice hosted at `http://43.205.196.66:3001`.

### Example Requests  

- **Route to `/api/auth/verify`**:  
  ```bash
  curl -X POST http://localhost:3000/api/auth/verify -d '{"token": "abc123"}' -H "Content-Type: application/json"
  ```
  The request is forwarded to `http://43.205.196.66:3001/api/auth/verify`.

- **Route to `/api/auth/hello`**:  
  ```bash
  curl http://localhost:3000/api/auth/hello
  ```
  Returns a response from the Auth MS saying:  
  ```json
  {"message": "Alive!"}
  ```

### Dependencies  
- [express](https://www.npmjs.com/package/express)  
- [cors](https://www.npmjs.com/package/cors)  
- [http-proxy](https://www.npmjs.com/package/http-proxy)  

### License  
This project is licensed under the MIT License.