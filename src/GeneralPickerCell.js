import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

export default class extends React.Component {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        totalCount: PropTypes.number.isRequired,
        value: PropTypes.any.isRequired,
        height: PropTypes.number.isRequired,
        viewCount: PropTypes.number.isRequired,
        onValueChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
    }

    componentDidMount() {
        this._updateLocation(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        }, () => {
            this._updateLocation(nextProps);
        });
    }

    _updateLocation = (props) => {
        const currentValue = props.value || props.data[0];
        const currentIndex = props.data.indexOf(currentValue) < 0 ? 0 : props.data.indexOf(currentValue);
        this.scrollView && this.scrollView.scrollTo({x: 0, y: this._itemHeight() * currentIndex, animated: false});
    };

    _itemHeight = () => this.props.height / this.props.viewCount;
    _itemWidth = () => Dimensions.get('window').width / this.props.totalCount;

    _scrollToIndex = (toIndex, curY) => {
        if (toIndex === undefined) {
            toIndex = Math.round(curY / this._itemHeight());
        }
        const itemValue = this.state.data[toIndex];
        this.props.onValueChange && this.props.onValueChange(itemValue);
    };

    _renderEmptyLine = (width, itemHeight) => {
        return <Text style={[styles.text, {height: itemHeight, lineHeight: itemHeight, width}]} />;
    };

    _renderSeperatorLine = (top) => {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: top,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: '#e6e6ea',
                }}
            />
        );
    };

    _renderRowDefault = (item) => {
        const itemStyle = Platform.select({
            android: {textAlignVertical: 'center'},
            ios: {lineHeight: this._itemHeight()},
        });
        return (
            <Text style={[styles.text, {height: this._itemHeight(), width: this._itemWidth()}, itemStyle]}>
                {item.toString()}
            </Text>
        );
    };

    render() {
        const {height, totalCount, identifier} = this.props;
        const renderRow = this.props.renderRow || this._renderRowDefault;
        const width = this._itemWidth();
        const halfCount = Math.floor(this.props.viewCount / 2);
        return (
            <View>
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    style={[styles.scrollview, {width, height}]}
                    showsVerticalScrollIndicator={false}
                    onScrollEndDrag={(event) => {
                        if (Platform.OS === 'android' || event.nativeEvent.velocity.y === 0) {
                            this._scrollToIndex(undefined, event.nativeEvent.contentOffset.y);
                        }
                    }}
                    onMomentumScrollEnd={(event) => {
                        this._scrollToIndex(undefined, event.nativeEvent.contentOffset.y);
                    }}
                >
                    {new Array(halfCount).fill(1).map(() => this._renderEmptyLine(width, this._itemHeight()))}
                    {this.state.data.map((item, num) => (
                        <TouchableOpacity key={num} onPress={() => this._scrollToIndex(num, undefined)}>
                            {renderRow(item, num, identifier)}
                        </TouchableOpacity>
                    ))}
                    {new Array(halfCount).fill(1).map(() => this._renderEmptyLine(width, this._itemHeight()))}
                </ScrollView>
                {this._renderSeperatorLine(halfCount * this._itemHeight())}
                {this._renderSeperatorLine((halfCount + 1) * this._itemHeight())}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollview: {
        backgroundColor: 'white',
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
    },
});