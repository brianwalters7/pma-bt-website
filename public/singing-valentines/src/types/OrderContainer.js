import moment from 'moment';

import Order from './Order';

export default class OrderContainer {

    constructor() {
        this.orders = [];
        this.days = [];
        this.timeslots = [];
    }

    toDataTablesData() {
        var result = [];
        this.orders.forEach((order, index) => {
            result.push(order.getKeyValueWithData());
        });
        return result;
    }

    getDaysDropdownValues() {
        return this.days.map(day => [day, new moment(day, 'YYYY-MM-DD').format('dddd, MMMM D')] );
    }

    getSongsDropdownValues() {
        return this.songs.map(song => [song.id, song.title]);
    }

    getTimesDropdownValues(selectedDay) {
        return this.timeslots.filter(timeslot => timeslot.day === selectedDay).map(timeslot => [timeslot.id, Order.convertToTimeString(timeslot)]);
    }

    static parseFromJson(ordersJson) {
        console.log(ordersJson);
        var newContainer = new OrderContainer();
        ordersJson.orders.forEach(orderJson => {
            newContainer.orders.push(Order.parseFromJson(orderJson));
        });
        newContainer.days = ordersJson.days.map(value => value.day);
        newContainer.timeslots = ordersJson.timeslots;
        newContainer.songs = ordersJson.songs;
        return newContainer;
    }

    static dataTableColumnsConfig() { 
        return Order.viewTableOrdering.map(value => { return {title: Order.getReadableName(value), data: value} });
    }



}