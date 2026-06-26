// D:\AegisGeoInt\frontend\src\components\CommandCenter\WeatherPanel.jsx
import React from 'react';
import { Cloud, Wind, Droplets, Eye, Gauge, Sun, CloudRain } from 'lucide-react';

const WeatherPanel = () => {
  const weather = {
    location: 'Jayapura, Papua',
    condition: 'Berawan',
    temperature: 29,
    forecast: [
      { day: 'Fri', temp: 29, icon: 'cloud' },
      { day: 'Sat', temp: 30, icon: 'sun' },
      { day: 'Sun', temp: 31, icon: 'sun' },
      { day: 'Mon', temp: 24, icon: 'cloud-rain' }
    ],
    details: {
      wind: '12 km/h',
      humidity: '79%',
      visibility: '10 km',
      pressure: '1012 hPa'
    }
  };

  const getWeatherIcon = (type) => {
    switch(type) {
      case 'sun': return <Sun size={24} className="text-yellow" />;
      case 'cloud': return <Cloud size={24} className="text-gray" />;
      case 'cloud-rain': return <CloudRain size={24} className="text-blue" />;
      default: return <Cloud size={24} className="text-gray" />;
    }
  };

  return (
    <div className="weather-panel">
      <div className="card-header">
        <h3 className="card-title">
          <Cloud size={18} />
          WEATHER CONDITIONS
        </h3>
        <span className="update-time">Updated: 10:25</span>
      </div>

      <div className="weather-main">
        <div className="weather-location">
          <span className="location-name">{weather.location}</span>
          <span className="location-condition">{weather.condition}</span>
        </div>
        <div className="weather-temp">
          <span className="temp-value">{weather.temperature}°C</span>
          <div className="temp-icon">
            {getWeatherIcon('cloud')}
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <Wind size={16} />
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weather.details.wind}</span>
        </div>
        <div className="detail-item">
          <Droplets size={16} />
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.details.humidity}</span>
        </div>
        <div className="detail-item">
          <Eye size={16} />
          <span className="detail-label">Visibility</span>
          <span className="detail-value">{weather.details.visibility}</span>
        </div>
        <div className="detail-item">
          <Gauge size={16} />
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{weather.details.pressure}</span>
        </div>
      </div>

      <div className="weather-forecast">
        {weather.forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <span className="forecast-day-name">{day.day}</span>
            {getWeatherIcon(day.icon)}
            <span className="forecast-temp">{day.temp}°</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .weather-panel {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #8899aa;
          text-transform: uppercase;
        }

        .card-title svg {
          color: #4fc3f7;
        }

        .update-time {
          font-size: 11px;
          color: #8899aa;
        }

        .weather-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px 0;
        }

        .weather-location {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .location-name {
          font-size: 16px;
          font-weight: 600;
          color: #e0e8f0;
        }

        .location-condition {
          font-size: 13px;
          color: #8899aa;
        }

        .weather-temp {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .temp-value {
          font-size: 36px;
          font-weight: 700;
          color: #e0e8f0;
        }

        .text-yellow { color: #ffc107; }
        .text-gray { color: #8899aa; }
        .text-blue { color: #4fc3f7; }

        .weather-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 16px 20px;
        }

        .weather-details .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #8899aa;
        }

        .weather-details .detail-item svg {
          color: #4fc3f7;
          width: 16px;
          height: 16px;
        }

        .weather-details .detail-value {
          color: #e0e8f0;
          font-weight: 500;
        }

        .weather-forecast {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding: 0 20px 16px;
        }

        .forecast-day {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
        }

        .forecast-day-name {
          font-size: 11px;
          font-weight: 600;
          color: #8899aa;
        }

        .forecast-temp {
          font-size: 13px;
          font-weight: 500;
          color: #e0e8f0;
        }

        @media (max-width: 768px) {
          .weather-details {
            grid-template-columns: 1fr 1fr;
          }
          
          .weather-forecast {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherPanel;