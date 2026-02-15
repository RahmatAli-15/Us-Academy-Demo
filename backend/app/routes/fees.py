"""Fees management routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models import Student
from app.schemas.fee import FeeCreate, FeeResponse, FeeUpdate
from app.services.fees import (
    create_fee,
    delete_fee,
    get_fee,
    get_student_fees,
    update_fee,
)

router = APIRouter(prefix="/admin/fees", tags=["admin-fees"])


@router.post("", response_model=FeeResponse, status_code=status.HTTP_201_CREATED)
async def add_fee(
    request: FeeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Add fee record for a student.
    
    Auto-calculates due_amount = amount - paid_amount
    
    Only admin can access.
    """
    fee = create_fee(
        db,
        student_id=request.student_id,
        amount=request.amount,
        paid_amount=request.paid_amount,
        remark=request.remark
    )
    
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return fee


@router.get("/student/{student_identifier}", response_model=list[FeeResponse])
async def get_student_fees_list(
    student_identifier: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get all fee records for a student by numeric ID or student_id string.
    
    Only admin can access.
    """
    resolved_student_id = None

    # Numeric identifier -> database primary key
    if student_identifier.isdigit():
        resolved_student_id = int(student_identifier)
    else:
        # Non-numeric identifier -> Student.student_id (e.g. STU5001)
        student = db.query(Student).filter(
            Student.student_id == student_identifier
        ).first()
        if student:
            resolved_student_id = student.id

    if resolved_student_id is None:
        return []

    fees = get_student_fees(db, resolved_student_id)
    return fees


@router.get("/{fee_id}", response_model=FeeResponse)
async def get_fee_record(
    fee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Get a specific fee record.
    
    Only admin can access.
    """
    fee = get_fee(db, fee_id)
    
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee record not found"
        )
    
    return fee


@router.put("/{fee_id}", response_model=FeeResponse)
async def update_fee_record(
    fee_id: int,
    request: FeeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Update fee record.
    
    Auto-recalculates due_amount when paid_amount changes.
    
    Test due calculation:
    - Create fee: amount=10000, paid_amount=3000 → due_amount=7000
    - Update to paid_amount=8000 → due_amount=2000
    
    Only admin can access.
    """
    fee = update_fee(db, fee_id, request.paid_amount, request.remark)
    
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee record not found"
        )
    
    return fee


@router.delete("/{fee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_fee_record(
    fee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Delete a fee record.
    
    Only admin can access.
    """
    deleted = delete_fee(db, fee_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee record not found"
        )
    
    return None
