import React from 'react';
import { InteractionManager, LayoutAnimation, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import GeneralPickCell from './GeneralPickerCell';

export default class extends React.Component {
    /**
     * dataSource：二维数组数据源，一维表示列，二维表示行。
     * onDismiss：取消操作。
     * onFinish：确定操作。
     * selectedItems：选中的数据索引值。
     * onSelectedItemChange：选中项发生改变时。
     */

    constructor(props) {
        super(props);
        this.scrollView = {};
        this.state = {
            dataSource: props.dataSource,
            modalVisible: props.visible,
            selectedItems: props.selectedItems || [],
            frame: {
                top: Dimensions.get('window').height,
                right: 0,
                left: 0,
            },
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: nextProps.dataSource,
            modalVisible: nextProps.visible,
            selectedItems: nextProps.selectedItems,
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                this._show();
            }, 5);
        });
    }

    _clickButton = (isOK) => {
        this.setState({
            modalVisible: false,
        });
        if (isOK) {
            this.props.onFinish(this.state.selectedItems);
        }
        this.props.onDismiss();
    };

    _show = () => {
        LayoutAnimation.configureNext({
            duration: 250,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut
            }
        });
        this.setState({
            frame: {
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
            },
        });
    };

    _onSelectionChange = (index, itemValue) => {
        this.state.selectedItems[index] = itemValue;
        this.setState({selectedItems: new Array(this.state.selectedItems)});
        this.props.onSelectedItemChange && this.props.onSelectedItemChange(index, this.state.selectedItems);
    };

    _renderPickerItem = (index, rows, dataSource) => {
        const height = 256;
        const currentValue = this.state.selectedItems[index] || rows[0];
        return (
            <GeneralPickCell
                key={index}
                data={rows}
                totalCount={dataSource.length}
                value={currentValue}
                height={height}
                onValueChange={this._onSelectionChange.bind(this, index)}
            />
        );
    };

    _renderButton = (text, func) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={func} style={styles.button}>
                <Text style={styles.buttontext}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    };

    render() {
        const {dataSource} = this.props;
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={this._clickButton.bind(this, false)}
            >
                <View style={[styles.container, {width: Dimensions.get('window').width, height: Dimensions.get('window').height}]}>
                    <View style={[styles.popview, this.state.frame]}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.bgview}
                            onPress={this._clickButton.bind(this, false)}
                        >
                            <View />
                        </TouchableOpacity>
                        <View style={styles.toolbar}>
                            {this._renderButton('取消', this._clickButton.bind(this, false))}
                            {this._renderButton('确定', this._clickButton.bind(this, true))}
                        </View>
                        <View style={styles.content}>
                            {dataSource.map((rows, index) => this._renderPickerItem(index, rows, dataSource))}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    popview: {
        position: 'absolute',
        justifyContent: 'flex-end',
    },
    bgview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    toolbar: {
        height: 44,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: 44,
        height: 44,
        marginLeft: 16,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttontext: {
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
    },
    content: {
        flexDirection: 'row',
    },
    picker: {
        height: 256,
        backgroundColor: '#ffffff',
    },
});