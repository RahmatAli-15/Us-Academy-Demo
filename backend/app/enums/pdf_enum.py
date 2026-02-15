"""PDF category enumeration"""
from enum import Enum


class PdfCategory(str, Enum):
    """PDF document categories"""
    NOTICE = "NOTICE"
    DATESHEET = "DATESHEET"
    CIRCULAR = "CIRCULAR"
    EVENT = "EVENT"
