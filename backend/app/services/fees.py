"""Fees management service"""
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Fees


def create_fee(
    db: Session,
    student_id: int,
    amount: float,
    paid_amount: float = 0.0,
    remark: Optional[str] = None
) -> Optional[Fees]:
    """
    Create a new fee record for a student.
    
    Auto-calculates due_amount = amount - paid_amount
    
    Args:
        db: Database session
        student_id: Student database ID
        amount: Total fee amount
        paid_amount: Amount already paid
        remark: Optional remark
        
    Returns:
        Created Fees object
    """
    due_amount = amount - paid_amount
    
    new_fee = Fees(
        student_id=student_id,
        amount=amount,
        paid_amount=paid_amount,
        due_amount=due_amount,
        remark=remark
    )
    
    db.add(new_fee)
    db.commit()
    db.refresh(new_fee)
    return new_fee


def get_fee(db: Session, fee_id: int) -> Optional[Fees]:
    """
    Get a specific fee record.
    
    Args:
        db: Database session
        fee_id: Fee record ID
        
    Returns:
        Fees object or None
    """
    return db.query(Fees).filter(Fees.id == fee_id).first()


def get_student_fees(db: Session, student_id: int) -> List[Fees]:
    """
    Get all fee records for a student.
    
    Args:
        db: Database session
        student_id: Student database ID
        
    Returns:
        List of Fees objects
    """
    return db.query(Fees).filter(Fees.student_id == student_id).order_by(
        Fees.created_at.desc()
    ).all()


def update_fee(
    db: Session,
    fee_id: int,
    paid_amount: Optional[float] = None,
    remark: Optional[str] = None
) -> Optional[Fees]:
    """
    Update a fee record.
    
    Auto-recalculates due_amount when paid_amount changes.
    
    Args:
        db: Database session
        fee_id: Fee record ID
        paid_amount: Updated paid amount
        remark: Updated remark
        
    Returns:
        Updated Fees object or None if not found
    """
    fee = db.query(Fees).filter(Fees.id == fee_id).first()
    
    if not fee:
        return None
    
    if paid_amount is not None:
        fee.paid_amount = paid_amount
        fee.due_amount = fee.amount - paid_amount
        fee.payment_date = datetime.utcnow()
    
    if remark is not None:
        fee.remark = remark
    
    db.commit()
    db.refresh(fee)
    return fee


def delete_fee(db: Session, fee_id: int) -> bool:
    """
    Delete a fee record.
    
    Args:
        db: Database session
        fee_id: Fee record ID
        
    Returns:
        True if deleted, False if not found
    """
    fee = db.query(Fees).filter(Fees.id == fee_id).first()
    
    if not fee:
        return False
    
    db.delete(fee)
    db.commit()
    return True
