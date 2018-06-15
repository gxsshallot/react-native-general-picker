import React from 'react';
import PropTypes from 'prop-types';
import * as CityProvider from './CityProvider';

export default class extends React.Component {
    static propTypes = {
        onFinish: PropTypes.func.isRequired,
        onDismiss: PropTypes.func,
        visible: PropTypes.bool,
        value: PropTypes.object,
        type: PropTypes.oneOf(['province', 'city', 'district'])
    };

    static defaultProps = {
        type: 'district'
    };

    constructor(props) {
        super(props);
        this.defaultValue = this._getDefaultValue();
        const items = this._getSelectedItems(props.value);
        this.state = {
            selectedItems: items,
            dataSource: this._generateDataSource(items),
        };
    }

    componentWillReceiveProps(nextProps) {
        const items = this._getSelectedItems(nextProps.value);
        this.setState({
            selectedItems: items,
            dataSource: this._generateDataSource(items),
        });
    }

    _onFinish = (selectedItems) => {
        const result = {};
        if (selectedItems.length > 0) {
            const provinces = CityProvider.getProvinces();
            const province = provinces[selectedItems[0]];
            result.province = {code: province.id, name: province.name};
            if (selectedItems.length > 1) {
                const citys = CityProvider.getCityInProvince(province);
                const city = citys[selectedItems[1]];
                result.city = {code: city.id, name: city.name};
                if (selectedItems.length > 2) {
                    const districts = CityProvider.getDistrictInCity(province, city);
                    const district = districts.filter(item => item.name === selectedItems[2]);
                    if (district.length > 0) {
                        result.district = {code: district[0].id, name: district[0].name};
                    }
                }
            }
        }
        this.props.onFinish && this.props.onFinish(result);
    };

    _onSelectedItemChange = (index, selectedItems) => {
        if (index > 1) {
            this.setState({selectedItems});
            return;
        }
        const newDataSource = this._generateDataSource(selectedItems);
        const newSelectedItems = [selectedItems[0]];
        const oldSelectedItems = this.state.selectedItems;
        const oldDataSource = this.state.dataSource;
        if (this.props.type === 'city' || this.props.type === 'district') {
            const cityIndex = oldDataSource[1].indexOf(oldSelectedItems[1]);
            if (cityIndex >= newDataSource[1].length) {
                newSelectedItems.push(newDataSource[1][0]);
            } else {
                newSelectedItems.push(newDataSource[1][cityIndex]);
            }
        }
        if (this.props.type === 'district') {
            const districtIndex = oldDataSource[2].indexOf(oldSelectedItems[2]);
            if (districtIndex >= newDataSource[2].length) {
                newSelectedItems.push(newDataSource[2][0]);
            } else {
                newSelectedItems.push(newDataSource[2][districtIndex]);
            }
        }
        this.setState({
            dataSource: newDataSource,
            selectedItems: newSelectedItems,
        });
    };

    _getDefaultValue() {
        const result = {province: {}, city: {}, district: {}};
        const {CityPickListData: {tree}} = CityProvider;
        if (tree && tree.length > 0) {
            const [{children, label}] = tree;
            result.province.name = label;
            if (children && children.length > 0) {
                const [{children: districts, label: city}] = children;
                result.city.name = city;
                if (districts && districts.length > 0) {
                    const [{label: district}] = districts;
                    result.district.name = district;
                }
            }
        }
        return result;
    }

    _getSelectedItems = (value) => {
        let newValue = [value.province.name || this.defaultValue.province.name,
            value.city.name || this.defaultValue.city.name, value.district.name || this.defaultValue.district.name];

        if (this.props.type === 'province') {
            newValue = [value.province.name || this.defaultValue.province.name];
        }
        if (this.props.type === 'city') {
            newValue = [value.province.name || this.defaultValue.province.name,
                value.city.name || this.defaultValue.city.name];
        }
        return newValue.filter(val => val.length !== 0);
    };

    _generateDataSource = (items) => {
        let selectedProvince, cityData, citys, districts;
        const data = CityProvider.getProvinces();
        const provinces = Object.values(data).map(value => value.name);

        if (this.props.type === 'city' || this.props.type === 'district') {
            selectedProvince = data[items[0]] || data[provinces[0]];
            cityData = CityProvider.getCityInProvince(selectedProvince);
            citys = Object.values(cityData).map(value => value.name);
        }

        if (this.props.type === 'district') {
            const selectedCity = cityData[items[1]] || cityData[citys[0]];
            const districtData = CityProvider.getDistrictInCity(selectedProvince, selectedCity);
            districts = districtData.map(value => value.name);
        }
        return [provinces, citys, districts].filter(item => item);
    };

    render() {
        const {visible, onDismiss} = this.props;
        const {GeneralPicker} = global.common;
        return (
            <GeneralPicker
                dataSource={this.state.dataSource}
                visible={visible}
                selectedItems={this.state.selectedItems}
                onDismiss={onDismiss}
                onFinish={this._onFinish}
                onSelectedItemChange={this._onSelectedItemChange}
            />
        );
    }
}