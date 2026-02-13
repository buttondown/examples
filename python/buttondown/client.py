from __future__ import annotations

import dataclasses
from collections.abc import Iterator
from typing import Any

import httpx

BASE_URL = "https://api.buttondown.com"


def _serialize(obj: Any) -> dict[str, Any]:
    """Convert a dataclass to a dict, stripping None values."""
    return {k: v for k, v in dataclasses.asdict(obj).items() if v is not None}


def _deserialize(cls: type, data: dict[str, Any]) -> Any:
    """Construct a dataclass from a dict, ignoring unknown fields."""
    field_names = {f.name for f in dataclasses.fields(cls)}
    return cls(**{k: v for k, v in data.items() if k in field_names})


class ButtondownError(Exception):
    """Raised when the Buttondown API returns a non-success response."""

    def __init__(self, status_code: int, body: Any):
        self.status_code = status_code
        self.body = body
        super().__init__(f"Buttondown API error ({status_code}): {body}")


class Client:
    def __init__(self, api_key: str):
        self._http = httpx.Client(
            base_url=BASE_URL,
            headers={"Authorization": f"Token {api_key}"},
        )

        # Import here to avoid circular imports
        from .emails import EmailsResource
        from .subscribers import SubscribersResource

        self.emails = EmailsResource(self)
        self.subscribers = SubscribersResource(self)

    def request(self, method: str, path: str, **kwargs: Any) -> Any:
        response = self._http.request(method, path, **kwargs)
        if not response.is_success:
            raise ButtondownError(response.status_code, response.json())
        if response.status_code == 204:
            return None
        return response.json()

    def paginate(
        self, path: str, params: dict[str, Any] | None = None
    ) -> Iterator[dict[str, Any]]:
        params = dict(params or {})
        while True:
            data = self.request("GET", path, params=params)
            yield from data["results"]
            if not data.get("next"):
                break
            next_url = httpx.URL(data["next"])
            params = dict(next_url.params)
