# Buttondown Python Wrapper

Buttondown has an [OpenAPI spec](https://docs.buttondown.com/api-introduction) and a pleasant REST API, but we don't ship official client libraries. This is deliberate — we think you're better off owning a thin wrapper than depending on a generated SDK that drifts out of sync or drags in transitive dependencies you don't want.

This folder is that thin wrapper. Copy the `buttondown/` directory into your project, install `httpx`, and you're done. No package to pin, no version to track. If the API changes, you change your copy.

## Quick start

```bash
pip install httpx
```

Copy `buttondown/` into your project, then:

```python
from buttondown import Client, EmailInput, EmailStatus, SubscriberInput

bd = Client("your-api-key")

# List all emails
for email in bd.emails.list():
    print(email.subject)

# Create a draft
draft = bd.emails.create(EmailInput(
    subject="Hello, world!",
    body="...",
    status=EmailStatus.DRAFT,
))

# Create a subscriber
sub = bd.subscribers.create(SubscriberInput(
    email_address="someone@example.com",
    tags=["welcome"],
))

# Retrieve a subscriber by email
sub = bd.subscribers.retrieve("someone@example.com")
```

Your API key is available in [Settings > API](https://buttondown.com/settings#api).

## Methods

### `bd.emails`

| Method | Description |
| --- | --- |
| `list(**params)` | Iterate over `Email` objects. Accepts any [list filter](https://docs.buttondown.com/api-emails-list) as a keyword argument (e.g., `status=["draft"]`, `page_size=50`). |
| `create(data: EmailInput)` | Create an email, returns `Email`. See `EmailInput` for available fields. |
| `retrieve(id)` | Get a single `Email` by UUID. |
| `update(id, data: EmailUpdateInput)` | Patch an email by UUID, returns `Email`. Only set the fields you want to change. |
| `delete(id)` | Delete an email by UUID. |

### `bd.subscribers`

| Method | Description |
| --- | --- |
| `list(**params)` | Iterate over `Subscriber` objects. Accepts any [list filter](https://docs.buttondown.com/api-subscribers-list) as a keyword argument. |
| `create(data: SubscriberInput)` | Create a subscriber, returns `Subscriber`. `email_address` is required. |
| `retrieve(id_or_email)` | Get a `Subscriber` by UUID or email address. |
| `update(id_or_email, data: SubscriberUpdateInput)` | Patch a subscriber, returns `Subscriber`. |
| `delete(id_or_email)` | Delete a subscriber by UUID or email address. |

## Types

Inputs and outputs are typed dataclasses, so your editor can autocomplete field names:

```python
from buttondown import EmailInput, EmailStatus, EmailUpdateInput

# All fields except `subject` are optional on create
email = bd.emails.create(EmailInput(
    subject="Weekly digest",
    body="Here's what happened...",
    status=EmailStatus.DRAFT,
    metadata={"issue": 42},
))

# Responses are typed too — access fields as attributes
print(email.id)
print(email.status)
print(email.creation_date)

# On update, every field is optional — only set what you want to change
bd.emails.update(email.id, EmailUpdateInput(
    status=EmailStatus.ABOUT_TO_SEND,
))
```

## Pagination

`list()` returns a lazy iterator that fetches pages on demand. It walks through every page automatically — you just loop:

```python
for subscriber in bd.subscribers.list(tag=["premium"]):
    print(subscriber.email_address)
```

To limit the page size (default is 100, max is 1000):

```python
for email in bd.emails.list(page_size=50):
    ...
```

Since it's a generator, you can break early without fetching remaining pages.

## Error handling

Failed API calls raise `ButtondownError` with the status code and response body:

```python
from buttondown import Client, ButtondownError, EmailInput, EmailStatus

bd = Client("your-api-key")

try:
    bd.emails.create(EmailInput(subject="", status=EmailStatus.ABOUT_TO_SEND))
except ButtondownError as e:
    print(e.status_code)  # 400
    print(e.body)         # {"subject": ["This field may not be blank."]}
```

## Extending

The pattern is simple — to add another resource (e.g., tags, images), create a new file following the same shape as `emails.py`:

```python
from dataclasses import dataclass
from .client import _deserialize, _serialize

@dataclass
class TagInput:
    name: str
    color: str | None = None

@dataclass
class Tag:
    id: str | None = None
    name: str | None = None
    color: str | None = None
    creation_date: str | None = None

class TagsResource:
    def __init__(self, client):
        self._client = client

    def list(self, **params):
        for item in self._client.paginate("/v1/tags", params=params):
            yield _deserialize(Tag, item)

    def create(self, data: TagInput) -> Tag:
        return _deserialize(
            Tag, self._client.request("POST", "/v1/tags", json=_serialize(data))
        )

    # ... retrieve, update, delete
```

Then wire it up in `client.py`:

```python
from .tags import TagsResource

self.tags = TagsResource(self)
```

See the full API reference at [docs.buttondown.com](https://docs.buttondown.com/api-introduction).
