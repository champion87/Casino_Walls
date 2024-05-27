import logging
import uvicorn

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

def LOG(msg):
    logger.debug(msg)