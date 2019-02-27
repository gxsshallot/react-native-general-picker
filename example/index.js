import React from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Pickers from 'react-native-general-picker';

class Example extends React.Component {
    general = {
        dataSource: [
            ['001', '002'],
            ['201', '202'],
            ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111']
        ],
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: null,
        };
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollview}>
                    {this._renderItem(
                        'GeneralPicker',
                        Pickers.showGeneralPicker,
                        this.general
                    )}
                    <Text style={styles.text}>
                        {'Selected Items: ' + JSON.stringify(this.state.selectedItems)}
                    </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }

    _renderItem(label, func, config) {
        return (
            <TouchableOpacity
                onPress={this._showItem.bind(this, func, config)}
                style={styles.touch}
            >
                <Text style={styles.text}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    }

    _showItem(func, config) {
        func({
            ...config,
            onDismiss: this._onDismiss.bind(this),
            onFinish: this._onFinish.bind(this),
            selectedItems: this.state.selectedItems,
        });
    }

    _onDismiss() {
        this.setState({
            selectedItems: null,
        });
    }

    _onFinish(selectedItems) {
        this.setState({
            selectedItems: selectedItems,
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue',
    },
    scrollview: {
        flex: 1,
    },
    touch: {
        height: 44,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#e15151',
        borderRadius: 4,
        overflow: 'hidden',
    },
    text: {
        fontSize: 16,
        lineHeight: 44,
        textAlignVertical: 'center',
        textAlign: 'center',
        color: 'white',
    },
});

AppRegistry.registerComponent('test', () => Example);