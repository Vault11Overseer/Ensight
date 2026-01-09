# Ensight

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


OPTION A — KEEP YOUR STACK, CHANGE HOSTING
PostgreSQL or MySQL




Hosting options (cheap → scalable)
DigitalOcean Droplet
AWS EC2
Railway
Render
Fly.io
AWS ECS (later)





OPTION C — Hybrid
Keep FastAPI on:
Railway / Render / Fly.io
Host React build on:
cPanel OR S3





Backend
FastAPI
Gunicorn + Uvicorn
Hosted on Render / Railway / AWS EC2

Frontend
React + Vite
Hosted on S3 + CloudFront
Auth
AWS Cognito

Images
S3 (already good)
