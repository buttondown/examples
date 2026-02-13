from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from enum import Enum
from typing import Any

from .client import _deserialize, _serialize


class EmailStatus(str, Enum):
    ABOUT_TO_SEND = "about_to_send"
    DRAFT = "draft"
    IMPORTED = "imported"
    SCHEDULED = "scheduled"
    TRANSACTIONAL = "transactional"


@dataclass
class EmailInput:
    subject: str
    attachments: list[str] | None = None
    body: str | None = None
    canonical_url: str | None = None
    commenting_mode: str | None = None
    description: str | None = None
    email_type: str | None = None
    featured: bool | None = None
    filters: dict[str, Any] | None = None
    image: str | None = None
    metadata: dict[str, Any] | None = None
    publish_date: str | None = None
    related_email_ids: list[str] | None = None
    secondary_id: int | None = None
    slug: str | None = None
    status: EmailStatus | None = None


@dataclass
class EmailUpdateInput:
    attachments: list[str] | None = None
    body: str | None = None
    canonical_url: str | None = None
    commenting_mode: str | None = None
    description: str | None = None
    email_type: str | None = None
    featured: bool | None = None
    filters: dict[str, Any] | None = None
    image: str | None = None
    metadata: dict[str, Any] | None = None
    publish_date: str | None = None
    related_email_ids: list[str] | None = None
    secondary_id: int | None = None
    slug: str | None = None
    status: EmailStatus | None = None
    subject: str | None = None


@dataclass
class Email:
    absolute_url: str | None = None
    analytics: dict[str, Any] | None = None
    attachments: list[str] | None = None
    body: str | None = None
    canonical_url: str | None = None
    commenting_mode: str | None = None
    creation_date: str | None = None
    description: str | None = None
    email_type: str | None = None
    featured: bool | None = None
    filters: dict[str, Any] | None = None
    id: str | None = None
    image: str | None = None
    metadata: dict[str, Any] | None = None
    modification_date: str | None = None
    publish_date: str | None = None
    related_email_ids: list[str] | None = None
    secondary_id: int | None = None
    should_trigger_pay_per_email_billing: bool | None = None
    slug: str | None = None
    source: str | None = None
    status: str | None = None
    subject: str | None = None
    suppression_reason: str | None = None
    template: str | None = None


class EmailsResource:
    def __init__(self, client):
        self._client = client

    def list(self, **params: Any) -> Iterator[Email]:
        """Iterate over all emails, paginating automatically."""
        for item in self._client.paginate("/v1/emails", params=params):
            yield _deserialize(Email, item)

    def create(self, data: EmailInput) -> Email:
        """Create a new email."""
        return _deserialize(
            Email, self._client.request("POST", "/v1/emails", json=_serialize(data))
        )

    def retrieve(self, id: str) -> Email:
        """Retrieve a single email by ID."""
        return _deserialize(Email, self._client.request("GET", f"/v1/emails/{id}"))

    def update(self, id: str, data: EmailUpdateInput) -> Email:
        """Update an email by ID."""
        return _deserialize(
            Email,
            self._client.request("PATCH", f"/v1/emails/{id}", json=_serialize(data)),
        )

    def delete(self, id: str) -> None:
        """Delete an email by ID."""
        return self._client.request("DELETE", f"/v1/emails/{id}")
