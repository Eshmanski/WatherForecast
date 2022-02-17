import {App} from "./app";
import {WeatherService} from "./Weather.service";
import './styles/index.scss';
import 'leaflet/dist/leaflet.css';

const service = new WeatherService();
const app: App = new App(service);
const appElement: Element = document.querySelector('.app');

app.init(appElement);


