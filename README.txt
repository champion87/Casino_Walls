Notes on Guy's revision:

Backend utilities routing:
    instead of @app now we have @router.
    There's router logic at __init__.py.
    Use names like @router.get("/join_lobby2"), which will  be 
    translated to the full name

    add 'router = APIRouter()' at every file, at import it
    at __init__.py.

    





Startup:

>>> pip install fastapi
>>> pip install uvicorn

React helpful links:
https://react.dev/learn/add-react-to-an-existing-project
https://medium.com/@dennisivy/fast-api-react-crud-app-with-harperdb-5834af537c23

Component libraries:
https://v2.chakra-ui.com/
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion

For logs:
Use the function LOG(msg), then run:
>>> uvicorn main:app --log-level debug --reload

To run without logs:
>>> fastapi dev main.py


For query brose at:
http://127.0.0.1:8000/items/5?q=somequery

For docs brose at:
http://127.0.0.1:8000/docs

python server:
http://127.0.0.1:8000/

react server:
http://localhost:3000  