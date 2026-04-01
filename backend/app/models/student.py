"""Student model"""
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base
class Student(Base):
    """Student model for school management system"""
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    class_ = Column(String(20), nullable=False)
    dob = Column(Date, nullable=False)
    aadhaar_number = Column(String(12), unique=True, nullable=False)
    dob_in_words = Column(String(100), nullable=True)
    pen_number = Column(String(50), nullable=True)
    apaar_id = Column(String(50), nullable=True)
    admission_class = Column(String(20), nullable=True)
    subject = Column(String(100), nullable=True)
    father_name = Column(String(100), nullable=True)
    father_aadhaar_number = Column(String(12), nullable=True)
    mother_name = Column(String(100), nullable=True)
    mother_aadhaar_number = Column(String(12), nullable=True)
    guardian_name = Column(String(100), nullable=True)
    guardian_aadhaar_number = Column(String(12), nullable=True)
    guardian_relationship = Column(String(100), nullable=True)
    admission_date = Column(Date, nullable=True)
    previous_class = Column(String(20), nullable=True)
    previous_school = Column(String(255), nullable=True)
    gender = Column(String(20), nullable=True)
    religion = Column(String(50), nullable=True)
    caste = Column(String(50), nullable=True)
    sub_caste = Column(String(50), nullable=True)
    residence_period_uttar_pradesh = Column(String(100), nullable=True)
    disability = Column(String(20), nullable=True)
    disability_type = Column(String(100), nullable=True)
    disability_percentage = Column(String(20), nullable=True)
    ration_card_type = Column(String(50), nullable=True)
    father_education = Column(String(100), nullable=True)
    father_occupation = Column(String(100), nullable=True)
    mother_education = Column(String(100), nullable=True)
    mother_occupation = Column(String(100), nullable=True)
    category_bpl = Column(String(20), nullable=True)
    indian_citizenship = Column(String(20), nullable=True)
    out_of_school_child = Column(String(20), nullable=True)
    last_academic_result = Column(String(255), nullable=True)
    previous_academic_marks = Column(String(100), nullable=True)
    school_last_attended_days = Column(String(50), nullable=True)
    mobile_number_1 = Column(String(15), nullable=True)
    whatsapp_number_2 = Column(String(15), nullable=True)
    phone = Column(String(15), nullable=True)
    address = Column(String(255), nullable=True)
    pin_code = Column(String(10), nullable=True)
    account_holder_name = Column(String(100), nullable=True)
    account_holder_aadhaar_number = Column(String(12), nullable=True)
    bank_name = Column(String(100), nullable=True)
    branch_name = Column(String(100), nullable=True)
    ifsc_code = Column(String(20), nullable=True)
    aadhaar_registered_mobile = Column(String(15), nullable=True)
    aadhaar_registered_pin_code = Column(String(10), nullable=True)
    email = Column(String(100), nullable=True)
    blood_group = Column(String(10), nullable=True)
    weight = Column(String(20), nullable=True)
    height = Column(String(20), nullable=True)
    profile_photo_path = Column(String(255), nullable=True)
    guardian_declaration = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    fees = relationship("Fees", back_populates="student", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="student", cascade="all, delete-orphan")

    @property
    def profile_photo_url(self):
        """Return a public URL for the student's uploaded photo."""
        if not self.profile_photo_path:
            return None
        return f"/{self.profile_photo_path.lstrip('/')}"

    def __repr__(self):
        return f"<Student(id={self.id}, student_id={self.student_id}, name={self.name})>"
