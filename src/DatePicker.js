import React from 'react';
import GeneralPicker from './GeneralPicker';

/**
 * 日期时间选择控件。
 */
export default class extends React.Component {
    /**
     * dateType：日期时间的格式，Date=日期，Time=日期+时间。
     * timestamp：选中的时间。
     * startYear：开始计算的年分。默认2010
     * yearLength: 需要计算的年份长度。 默认40
     * visible：是否可见。
     * onDismiss：取消操作。
     * onFinish：确定操作。
     */

    constructor(props) {
        super(props);
        const items = this._getDate(props.timestamp);
        this.state = {
            dateType: props.dateType || "Time",
            selectedItems: items,
            dataSource: this._generateDataSource(items),
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const items = this._getDate(nextProps.timestamp);
        this.setState({
            dateType: nextProps.dateType || "Time",
            selectedItems: items,
            dataSource: this._generateDataSource(items),
        });
    }

    _onFinish = (selectedItems) => {
        this.props.onFinish(this._getTimestamp(selectedItems));
    };

    _onSelectedItemChange = (index, selectedItems) => {
        // 日、时、分发生改变时不改变数据源
        if (index >= 2) {
            this.setState({ selectedItems });
            return;
        }
        // 年、月改变时
        const dataSourceNew = this._generateDataSource(selectedItems);
        if (selectedItems[2] > dataSourceNew[2].length) {
            selectedItems[2] = dataSourceNew[2].length;
        }
        this.setState({
            dataSource: dataSourceNew,
            selectedItems: selectedItems,
        });
    };

    _getTimestamp = (selectedItems) => {
        return new Date(
            selectedItems[0],
            selectedItems[1] - 1,
            selectedItems[2],
            this.props.dateType === 'Time' ? selectedItems[3] : 0,
            this.props.dateType === 'Time' ? selectedItems[4] : 0,
            0,
        ).getTime();
    };

    _getDate = (timestamp) => {
        const date = new Date(timestamp ? Number(timestamp) : Date.now());
        return [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
        ];
    };

    _generateDataSource = (selectedItems) => {
        // 年
        const yearArr = new Array(this.props.yearLength || 40).fill(0).map((val, index) => (this.props.startYear || 2010) + index);
        // 月
        const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        // 日
        const dayArr28 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
        const dayArr29 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        const dayArr30 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        const dayArr31 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        // 时
        const hourArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        // 分
        const minArr = new Array(60).fill(0).map((val, index) => index);

        // 日
        let dayArr;
        switch (selectedItems[1]) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                dayArr = dayArr31;
                break;
            case 2:
                if (selectedItems[0] % 4 === 0 && selectedItems[0] % 1000 !== 0 || selectedItems[0] % 400 === 0) {
                    dayArr = dayArr29;
                } else {
                    dayArr = dayArr28;
                }
                break;
            default:
                dayArr = dayArr30;
                break;
        }
        // 数据源
        return this.props.dateType === 'Time' ?
            [yearArr, monthArr, dayArr, hourArr, minArr] :
            [yearArr, monthArr, dayArr];
    };

    render() {
        const { visible, onDismiss } = this.props;
        return (
            <GeneralPicker
                dataSource={this.state.dataSource}
                selectedItems={this.state.selectedItems}
                visible={visible}
                onDismiss={onDismiss}
                onFinish={this._onFinish}
                onSelectedItemChange={this._onSelectedItemChange}
            />
        );
    }
}