import {City, ClientData, DragDropOptions, Weather} from './Interfaces';
import {cardType, createElement, SortType, SortTypeMethods, WeatherAction} from "./utils";

export class WeatherService {
    allCities: City[] = [];
    chosenCities: City[] = [];
    clientData: ClientData;
    private dragOption: DragDropOptions = { dragElement: null, cardType: cardType.big };
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
    private emptyCardElement = createElement('<div class="big card-empty _card_empty _card"></div>')

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
        element.addEventListener('dragstart', (event: DragEvent) => {
            this.dragOption.dragElement = element as HTMLElement;
            element.classList.add('small-card-shadow');
        });

        element.addEventListener('dragend', () => {
            const prevCardName: string = (this.emptyCardElement.previousElementSibling as HTMLElement)
                .dataset.name;

            this.changePosition(prevCardName, cityWeather);

            element.classList.remove('small-card-shadow');
            this.dragOption.dragElement = null;
            this.emptyCardElement.remove();
        });
    }

    public makeListDroppable(element: Element) {
        element.addEventListener('dragover', (event: DragEvent) => {
            event.preventDefault();

            const underElement = event.target as HTMLElement
            const underCardElement: HTMLElement = underElement.closest('._card');
            const underListElement: HTMLElement = underElement.closest('._list');

            if (underCardElement?.classList?.contains('_card_empty')
                || (underCardElement === this.dragOption.dragElement)) {
                return;
            }

            this.dragOption.cardType = underListElement.dataset.type as cardType;
            this.resizeEmptyElement();

            if(underCardElement) {
                if(underCardElement.previousElementSibling.classList.contains('_card_empty')) {
                    underListElement.insertBefore(this.emptyCardElement, underCardElement.nextElementSibling);
                } else {
                    underListElement.insertBefore(this.emptyCardElement, underCardElement);
                }
            } else {
                underListElement.append(this.emptyCardElement);
            }
        });
    }

    private changePosition(prevCardName: string, cityWeather: City) {
        const underCardType: cardType = this.dragOption.cardType;
        const dragCardType: cardType = this.dragOption.dragElement.dataset.type as cardType;

        let toData: City[];
        let doUnsetSort: boolean = false;
        let data: City;

        if(underCardType === cardType.big && dragCardType === cardType.small) {
            this.allCities = this.allCities.filter((item: City) => item.city !== cityWeather.city);
            toData = this.chosenCities;

            data = cityWeather;
        } else if(underCardType === cardType.small && dragCardType === cardType.big) {
            this.chosenCities = this.chosenCities.filter((item: City) => item.city !== cityWeather.city);
            toData = this.allCities;

            doUnsetSort = true;
        } else if(underCardType === cardType.big && dragCardType === cardType.big) {
            this.chosenCities = this.chosenCities.filter((item: City) => item.city !== cityWeather.city);
            toData = this.chosenCities;
        } else {
            this.allCities = this.allCities.filter((item: City) => item.city !== cityWeather.city);
            toData = this.allCities;

            doUnsetSort = true;
        }


        if(prevCardName === undefined) {
            toData.unshift(cityWeather);
        } else {
            const idx = toData.findIndex((item: City) => item.city === prevCardName);
            toData.splice(idx + 1, 0, cityWeather);
        }

        if(doUnsetSort) {
            this.sortType = SortType.NONE;
            this.emitEvent(WeatherAction.SORT_UNSET);
        }

        this.emitEvent(WeatherAction.CARD_UPDATE_POSITION, data);
    }


    private resizeEmptyElement() {
        if(this.emptyCardElement.classList.contains(this.dragOption.cardType))
            return;

        switch(this.dragOption.cardType) {
            case cardType.big:
                this.emptyCardElement.classList.replace('small', this.dragOption.cardType);
                break;
            case cardType.small:
                this.emptyCardElement.classList.replace('big', this.dragOption.cardType);
                break;
        }
    }



    private emitEvent(action: WeatherAction, data?: any) {
        window.dispatchEvent(new CustomEvent(action, { detail: data }));
    }
}