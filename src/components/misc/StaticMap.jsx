import React from 'react';

export default class StaticMap extends React.Component {
    static propTypes = {
        address: React.PropTypes.string,
        zoom: React.PropTypes.number,
    }

    componentDidMount() {
        const coordinatesPromise = this.getCoordinates();
        this.loadLeafletScript().then(() => {
            return coordinatesPromise;
        })
        .then((coordinates) => {
            this.initMap(coordinates)
        })
    }

    getCoordinates() {
        const address = this.props.address;
        return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    return [parseFloat(lat), parseFloat(lon)];
                }
            })
            .catch((err) => {
                console.log('Error: Address not found!');
            })
    }

    initMap(coordinates) {
        const map = L.map('map', {
            zoomControl: false,
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            boxZoom: false,
            keyboard: false,
        }).setView(coordinates, this.props.zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    loadLeafletScript() {
        return new Promise((resolve, reject) => {
            if (typeof L === 'undefined') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            } else {
                resolve();
            }
        });
    }

    render() {
        return <div id="map" style={{height: 300, width: "100%"}}></div>
    }
}
