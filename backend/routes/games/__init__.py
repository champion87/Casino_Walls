from fastapi import APIRouter

router = APIRouter()

#from .lobby import router as lobby_router
#router.include_router(lobby_router, prefix='/lobby')

from .blackjack import router as blackjack_router
router.include_router(blackjack_router, prefix='/{game_key}/blackjack')

#from .wheel_of_fortune import router as wheel_of_fortune_router
#router.include_router(wheel_of_fortune_router, prefix='/wheel_of_fortune')
