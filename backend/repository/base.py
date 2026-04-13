"""
Base repository class with common database operations.

This module provides a generic repository pattern implementation that
can be extended by specific repositories.
"""

import sqlite3
from typing import Generic, TypeVar, List, Optional, Any, Dict, Tuple
from contextlib import contextmanager
from pydantic import BaseModel
from core.config import settings
from core.logging import get_logger
from core.exceptions import DatabaseError, DatabaseConnectionError

logger = get_logger(__name__)

T = TypeVar('T', bound=BaseModel)


class BaseRepository(Generic[T]):
    """
    Base repository providing common database operations.
    
    This class implements the Repository pattern, abstracting database
    access and providing type-safe operations.
    
    Type Parameters:
        T: Pydantic model type for this repository
    """
    
    def __init__(self, model_class: type[T], table_name: str):
        """
        Initialize repository.
        
        Args:
            model_class: Pydantic model class for type conversion
            table_name: Name of the database table
        """
        self.model_class = model_class
        self.table_name = table_name
        self.db_path = str(settings.database_path)
    
    @contextmanager
    def _get_connection(self):
        """
        Context manager for database connections.
        
        Automatically handles connection creation and cleanup,
        ensuring connections are always properly closed.
        
        Yields:
            sqlite3.Connection: Database connection
            
        Raises:
            DatabaseConnectionError: If connection fails
        """
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row  # Enable column access by name
            yield conn
            conn.commit()
        except sqlite3.Error as e:
            if conn:
                conn.rollback()
            logger.error(f"Database connection error: {e}")
            raise DatabaseConnectionError(str(e))
        finally:
            if conn:
                conn.close()
    
    def _row_to_dict(self, row: sqlite3.Row) -> Dict[str, Any]:
        """Convert database row to dictionary."""
        return dict(row) if row else {}
    
    def _row_to_model(self, row: sqlite3.Row) -> Optional[T]:
        """
        Convert database row to Pydantic model.
        
        Args:
            row: Database row
            
        Returns:
            Pydantic model instance or None if row is None
        """
        if not row:
            return None
        try:
            data = self._row_to_dict(row)
            # Handle JSON fields
            data = self._deserialize_json_fields(data)
            return self.model_class(**data)
        except Exception as e:
            logger.error(f"Error converting row to model: {e}, Row: {dict(row)}")
            raise DatabaseError(f"Failed to convert database row: {e}")
    
    def _deserialize_json_fields(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deserialize JSON string fields to Python objects.
        
        Override this in child classes to handle JSON columns.
        """
        return data
    
    def _serialize_for_db(self, model: BaseModel) -> Dict[str, Any]:
        """
        Serialize Pydantic model for database insertion.
        
        Override this in child classes to handle JSON columns.
        """
        return model.model_dump()
    
    def find_by_id(self, id: str) -> Optional[T]:
        """
        Find record by ID.
        
        Args:
            id: Record identifier
            
        Returns:
            Model instance or None if not found
        """
        query = f"SELECT * FROM {self.table_name} WHERE id = ?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (id,))
            row = cursor.fetchone()
            return self._row_to_model(row)
    
    def find_all(self, limit: Optional[int] = None, offset: int = 0) -> List[T]:
        """
        Find all records with optional pagination.
        
        Args:
            limit: Maximum number of records to return
            offset: Number of records to skip
            
        Returns:
            List of model instances
        """
        query = f"SELECT * FROM {self.table_name}"
        params: Tuple = ()
        
        if limit:
            query += " LIMIT ? OFFSET ?"
            params = (limit, offset)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [self._row_to_model(row) for row in rows if row]
    
    def find_by(self, **filters) -> List[T]:
        """
        Find records matching filters.
        
        Args:
            **filters: Column-value pairs to filter by
            
        Returns:
            List of matching model instances
            
        Example:
            >>> repo.find_by(user_id="123", status="active")
        """
        if not filters:
            return self.find_all()
        
        conditions = " AND ".join(f"{key} = ?" for key in filters.keys())
        query = f"SELECT * FROM {self.table_name} WHERE {conditions}"
        params = tuple(filters.values())
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [self._row_to_model(row) for row in rows if row]
    
    def find_one_by(self, **filters) -> Optional[T]:
        """
        Find first record matching filters.
        
        Args:
            **filters: Column-value pairs to filter by
            
        Returns:
            First matching model instance or None
        """
        results = self.find_by(**filters)
        return results[0] if results else None
    
    def create(self, model: BaseModel) -> T:
        """
        Insert new record.
        
        Args:
            model: Pydantic model to insert
            
        Returns:
            Created model instance
            
        Raises:
            DatabaseError: If insertion fails
        """
        data = self._serialize_for_db(model)
        columns = ", ".join(data.keys())
        placeholders = ", ".join("?" * len(data))
        query = f"INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders})"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, tuple(data.values()))
                logger.info(f"Created {self.table_name} record with ID: {data.get('id')}")
            except sqlite3.IntegrityError as e:
                logger.error(f"Integrity error creating {self.table_name}: {e}")
                raise DatabaseError(f"Record already exists or violates constraints: {e}")
        
        return self.find_by_id(data['id'])
    
    def update(self, id: str, **updates) -> Optional[T]:
        """
        Update record by ID.
        
        Args:
            id: Record identifier
            **updates: Fields to update
            
        Returns:
            Updated model instance or None if not found
        """
        if not updates:
            return self.find_by_id(id)
        
        set_clause = ", ".join(f"{key} = ?" for key in updates.keys())
        query = f"UPDATE {self.table_name} SET {set_clause} WHERE id = ?"
        params = tuple(updates.values()) + (id,)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            if cursor.rowcount == 0:
                logger.warning(f"No {self.table_name} found with ID: {id}")
                return None
            logger.info(f"Updated {self.table_name} with ID: {id}")
        
        return self.find_by_id(id)
    
    def delete(self, id: str) -> bool:
        """
        Delete record by ID.
        
        Args:
            id: Record identifier
            
        Returns:
            True if deleted, False if not found
        """
        query = f"DELETE FROM {self.table_name} WHERE id = ?"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (id,))
            deleted = cursor.rowcount > 0
            if deleted:
                logger.info(f"Deleted {self.table_name} with ID: {id}")
            else:
                logger.warning(f"No {self.table_name} found to delete with ID: {id}")
            return deleted
    
    def count(self, **filters) -> int:
        """
        Count records matching filters.
        
        Args:
            **filters: Column-value pairs to filter by
            
        Returns:
            Number of matching records
        """
        query = f"SELECT COUNT(*) FROM {self.table_name}"
        params: Tuple = ()
        
        if filters:
            conditions = " AND ".join(f"{key} = ?" for key in filters.keys())
            query += f" WHERE {conditions}"
            params = tuple(filters.values())
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchone()[0]
    
    def execute_query(self, query: str, params: Tuple = ()) -> List[Dict[str, Any]]:
        """
        Execute raw SQL query (use sparingly).
        
        Args:
            query: SQL query string
            params: Query parameters
            
        Returns:
            List of result dictionaries
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [self._row_to_dict(row) for row in rows]
