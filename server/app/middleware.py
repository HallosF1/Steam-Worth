from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict
from typing import Dict
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logger = logging.getLogger(__name__)

class Middleware(BaseHTTPMiddleware):
    def __init__(self, app, rate_limit_interval: float = 0.06): # 1000 requests per minute
        super().__init__(app)
        self.rate_limit_records: Dict[str, float] = defaultdict(float)
        self.rate_limit_interval = rate_limit_interval

    async def log_message(self, message: str):
        logger.info(message)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        if current_time - self.rate_limit_records[client_ip] < self.rate_limit_interval:
            return Response(content="Rate limit exceeded", status_code=429)

        self.rate_limit_records[client_ip] = current_time
        path = request.url.path
        await self.log_message(f"Request to {path}")

        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        custom_headers = {"X-Process-Time": str(process_time)}
        for header, value in custom_headers.items():
            response.headers.append(header, value)

        await self.log_message(f"Response for {path} took {process_time} seconds")

        return response