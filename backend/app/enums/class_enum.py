"""Supported school class labels."""
from enum import Enum


class ClassEnum(str, Enum):
    """Class values from Nursery through 10."""
    NURSERY = "Nursery"
    LKG = "LKG"
    UKG = "UKG"
    CLASS_1 = "1"
    CLASS_2 = "2"
    CLASS_3 = "3"
    CLASS_4 = "4"
    CLASS_5 = "5"
    CLASS_6 = "6"
    CLASS_7 = "7"
    CLASS_8 = "8"
    CLASS_9 = "9"
    CLASS_10 = "10"


CLASS_LABELS = [member.value for member in ClassEnum]
PRE_PRIMARY_CLASS_LABELS = [ClassEnum.NURSERY.value, ClassEnum.LKG.value, ClassEnum.UKG.value]
PRIMARY_TO_SENIOR_CLASS_LABELS = [label for label in CLASS_LABELS if label not in PRE_PRIMARY_CLASS_LABELS]


def is_valid_class_label(value: str | None) -> bool:
    """Return True when the provided class label is supported."""
    normalized_value = getattr(value, "value", value)
    return str(normalized_value) in CLASS_LABELS
