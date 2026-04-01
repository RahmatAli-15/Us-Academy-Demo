"""Subject enumeration"""
from enum import Enum


class SubjectEnum(str, Enum):
    """Available subjects"""
    ENGLISH_GRAMMAR = "ENGLISH_GRAMMAR"
    HINDI_GRAMMAR = "HINDI_GRAMMAR"
    EVS_SCIENCE = "EVS_SCIENCE"
    MS_SST = "MS_SST"
    SOCIAL_STUDIES = "SOCIAL_STUDIES"
    PHYSICAL_EDUCATION = "PHYSICAL_EDUCATION"
    ART = "ART"
    SCIENCE = "SCIENCE"
    MATHS = "MATHS"
    ENGLISH = "ENGLISH"
    HINDI = "HINDI"
    URDU = "URDU"
    GK = "GK"
    PT = "PT"

    # Legacy values kept for backward compatibility
    PHYSICS = "PHYSICS"
    CHEMISTRY = "CHEMISTRY"
    BIOLOGY = "BIOLOGY"
    COMPUTER = "COMPUTER"
