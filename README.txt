Startup:

>>> pip install fastapi
>>> pip install uvicorn


For logs:
Use the function LOG(msg), then run:
>>> uvicorn main:app --log-level debug --reload

To run without logs:
>>> fastapi dev main.py


For query brose at:
http://127.0.0.1:8000/items/5?q=somequery

For docs brose at:
http://127.0.0.1:8000/docs