from main import app
from utils.my_log import LOG

from apscheduler.schedulers.background import BackgroundScheduler
import time

def my_job():
    LOG("Task executed", time.strftime("%A, %d. %B %Y %I:%M:%S %p"))

scheduler = BackgroundScheduler()
scheduler.add_job(my_job, 'interval', seconds=1)
scheduler.start()
