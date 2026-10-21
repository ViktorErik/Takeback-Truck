from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import formhandler

#Create an virtual environment in the backend folder and pip install -r .\requirements.txt
#Create an env file and write DATABASE_URL = (url from mikael)
#in the frontend do npm install axios
#To run the backend write python -m uvicorn main:app --reload --port 8000 while in the backend directory
#You have to run the backend and the frontend seperately in two terminals so make another terminal and do npm run dev while in the frontend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/bookings")
def add_item(data: dict):

    customerName = data["customer"]["name"]

    method = data["pickup"]["method"]

    if method == "station":
        station = data["pickup"]["stationId"]
    else:
        station = "none"

    pickupAddress = data["customer"]["pickupAddress"]

    items = data["items"]
    
    for item in items:
        itemID = item["product"]["id"]
        itemName = item["product"]["name"]
        itemType = item["product"]["kind"]

        formhandler.add_form(customerName, pickupAddress, station, itemID, itemName, itemType)

    return {"message": "Booking received successfully"}