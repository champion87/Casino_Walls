from app import create_app
from utils.my_log import LOG
from db import LOBBIES, SESSIONS


app = create_app()

from apscheduler.schedulers.background import BackgroundScheduler
import time

def my_job():
    for lob in LOBBIES.values():
        LOG(f"{lob}")
        
def clear_lobbies():
    try:
        for key, lob in LOBBIES.items():
            if not lob.is_locked and len(lob.get_players())==0:
                del LOBBIES[key]
    except:
        pass
            
            
scheduler = BackgroundScheduler()
# scheduler.add_job(my_job, 'interval', seconds=1)
# scheduler.add_job(clear_lobbies, 'interval', seconds=1)

scheduler.start()