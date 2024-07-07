from app import create_app
from utils.my_log import LOG
from db import LOBBIES, SESSIONS


app = create_app()

from apscheduler.schedulers.background import BackgroundScheduler
import time

def my_job():
    for lob in LOBBIES.values():
        LOG(f"{lob}")

scheduler = BackgroundScheduler()
scheduler.add_job(my_job, 'interval', seconds=1)
scheduler.start()