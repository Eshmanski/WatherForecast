import {City, ClientData, Weather} from './Interfaces';
import {createElement, SortType, SortTypeMethods, WeatherAction} from "./utils";

export class WeatherService {
    allCities: City[] = [];
    chosenCities: City[] = [];
    clientData: ClientData;
    private dragOption:
        { draggedElement: Element, type: string } = { draggedElement: null, type: ''};
    private sortType: SortType = SortType.ABC;
    private filterText: string = '';
    private filterWeather: Weather = {
        sunny: false,
        cloudy: false,
        snowy: false,
        rainy: false,
        blizzard: false,
        stormy: false,
        metorite: false
    };
    private emptyCardElement = createElement('<div class="big-card big-card-empty _card_empty _card"></div>')

    constructor() {}

    async fetchMyPosition() {
        this.clientData = await fetch('https://ipinfo.io/json?token=be765effc66354')
            .then((res: Response) => res.json())
            .catch((e) => { throw new Error(e) });

        return this.clientData;
    }

    async fetchAllCity(): Promise<City[]> {
        this.allCities = await fetch('https://geo-weather-json.herokuapp.com/db')
            .then((res: Response) => res.json())
            .then<City[]>(data => data.cities)
            .catch((e) => { throw new Error(e) });

        // // temp code
        // this.chosenCities = [ ...this.allCities ];
        // window.dispatchEvent(new CustomEvent('FETCH_FINISHED'));

        return this.allCities.sort(SortTypeMethods[this.sortType]);
    }

    getCityForSmallList() {
        return this.allCities.filter(
            (cityWeather: City) => {
                if(this.filterText.trim())
                    return cityWeather.city.toLocaleLowerCase().includes(this.filterText);
                else
                    return true;
            }).sort(SortTypeMethods[this.sortType]);
    }

    getCityForBigList() {
        return this.chosenCities.filter((cityWeather: City) => {
            return Object.keys(this.filterWeather)
                .reduce<boolean>((accum: boolean, key: keyof Weather): boolean => {
                    if(this.filterWeather[key]) {
                         return cityWeather.weather[key] && accum
                    }

                    return accum;
            }, true)
        });
    }

    setSortType(sortType: SortType) {
        this.sortType = sortType;
        this.emitEvent(WeatherAction.SORT_CHANGES, sortType);
    }

    setFilterText(inputText: string) {
        if(this.filterText.trim() !== inputText.trim()) {
            this.filterText = inputText.toLocaleLowerCase();
            this.emitEvent(WeatherAction.SEARCH_CHANGES, inputText);
        }
    }

    toggleFilterWeather(key: keyof Weather) {
        this.filterWeather[key] = !this.filterWeather[key];
        this.emitEvent(WeatherAction.FILTER_CHANGES, this.filterWeather[key]);
    }

    public makeCardDraggable(element: Element, cityWeather: City) {
        element.addEventListener('dragstart', () => {
            this.dragOption.draggedElement = element;
            element.classList.add('small-card-shadow');
        });

        element.addEventListener('dragend', () => {
            const prevCardName: string =(this.emptyCardElement.previousElementSibling as HTMLElement).dataset.name;

            this.changePosition(prevCardName, cityWeather);

            element.classList.remove('small-card-shadow');
            this.dragOption.draggedElement = null;
            this.emptyCardElement.remove();
        });
    }

    public makeListDroppable(element: Element) {
        element.addEventListener('dragover', (event: Event) => {
            event.preventDefault();

            const underElement: HTMLElement = event.target as HTMLElement;
            const underCardElement: HTMLElement = underElement.closest('._card');
            const underListElement: HTMLElement = underElement.closest('._list')

            if (underCardElement?.classList?.contains('_card_empty')
                || (underCardElement === this.dragOption.draggedElement)) {
                return;
            }

            this.dragOption.type = underListElement.dataset.type;

            if(underCardElement && underCardElement.dataset.type === 'bigCard') {
                if(underCardElement.previousElementSibling.classList.contains('_card_empty')) {
                    underListElement.insertBefore(this.emptyCardElement, underCardElement.nextElementSibling);
                } else {
                    underListElement.insertBefore(this.emptyCardElement, underCardElement);
                }
            } else if(underListElement.dataset.type === 'bigList') {
                underListElement.append(this.emptyCardElement);
            }
        });
    }

    private emitEvent(action: WeatherAction, data: any) {
        window.dispatchEvent(new CustomEvent(action, { detail: data }));
    }


    private changePosition(prevCardName: string, cityWeather: any) {
        this.allCities = this.allCities.filter((item: City) => item.city !== cityWeather.city);

        if(prevCardName === undefined) {
            this.chosenCities.unshift(cityWeather);
        } else {
            const idx = this.chosenCities.findIndex((item: City) => item.city === prevCardName);
            this.chosenCities.splice(idx + 1, 0, cityWeather);
        }

        this.emitEvent(WeatherAction.CARD_UPDATE_POSITION, cityWeather);
    }
}