from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any

from .client import _deserialize, _serialize


@dataclass
class SubscriberInput:
    email_address: str
    ip_address: str | None = None
    metadata: dict[str, Any] | None = None
    notes: str | None = None
    referrer_url: str | None = None
    referring_subscriber_id: str | None = None
    tags: list[str] | None = None
    type: str | None = None
    utm_campaign: str | None = None
    utm_medium: str | None = None
    utm_source: str | None = None


@dataclass
class SubscriberUpdateInput:
    email_address: str | None = None
    ip_address: str | None = None
    metadata: dict[str, Any] | None = None
    name: str | None = None
    notes: str | None = None
    referrer_url: str | None = None
    tags: list[str] | None = None
    type: str | None = None
    utm_campaign: str | None = None
    utm_medium: str | None = None
    utm_source: str | None = None


@dataclass
class Subscriber:
    avatar_url: str | None = None
    churn_date: str | None = None
    click_rate: float | None = None
    clicked_count: int | None = None
    creation_date: str | None = None
    delivered_count: int | None = None
    email_address: str | None = None
    email_transitions: list[dict[str, Any]] | None = None
    firewall_reasons: list[str] | None = None
    form_id: str | None = None
    gift_subscription_message: str | None = None
    id: str | None = None
    ip_address: str | None = None
    last_click_date: str | None = None
    last_open_date: str | None = None
    metadata: dict[str, Any] | None = None
    notes: str | None = None
    open_count: int | None = None
    open_rate: float | None = None
    purchased_by: str | None = None
    purchased_message: str | None = None
    referral_code: str | None = None
    referrer_url: str | None = None
    risk_score: float | None = None
    secondary_id: int | None = None
    source: str | None = None
    stripe_coupon: dict[str, Any] | None = None
    stripe_customer: dict[str, Any] | None = None
    stripe_customer_id: str | None = None
    subscriber_import_id: str | None = None
    tags: list[str] | None = None
    transitions: list[dict[str, Any]] | None = None
    type: str | None = None
    undeliverability_date: str | None = None
    undeliverability_reason: str | None = None
    unsubscription_date: str | None = None
    unsubscription_reason: str | None = None
    upgrade_date: str | None = None
    utm_campaign: str | None = None
    utm_medium: str | None = None
    utm_source: str | None = None


class SubscribersResource:
    def __init__(self, client):
        self._client = client

    def list(self, **params: Any) -> Iterator[Subscriber]:
        """Iterate over all subscribers, paginating automatically."""
        for item in self._client.paginate("/v1/subscribers", params=params):
            yield _deserialize(Subscriber, item)

    def create(self, data: SubscriberInput) -> Subscriber:
        """Create a new subscriber."""
        return _deserialize(
            Subscriber,
            self._client.request("POST", "/v1/subscribers", json=_serialize(data)),
        )

    def retrieve(self, id_or_email: str) -> Subscriber:
        """Retrieve a subscriber by ID or email address."""
        return _deserialize(
            Subscriber,
            self._client.request("GET", f"/v1/subscribers/{id_or_email}"),
        )

    def update(self, id_or_email: str, data: SubscriberUpdateInput) -> Subscriber:
        """Update a subscriber by ID or email address."""
        return _deserialize(
            Subscriber,
            self._client.request(
                "PATCH",
                f"/v1/subscribers/{id_or_email}",
                json=_serialize(data),
            ),
        )

    def delete(self, id_or_email: str) -> None:
        """Delete a subscriber by ID or email address."""
        return self._client.request("DELETE", f"/v1/subscribers/{id_or_email}")
