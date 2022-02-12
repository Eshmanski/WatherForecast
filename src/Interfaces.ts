import {InsertPosition} from "./utils";
import { Component } from "./components/Component";

export interface City {
    city: string;
    temperature: string;
}

export interface RenderOptions {
    child: Component;
    insertPosition: InsertPosition;
}