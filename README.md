# Insight

Blue:
#263248

Green:
#BDD63B




Subject: cPanel Limitations and Recommended Hosting Option

Hi [Boss’s Name],

This app cannot run on our cPanel/WHM environment due to a platform mismatch.

The backend uses FastAPI, which runs on **ASGI (Asynchronous Server Gateway Interface)**. ASGI requires a persistent, long-running server process (such as Uvicorn) to handle asynchronous and concurrent requests. cPanel is built around PHP and **WSGI (Web Server Gateway Interface)**, which assumes short-lived request/response cycles and does not support persistent ASGI servers. Because of this, the backend cannot stay running or operate reliably on cPanel.

cPanel also does not support Node-based build steps for the React frontend, background workers, or proper reverse proxying and process management without paid custom configuration. It was designed for older shared PHP hosting, not modern full-stack applications.

A better option is **Render**, which is designed for this type of architecture and provides process management, HTTPS, and deployments out of the box.

Approximate Render pricing:

* Backend (FastAPI ASGI service): ~$7–$25/month
* Frontend (React static site): Free
* PostgreSQL database: ~$7/month (starter tier)

Total expected cost is roughly **$15–$40/month**, depending on usage.

I’m currently working in a development environment and should have a test solution available soon.

Best,
[Your Name]

Is AWS Cognito free? And is it a good fit?
✅ Yes — for your case, Cognito is effectively free.
AWS Cognito pricing (simplified):
50,000 Monthly Active Users free
You need ~100 internal employees
You are orders of magnitude under the free tier

So:
👉 Cost = $0
3️⃣ Is Cognito a good fit for your stack?

Given your setup:
✅ FastAPI backend
✅ React frontend
✅ S3 for images
✅ AWS already in use
❌ Want to avoid Auth0 pricing surprises

Cognito is actually the correct choice here.
Why Cognito fits Insight well
Requirement	Cognito
Internal users	✅ Excellent
JWT-based auth	✅ Native
FastAPI integration	✅ Easy
S3 access control	✅ Best-in-class
Free tier	✅
Vendor lock-in risk	⚠️ Moderate but acceptable
Enterprise-style setup	✅

Auth0 / Clerk are great, but Cognito:

Integrates directly with S3

Lets you issue IAM roles

Avoids another SaaS dependency



Backend
FastAPI
Gunicorn + Uvicorn
Hosted on Render

Frontend
React + Vite
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