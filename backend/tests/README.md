# CleverStudy Backend Tests

This directory contains comprehensive test suites for the CleverStudy backend.

## Test Structure

```
tests/
├── conftest.py                 # Shared fixtures and configuration
├── test_user_repository.py     # Repository layer tests
├── test_auth_service.py        # Service layer tests
└── README.md                   # This file
```

## Running Tests

### Run all tests
```bash
pytest
```

### Run with coverage
```bash
pytest --cov=backend --cov-report=html
```

### Run specific test file
```bash
pytest tests/test_auth_service.py
```

### Run tests by marker
```bash
pytest -m unit          # Only unit tests
pytest -m integration   # Only integration tests
pytest -m "not slow"    # Skip slow tests
```

### Verbose output
```bash
pytest -v
```

## Test Categories

### Unit Tests (`@pytest.mark.unit`)
- Test individual functions/methods in isolation
- Use mocks for dependencies
- Fast execution
- Example: `test_auth_service.py`

### Integration Tests (`@pytest.mark.integration`)
- Test multiple components together
- May use real database connections
- Slower execution
- Example: API route tests

## Writing Tests

### Repository Tests
Repository tests use an in-memory SQLite database:

```python
@pytest.fixture
def user_repository(in_memory_db, monkeypatch):
    repo = UserRepository()
    monkeypatch.setattr(repo, '_get_connection', lambda: in_memory_db)
    return repo

def test_create_user(user_repository):
    user = UserModel(id="123", email="test@example.com", ...)
    created = user_repository.create(user)
    assert created.id == "123"
```

### Service Tests
Service tests use mocked repositories:

```python
@pytest.fixture
def auth_service(mock_user_repository):
    return AuthService(mock_user_repository)

def test_register_user(auth_service, mock_user_repository):
    mock_user_repository.email_exists.return_value = False
    user, token = auth_service.register_user(user_data)
    assert user is not None
```

### API Tests
API tests use FastAPI TestClient:

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_login_endpoint():
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "token" in response.json()
```

## Shared Fixtures

The `conftest.py` file provides shared fixtures:

- `test_settings`: Override production settings for tests
- `sample_pdf_text`: Sample PDF content
- `sample_questions`: Sample quiz questions
- `sample_topics`: Sample document topics

Use these in your tests:

```python
def test_analyze_document(sample_pdf_text):
    result = analyze_document(sample_pdf_text)
    assert "topics" in result
```

## Coverage Goals

- **Repository Layer**: 90%+ coverage
- **Service Layer**: 85%+ coverage
- **API Layer**: 80%+ coverage
- **Overall**: 80%+ coverage

## Best Practices

1. **One assertion per test** (when possible)
2. **Descriptive test names** (`test_login_with_invalid_password`)
3. **AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies** (databases, APIs)
5. **Use fixtures** for common test data
6. **Test edge cases** (empty strings, None, etc.)
7. **Test error conditions** (not just happy path)

## Example Test Template

```python
"""
Tests for [module name].

Description of what this test file covers.
"""
import pytest
from unittest.mock import Mock

# Import module under test
from services.my_service import MyService


@pytest.fixture
def my_service():
    """Setup service for testing."""
    return MyService()


class TestMyService:
    """Test cases for MyService."""
    
    def test_feature_success(self, my_service):
        """Test successful operation."""
        # Arrange
        input_data = {"key": "value"}
        
        # Act
        result = my_service.do_something(input_data)
        
        # Assert
        assert result is not None
        assert result.key == "value"
    
    def test_feature_error_handling(self, my_service):
        """Test error handling."""
        with pytest.raises(ValueError):
            my_service.do_something(None)
```

## Continuous Integration

Tests run automatically on:
- Every commit
- Pull requests
- Before deployment

CI pipeline fails if:
- Any test fails
- Coverage drops below 80%
- Code style violations exist

## Debugging Tests

### Run single test with output
```bash
pytest tests/test_auth_service.py::TestAuthService::test_login_user_success -v -s
```

### Run with debugger
```bash
pytest --pdb
```

### See print statements
```bash
pytest -s
```

## Dependencies

Tests require:
- `pytest` - Test framework
- `pytest-cov` - Coverage plugin
- `pytest-mock` - Mocking utilities

Install with:
```bash
pip install pytest pytest-cov pytest-mock
```
