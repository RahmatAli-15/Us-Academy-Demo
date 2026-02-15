"""Dependency injection for authentication and authorization"""
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import verify_token

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Get current user from JWT token.
    
    Extracts and verifies the JWT token from the Authorization header.
    
    Args:
        credentials: HTTP Bearer credentials from Authorization header
        
    Returns:
        Decoded token payload containing user data and role
        
    Raises:
        HTTPException: If token is invalid or expired (401)
    """
    token = credentials.credentials
    
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_optional)
) -> Optional[dict]:
    """
    Get current user from JWT token (optional).
    
    Returns None if no token provided, otherwise validates and returns user.
    
    Args:
        credentials: Optional HTTP Bearer credentials
        
    Returns:
        Decoded token payload or None if not provided
        
    Raises:
        HTTPException: If token is invalid (but not if missing)
    """
    if credentials is None:
        return None
    
    payload = verify_token(credentials.credentials)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload


async def require_admin(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Dependency to require admin role.
    
    Ensures the current user has admin role.
    
    Args:
        current_user: Current user from get_current_user dependency
        
    Returns:
        Current user data if role is admin
        
    Raises:
        HTTPException: If user is not admin (403)
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user


async def require_student(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Dependency to require student role.
    
    Ensures the current user has student role.
    
    Args:
        current_user: Current user from get_current_user dependency
        
    Returns:
        Current user data if role is student
        
    Raises:
        HTTPException: If user is not student (403)
    """
    if current_user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required"
        )
    
    return current_user
