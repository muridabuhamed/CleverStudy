"""
Pytest configuration and shared fixtures.

This file is automatically discovered by pytest and provides
shared test fixtures and configuration.
"""
import pytest
import sys
from pathlib import Path

# Add backend directory to path so tests can import modules
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))


@pytest.fixture
def test_settings():
    """Provide test settings that override production settings."""
    from core.config import Settings
    
    return Settings(
        JWT_SECRET="test-secret-key",
        GEMINI_API_KEY="test-api-key",
        DATA_DIR=str(Path(__file__).parent / "test_data"),
        MAX_UPLOAD_SIZE="10MB"
    )


@pytest.fixture
def sample_pdf_text():
    """Provide sample PDF text for testing."""
    return """
    Introduction to Machine Learning
    
    Machine learning is a subset of artificial intelligence that focuses on
    building systems that can learn from data. The main types of machine
    learning are:
    
    1. Supervised Learning - Learning from labeled data
    2. Unsupervised Learning - Finding patterns in unlabeled data
    3. Reinforcement Learning - Learning through trial and error
    
    Key Concepts:
    - Training Data: The dataset used to train the model
    - Features: Input variables used for predictions
    - Labels: Output variables we want to predict
    - Model: The mathematical representation learned from data
    
    Common Algorithms:
    - Linear Regression
    - Decision Trees
    - Neural Networks
    - K-Means Clustering
    """


@pytest.fixture
def sample_questions():
    """Provide sample quiz questions for testing."""
    return [
        {
            "id": "q1",
            "text": "What is machine learning?",
            "options": [
                "A subset of AI",
                "A programming language",
                "A database system",
                "A web framework"
            ],
            "correctAnswer": 0,
            "explanation": "Machine learning is a subset of artificial intelligence."
        },
        {
            "id": "q2",
            "text": "Which type of ML learns from labeled data?",
            "options": [
                "Unsupervised Learning",
                "Supervised Learning",
                "Reinforcement Learning",
                "Deep Learning"
            ],
            "correctAnswer": 1,
            "explanation": "Supervised learning uses labeled training data."
        }
    ]


@pytest.fixture
def sample_topics():
    """Provide sample topics for testing."""
    return [
        "Machine Learning",
        "Supervised Learning",
        "Unsupervised Learning",
        "Reinforcement Learning",
        "Neural Networks",
        "Common Algorithms"
    ]


# Configure pytest markers
def pytest_configure(config):
    """Register custom pytest markers."""
    config.addinivalue_line(
        "markers", "unit: mark test as a unit test"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )
