Notes on Guy's revision:

Backend utilities routing:
    instead of @app now we have @router.
    There's router logic at __init__.py.
    Use names like @router.get("/join_lobby2"), which will  be 
    translated to the full name

    add 'router = APIRouter()' at every file, at import it
    at __init__.py.

    
!
!
!
IMPORTANT!   -   Make sure to 'cd ./frontend' before installing new node packages
!
!
!






Startup:

>>> pip install fastapi
>>> pip install uvicorn
>>> pip install APScheduler
>>> pip install eval7
>>> npm i axios
>>> npm i react-router-dom
>>> npm install lucide-react
>>> npm install @radix-ui/react-slot
>>> npm install -D tailwindcss
>>> npm install @radix-ui/react-toast
>>> npm install @radix-ui/react-slider
>>> and many more...

React helpful links:
https://react.dev/learn/add-react-to-an-existing-project
https://medium.com/@dennisivy/fast-api-react-crud-app-with-harperdb-5834af537c23

Component libraries:
https://ui.shadcn.com/
npx shadcn-ui@latest init ### DO NOT RUN THIS!
https://tailwindcss.com/
npm install -D tailwindcss

For logs at backend:
Use the function LOG(msg), then run:
>>> uvicorn main:app --log-level debug --reload

To run without logs:
>>> fastapi dev main.py

Frontend:
>>> npm start


For query brose at:
http://127.0.0.1:8000/items/5?q=somequery

For docs brose at:
http://127.0.0.1:81/api/docs


python server:
http://127.0.0.1:8000/

react server:
http://localhost:3000  