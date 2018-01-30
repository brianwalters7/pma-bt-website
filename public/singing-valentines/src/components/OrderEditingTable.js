import React from 'react';

// Integration DataTables with React
// https://medium.com/@zbzzn/integrating-react-and-datatables-not-as-hard-as-advertised-f3364f395dfaimport ApiHelper from '../ApiHelper';

import ApiHelper from '../ApiHelper';
import OrderContainer from '../types/OrderContainer';
import EditOrderModal from './EditOrderModal';

const $ = require('jquery');
$.DataTable = require('datatables.net');

export default class OrderEditingDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderContainer: new OrderContainer(),
            orderBeingEdited: null,
        }
    }

    componentDidMount = () => {
        $(this.refs.main).DataTable({
            dom: '<"#data-table-wrapper"iftlp>',
            data: this.state.orderContainer.toEditDataTablesData(),
            columns: OrderContainer.editDataTableColumnsConfig(),
            ordering: true
        });


        ApiHelper.GetOrderContainer().then(this.onOrderContainerLoaded);
    }

    componentWillUnmount() {
       $('#data-table-wrapper')
           .find('table')
           .DataTable()
           .destroy(true);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Instead of modifying/rerendering the React component, just forward the data to DataTables to handle update.
        const table = $('#data-table-wrapper')
            .find('table')
            .DataTable();
        table.clear();
        table.rows.add(nextState.orderContainer.toEditDataTablesData());
        table.draw();

        let onEditOrderClicked = this.onEditOrderClicked.bind(this);
        $('.edit-button').on('click', function(event) {
            console.log("clicked edit for order " + event.target.dataset.orderId);
            onEditOrderClicked(Number(event.target.dataset.orderId));
        });

        return true;
    }

    onEditOrderClicked(orderId) {
        var order = this.state.orderContainer.getOrderById(orderId);
        console.log(order);
        this.setState({orderBeingEdited: order});

        // $(this.refs.modal).modal();
    }


    onOrderContainerLoaded = (orderContainer) => {
        console.log(orderContainer);
        this.setState({orderContainer: orderContainer});
    }

    // Everythin inside the table element is not touched by React, just by DataTables
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h3>Edit Orders</h3>
                </div>
                <div className="col-md-12">
                    <table ref="main"></table>
                </div>

                <EditOrderModal
                    orderBeingEdited={this.state.orderBeingEdited}
                    orderContainer={this.state.orderContainer}
                    ref="modal">
                </EditOrderModal>
            </div>
        );
    }
}