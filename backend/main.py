from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#Create an virtual environment in the backend folder and pip install -r .\requirements.txt
#Create an env file and write DATABASE_URL = (url from mikael)
#in the frontend do npm install axios

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/bookings")
def add_item(data: dict):
    name = data["customer"]["name"]
    items = data["items"]
    for item in items:
        itemName = item["product"]["name"]


    print(name, itemName)
    

    return {"message": "Booking received successfully"}