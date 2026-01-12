<!-- INSIGHT BACKEND -->

<!-- UV SERVER START -->

uv run -m app.main

<!-- SWAGGER ENDPOINT -->
<!-- http://localhost:8000/docs -->

THINGS TO DO CHECKLIST:
LOOK INTO CURL CALLS
/components/
//module/
//page/
/context/
/pages/
//auth/

On the production server:
uv run fastapi dev app/main.py

requires-python = ">=3.11"
dependencies = [
    "aiofiles>=24.1.0",
    "aiosqlite>=0.20.0",
    "bcrypt==4.0.1",
    "boto3>=1.37.38",
    "email-validator>=2.3.0",
    "fastapi[all]>=0.116.2",
    "passlib[bcrypt,bycrypt]>=1.7.4",
    "pillow>=10.4.0",
    "pydantic-settings==2.9",
    "pydantic[email]>=2.10.6",
    "pyjwt>=2.10.1",
    "python-dotenv>=1.0.1",
    "python-jose[cryptography]>=3.4.0",
    "python-multipart>=0.0.20",
    "requests>=2.32.5",
    "sqlalchemy>=2.0.43",
    "uvicorn>=0.33.0",
]
