# Caching Proxy CLI

A simple and fast caching proxy server built with Node.js that forwards requests to an origin server and caches responses for improved performance.

## 🚀 Features

- **Request Forwarding**: Proxy all HTTP requests to any origin server
- **In-Memory Caching**: Cache responses using NodeCache for fast retrieval
- **Cache Headers**: Automatic `X-Cache: HIT/MISS` headers to indicate cache status
- **Multiple HTTP Methods**: Support for GET, POST, PUT, DELETE, and other HTTP methods
- **Cache Management**: Clear cache via HTTP endpoint
- **Clean CLI**: Simple command-line interface with proper validation

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/nikusha1446/caching-proxy-cli.git
cd caching-proxy-cli

# Install dependencies
npm install
```

## 🚀 Usage

### Start the Proxy Server

```bash
node index.js --port <number> --origin <url>
```

**Example:**
```bash
node index.js --port 3000 --origin http://dummyjson.com
```

This starts a caching proxy server on port 3000 that forwards requests to `http://dummyjson.com`.

### Make Requests

Once the server is running, you can make requests to your proxy:

```bash
# First request - Cache MISS
curl http://localhost:3000/products

# Second request - Cache HIT (served from cache)
curl http://localhost:3000/products

# Different endpoint - Cache MISS
curl http://localhost:3000/users
```

### Clear Cache

While the server is running, you can clear the cache:

```bash
node index.js --clear-cache --proxy-port 3000
```

Or use HTTP directly:
```bash
curl -X DELETE http://localhost:3000/cache
```

## 🛠️ API Endpoints

### Proxy Endpoints
- `GET|POST|PUT|DELETE /*` - Forwards requests to origin server with caching

### Management Endpoints
- `DELETE /cache` - Clears all cached responses

**Response format:**
```json
{
  "message": "Cache cleared successfully",
  "removedItems": 5
}
```

## ⚙️ CLI Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| `--port` | number | Port for the proxy server | Yes (for server) |
| `--origin` | string | Origin server URL | Yes (for server) |
| `--clear-cache` | boolean | Clear the cache | No |
| `--proxy-port` | number | Port of running proxy (for cache clearing) | Yes (with --clear-cache) |

## 💡 Examples

### Basic Usage
```bash
# Start proxy server
node index.js --port 3000 --origin http://dummyjson.com

# Make requests
curl http://localhost:3000/posts/1    # Cache MISS
curl http://localhost:3000/posts/1    # Cache HIT

# Clear cache
node index.js --clear-cache --proxy-port 3000
```

## 🔧 How It Works

1. **Request Forwarding**: Incoming requests are forwarded to the origin server
2. **Response Caching**: Successful responses are cached with a key based on HTTP method and URL
3. **Cache Lookup**: Subsequent identical requests are served from cache
4. **Cache Headers**: Responses include `X-Cache: HIT` or `X-Cache: MISS` headers

## 📄 License

ISC
