# Insight

Blue:
#263248

Green:
#BDD63B

USE PIP INSTEAD





cPanel / WHM environments limitations:
❌ Do not support long-running processes (Node, Uvicorn, Gunicorn ASGI)
❌ Expect PHP or WSGI, not ASGI
❌ Kill background workers
❌ No reverse proxy (nginx) unless you pay for custom config
❌ No process manager (PM2, Supervisor, systemd)

Your app requires:
A persistent ASGI server (FastAPI + Uvicorn)
A build step for React (Vite)
A static file host OR CDN
Environment variables
HTTPS termination + proxying
cPanel was designed in 2008-era PHP shared hosting, not modern web apps.




DB





Backend
FastAPI
Gunicorn + Uvicorn
Hosted on Render

Frontend
React + Vite
Hosted on S3 + CloudFront
Auth
AWS Cognito

Images
S3 (already good)




python3 -m venv venv


source venv/bin/activate


which python
which pip


Output /path/to/backend/venv/bin/python
/path/to/backend/venv/bin/pip

uvicorn app.main:app --reload
http://127.0.0.1:8000



Project Status Bookmark
Backend (FastAPI)
* ✅ Old backend archived in OLDFILES/backend_old/
* ✅ New backend folder created (backend/)
* ✅ Virtual environment set up (venv)
* ✅ Core dependencies installed (fastapi, uvicorn, sqlalchemy, psycopg2-binary, python-dotenv)
* ✅ Project structure created (app/, main.py, config.py, db.py)
* ✅ Local FastAPI test working ({"status":"ok"})
* ✅ Committed to GitHub
* ✅ Render service created, root directory set to backend
* ✅ Build command corrected (pip install -r requirements.txt)
* ✅ Start command corrected (uvicorn app.main:app --host 0.0.0.0 --port 10000)
* ❌ PostgreSQL DB not yet created (pending Render free-tier + credit card)
* ❌ Backend not fully connected to DB yet

Frontend (React / Vite)
* ✅ Old frontend archived in OLDFILES/frontend_old/
* ✅ Ready to create a fresh React + Vite frontend
* ❌ Not yet built or connected to backend

Next Tasks
1. Frontend Setup — clean React + Vite app in frontend/
2. Connect frontend to backend (API calls to Render FastAPI) once DB is ready
3. Later: backend + PostgreSQL + AWS S3 + Cognito integration




Thanks for installing Sunshine!

To get started, review the documentation at:
  https://docs.lizardbyte.dev/projects/sunshine

To start lizardbyte/homebrew/sunshine now and restart at login:
  brew services start lizardbyte/homebrew/sunshine
Or, if you don't want/need a background service you can just run:
  /usr/local/opt/sunshine/bin/sunshine /Users/alteredart/.config/sunshine/sunshine.conf