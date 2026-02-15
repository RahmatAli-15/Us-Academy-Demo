"""Subject enumeration"""
from enum import Enum


class SubjectEnum(str, Enum):
    """Available subjects"""
    SOCIAL_STUDIES = "SOCIAL_STUDIES"
    PHYSICAL_EDUCATION = "PHYSICAL_EDUCATION"
    ART = "ART"
    SCIENCE = "SCIENCE"
    MATHS = "MATHS"
    ENGLISH = "ENGLISH"
    HINDI = "HINDI"

    # Legacy values kept for backward compatibility
    PHYSICS = "PHYSICS"
    CHEMISTRY = "CHEMISTRY"
    BIOLOGY = "BIOLOGY"
    COMPUTER = "COMPUTER"
