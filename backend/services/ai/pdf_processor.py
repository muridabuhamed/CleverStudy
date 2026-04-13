"""
PDF processing service.

This module handles PDF text extraction and processing.
"""
from pypdf import PdfReader
from pathlib import Path
from typing import Optional

from core.exceptions import FileProcessingError
from core.logging import get_logger

logger = get_logger(__name__)


class PdfProcessor:
    """
    Service for PDF file processing.
    
    Handles text extraction from PDF documents with optimization
    for large files.
    """
    
    DEFAULT_MAX_PAGES = 100
    
    def __init__(self, max_pages: int = DEFAULT_MAX_PAGES):
        """
        Initialize PDF processor.
        
        Args:
            max_pages: Maximum pages to process (default: 100)
        """
        self.max_pages = max_pages
        logger.info(f"PDF processor initialized (max_pages: {max_pages})")
    
    def extract_text(self, file_path: Path) -> str:
        """
        Extract text from PDF file.
        
        Optimizations:
        - Limits pages to avoid processing huge documents
        - Skips empty pages
        - Early return on errors
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted text
            
        Raises:
            FileProcessingError: If extraction fails
        """
        if not file_path.exists():
            raise FileProcessingError(f"PDF file not found: {file_path}")
        
        if not file_path.suffix.lower() == '.pdf':
            raise FileProcessingError(f"Not a PDF file: {file_path}")
        
        try:
            logger.info(f"Extracting text from PDF: {file_path.name}")
            
            reader = PdfReader(str(file_path))
            total_pages = len(reader.pages)
            num_pages = min(total_pages, self.max_pages)
            
            if total_pages > self.max_pages:
                logger.warning(
                    f"PDF has {total_pages} pages, limiting to {self.max_pages}"
                )
            
            text_parts = []
            empty_pages = 0
            
            for i in range(num_pages):
                try:
                    page_text = reader.pages[i].extract_text()
                    
                    if page_text and page_text.strip():
                        text_parts.append(page_text)
                    else:
                        empty_pages += 1
                        
                except Exception as e:
                    logger.warning(f"Failed to extract page {i+1}: {e}")
                    continue
            
            full_text = "\n".join(text_parts).strip()
            
            logger.info(
                f"Extracted {len(full_text)} chars from {num_pages} pages "
                f"({empty_pages} empty pages skipped)"
            )
            
            if not full_text:
                raise FileProcessingError(
                    "No text could be extracted from PDF. "
                    "The file may be empty or contain only images."
                )
            
            return full_text
            
        except FileProcessingError:
            raise
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}", exc_info=True)
            raise FileProcessingError(f"Failed to extract PDF text: {str(e)}")
    
    def get_page_count(self, file_path: Path) -> int:
        """
        Get the number of pages in a PDF.
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Number of pages
            
        Raises:
            FileProcessingError: If reading fails
        """
        if not file_path.exists():
            raise FileProcessingError(f"PDF file not found: {file_path}")
        
        try:
            reader = PdfReader(str(file_path))
            return len(reader.pages)
            
        except Exception as e:
            logger.error(f"Failed to get page count: {e}")
            raise FileProcessingError(f"Failed to read PDF: {str(e)}")
    
    def extract_page_text(
        self,
        file_path: Path,
        page_number: int
    ) -> str:
        """
        Extract text from a specific page.
        
        Args:
            file_path: Path to PDF file
            page_number: Page number (1-indexed)
            
        Returns:
            Page text
            
        Raises:
            FileProcessingError: If extraction fails
        """
        if not file_path.exists():
            raise FileProcessingError(f"PDF file not found: {file_path}")
        
        try:
            reader = PdfReader(str(file_path))
            total_pages = len(reader.pages)
            
            if page_number < 1 or page_number > total_pages:
                raise FileProcessingError(
                    f"Invalid page number: {page_number}. "
                    f"PDF has {total_pages} pages."
                )
            
            # pypdf uses 0-indexed pages
            page = reader.pages[page_number - 1]
            text = page.extract_text()
            
            logger.debug(f"Extracted page {page_number}: {len(text)} chars")
            
            return text.strip()
            
        except FileProcessingError:
            raise
        except Exception as e:
            logger.error(f"Failed to extract page {page_number}: {e}")
            raise FileProcessingError(
                f"Failed to extract page {page_number}: {str(e)}"
            )
    
    def validate_pdf(self, file_path: Path) -> bool:
        """
        Validate that a file is a readable PDF.
        
        Args:
            file_path: Path to file
            
        Returns:
            True if valid PDF
        """
        try:
            if not file_path.exists():
                return False
            
            if not file_path.suffix.lower() == '.pdf':
                return False
            
            # Try to open it
            reader = PdfReader(str(file_path))
            
            # Check it has pages
            if len(reader.pages) == 0:
                return False
            
            return True
            
        except Exception as e:
            logger.debug(f"PDF validation failed: {e}")
            return False
