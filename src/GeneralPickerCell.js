import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

export default class extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        totalCount: PropTypes.number.isRequired,
        value: PropTypes.any.isRequired,
        height: PropTypes.number.isRequired,
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        }, () => {
            this._updateLocation(nextProps);
        });
    }

    render() {
        const {height, totalCount} = this.props;
        const width = Dimensions.get('window').width / totalCount;
        const itemStyle = Platform.select({
            android: {textAlignVertical: 'center'},
            ios: {lineHeight: this._itemHeight()}
        });
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
                    {this._renderEmptyLine(width, this._itemHeight())}
                    {this._renderEmptyLine(width, this._itemHeight())}
                    {this.state.data.map((item, num) => (
                        <TouchableOpacity key={num} onPress={() => this._scrollToIndex(num, undefined)}>
                            <Text style={[styles.text, {height: this._itemHeight(), width}, itemStyle]}>
                                {item.toString()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {this._renderEmptyLine(width, this._itemHeight())}
                    {this._renderEmptyLine(width, this._itemHeight())}
                </ScrollView>
                {this._renderSeperatorLine(2 * this._itemHeight())}
                {this._renderSeperatorLine(3 * this._itemHeight())}
            </View>
        );
    }

    _updateLocation = (props) => {
        const currentValue = props.value || props.data[0];
        const currentIndex = props.data.indexOf(currentValue) < 0 ? 0 : props.data.indexOf(currentValue);
        this.scrollView && this.scrollView.scrollTo({x: 0, y: this._itemHeight() * currentIndex, animated: false});
    };

    _itemHeight = () => this.props.height / 5.0;

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