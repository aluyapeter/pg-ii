from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.security import verify_password, create_access_token
import jwt

router = APIRouter()

async def get_current_admin(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    try:
        _, _, token_value = token.partition(" ")
        
        payload = jwt.decode(token_value, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        
        if username != settings.ADMIN_USERNAME:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")
            
        return username
        
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@router.post("/login")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    """Verifies credentials and sets the HttpOnly cookie."""
    if form_data.username != settings.ADMIN_USERNAME or \
       not verify_password(form_data.password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
        
    access_token = create_access_token(subject=settings.ADMIN_USERNAME)
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.is_production,
        samesite="none",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    return {"message": "Successfully logged in"}

@router.post("/logout")
async def logout(response: Response):
    """Deletes the cookie from the user's browser."""
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}

@router.get("/me")
async def check_auth_status(admin: str = Depends(get_current_admin)):
    """A simple route the frontend can call to check if the user is currently logged in."""
    return {"username": admin, "authenticated": True}