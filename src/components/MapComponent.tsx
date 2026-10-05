import Map, {Marker} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapComponent.css';

function MapComponent() {
    const locations = [
    {
        id: 1,
        latitude: 57.68793589674053, 
        longitude: 11.992513993521417,
        title: 'Johanneberg (Olofshöjd)'
    },
    {
        id: 2,
        latitude: 57.68410899309579,
        longitude:  11.972685812793026,
        title: 'Guldheden'
    },
    {
        id: 3,
        latitude: 57.681033298776484, 
        longitude:  11.985522192745561,
        title: 'Mossen'
    },
    {
        id: 4,
        latitude: 57.690542718260325,  
        longitude:  11.966638135741782,
        title: 'Wavrinskys Plats'
    },
    {
        id: 5,
        latitude: 57.67557558213772,  
        longitude:  11.991411686289299, 
        title: 'Krokslätt'
    },
    {
        id: 6,
        latitude: 57.692441943155664,   
        longitude:  11.97862281714893, 
        title: 'Johanneberg (Centralt)'
    },
    {
        id: 7,
        latitude: 57.67273074008714,    
        longitude:  11.97881488949875, 
        title: 'Toltorp'
    },
    {
        id: 8,
        latitude: 57.70240312179236,   
        longitude:  12.003804118387334,   
        title: 'Örgryte'
    },
    {
        id: 9,
        latitude: 57.70719810040272,  
        longitude:  11.938454700349041,   
        title: 'Lindholmen'
    },
];
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Map
                initialViewState={{
                    latitude: 57.68939474033651, 
                    longitude: 11.974088419824072,
                    zoom: 13
                }}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/standard"
            >
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    longitude={location.longitude}
                    latitude={location.latitude}
                    anchor="bottom"
                >
                    <div className="ikea-pin">
                        <div className="ikea-pin-inner">♻</div>
                    </div>
                </Marker>
            ))}   
            </Map>
        </div>
    );
}

export default MapComponent;