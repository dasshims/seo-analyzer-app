# SEO Analyzer Backend

## Project Overview

The SEO Analyzer backend provides a FastAPI-based service that fetches a public website, measures its response time, extracts key SEO tags, and generates natural-language recommendations via OpenAI. The API also stores a small history of recently analysed sites for quick retrieval.

## Prerequisites

- Python 3.11+
- `pip` for dependency management
- (Optional) `virtualenv` or similar tool for isolated environments

## Setup Instructions

1. **Clone the repository** and switch into this directory.
2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate   # macOS/Linux
   venv\Scripts\activate      # Windows
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env`.
   - Set `OPENAI_API_KEY` inside `.env`.

## Running the Server

Start the development server with:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Interactive documentation is automatically generated at `/docs` (Swagger UI) and `/redoc`.

## API Usage

- **POST `/analyze`**
  - Body:

    ```json
    {
      "url": "https://example.com"
    }
    ```

  - Response (abridged example):

    ```json
    {
      "url": "https://example.com/",
      "status_code": 200,
      "load_time_ms": 850.34,
      "seo_tags": {
        "title": "Example Domain",
        "meta_description": "...",
        "canonical_url": "https://example.com/"
      },
      "issues": ["Meta description is missing."],
      "ai_feedback": "...",
      "google_preview": {
        "title": "Example Domain",
        "snippet": "..."
      },
      "social_preview": {
        "title": "Example Domain",
        "description": "..."
      }
    }
    ```

- **GET `/recent`**
  - Returns the last 20 analysed URLs with timestamps, status codes, and load times.

- **GET `/health`**
  - Returns `{ "status": "ok" }` for health checks.

- **POST `/traceroute`**
  - Body:

    ```json
    {
      "url": "https://example.com"
    }
    ```

  - Runs a traceroute against the URL host and responds with parsed hops and the raw command output. Requires the system `traceroute` (macOS/Linux) or `tracert` (Windows) binary to be available in the server environment.

- **GET `/analyze/{url}`** (optional convenience route)
  - Analyse a URL supplied as a path parameter. If the URL lacks a scheme, `https://` is assumed.

## Notes for Future Frontend

CORS is configured to allow requests from `http://localhost:5173`, making it ready for integration with a Vite/React frontend.
