import Map, {Marker, Popup} from 'react-map-gl/mapbox';
import { useState} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapComponent.css';
import ikeaTruckIcon from '../assets/ikeaTruckIcon.png';

function MapComponent() {
    type Location = {
        id: number;
        latitude: number;
        longitude: number;
        title: string;
        address: string;
        link: string;
    };
    const locations = [
    {
        id: 1,
        latitude: 57.68793589674053, 
        longitude: 11.992513993521417,
        title: 'Johanneberg (Olofshöjd)',
        address: 'Omgången 403, 412 80, Göteborg',
        link: "https://maps.app.goo.gl/62fatmjgTJoTgZzT7",
    },
    {
        id: 2,
        latitude: 57.68410899309579,
        longitude:  11.972685812793026,
        title: 'Guldheden',
        address: 'Doktor Håléns Gata 1, 413 23 Göteborg',
        link: "https://maps.app.goo.gl/rRXbaEGx7aGsNLzm8",
    },
    {
        id: 3,
        latitude: 57.681033298776484, 
        longitude:  11.985522192745561,
        title: 'Mossen',
        address: 'Mossgatan 1, 412 58 Göteborg',
        link: "https://maps.app.goo.gl/KzXKPr7H49aq5SMC8",
    },
    {
        id: 4,
        latitude: 57.690542718260325,  
        longitude:  11.966638135741782,
        title: 'Wavrinskys Plats',
        address: 'Daniel Petterssons Gata 1B, 413 20 Göteborg',
        link: "https://maps.app.goo.gl/3qiZynec2DRizZni8",
    },
    {
        id: 5,
        latitude: 57.67557558213772,  
        longitude:  11.991411686289299, 
        title: 'Krokslätt',
        address: 'Krokslätts Parkgata 61C, 431 68 Mölndal',
        link: "https://maps.app.goo.gl/fXKeMVFQGaQNnAYD7",
    },
    {
        id: 6,
        latitude: 57.692441943155664,   
        longitude:  11.97862281714893, 
        title: 'Johanneberg (Centralt)',
        address: "Vidblicksgatan 6, 412 57 Göteborg",
        link: "https://maps.app.goo.gl/dSbTEwrYQdZXcKkd7",
    },
    {
        id: 7,
        latitude: 57.67273074008714,    
        longitude:  11.97881488949875, 
        title: 'Toltorp',
        address: "Fässbergsgatan 50, 431 69 Mölndal",
        link: "https://maps.app.goo.gl/xAJCzzQtYk6Gb3Mm8",
    },
    {
        id: 8,
        latitude: 57.70240312179236,   
        longitude:  12.003804118387334,   
        title: 'Örgryte',
        address: "Örgrytevägen 1, 416 64 Göteborg",
        link: "https://maps.app.goo.gl/nBkoB8JqMvWocZ1b9",
    },
    {
        id: 9,
        latitude: 57.70719810040272,  
        longitude:  11.938454700349041,   
        title: 'Lindholmen',
        address: "Lindholmspiren 5, 417 56 Göteborg",
        link: "https://maps.app.goo.gl/QJRSirn2nWEgiqr38",
    },
];
    const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);
    return (
        <div className="map-div">
            <Map
                onClick={() => setSelectedMarker(null)}
                initialViewState={{
                    latitude: 57.68939474033651, 
                    longitude: 11.974088419824072,
                    zoom: 13
                }}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{ borderRadius: '20px', border: '1px solid black' }}
                mapStyle="mapbox://styles/mapbox/standard"
            >
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    longitude={location.longitude}
                    latitude={location.latitude}
                    anchor="bottom"
                >
                    <div 
                    className="ikea-pin" 
                    onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(location);}}
                    >
                        <div className="ikea-pin-icon">
                            <img src={ikeaTruckIcon} width='100%' height='100%' alt="IKEA Truck Icon" />
                        </div>
                    </div>
                </Marker>
            ))}  
            {selectedMarker && (
                <Popup
                    longitude={selectedMarker.longitude}
                    latitude={selectedMarker.latitude}
                    anchor="bottom"
                    onClose={() => setSelectedMarker(null)}
                    closeOnClick={false}
                    className="marker-popup"
                >
                    <div className="marker-popup-content">
                        <h3>{selectedMarker.title}</h3>
                        <p>{selectedMarker.address}</p>
                        <a href={selectedMarker.link} target="_blank" rel="noopener noreferrer">Get Directions</a>
                    </div>
                </Popup>
            )} 
            </Map>
        </div>
    );
}

export default MapComponent;