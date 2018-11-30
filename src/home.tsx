import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  Image
} from 'react-native';
import { connect, DispatchProp } from 'react-redux';
import { add } from './actions';
import {CounterState} from './statesTypes';

interface State {
}
type Props=CounterState&DispatchProp
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
      'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
  });

const IMAGE_PREFETCH_URL = 'https://origami.design/public/images/bird-logo.png?r=1&t=' + Date.now()
var prefetchTask = Image.prefetch(IMAGE_PREFETCH_URL)
class Home extends Component<Props, State> {
    constructor(props:Props)
    { 
        super(props);
       
    }
    _add = ()=>{

        this.props.dispatch(add())
    };
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native&typescript!</Text>
                <Text style={styles.instructions}>To get started, edit src/App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
                <Text style={styles.instructions}>{this.props.count}</Text>
                <ImageLoadCallbackComponent
                    source={{uri: 'https://origami.design/public/images/bird-logo.png?r=1&t=' + Date.now()}}
                    prefetchedSource={{uri: IMAGE_PREFETCH_URL}}
                />
                <Button  onPress={this._add}  title="add" ></Button>
            </View>
        );
    }
}

class ImageLoadCallbackComponent extends Component {
  constructor(props) {
      super(props)
      this.state = {
          events: [],
          startLoadPrefetched: false,
          mountTime: new Date()
      }
  }

  componentWillMount() {
      this.setState({
          mountTime: new Date()
      })
  }

  render() {
      var {mountTime} = this.state
      return (
          <View>
              <Image
                  source={this.props.source}
                  style={[styles.base, {overflow: 'visible'}]}
                  onLoadStart={() => this._loadEventFired(`✔ onLoadStart (+${new Date() - mountTime}ms)`)}
                  onLoad={(event) => {
                      if (event.nativeEvent.source) {
                          const url = event.nativeEvent.source.url
                          this._loadEventFired(`✔ onLoad (+${new Date() - mountTime}ms) for URL ${url}`)
                      } else {
                          this._loadEventFired(`✔ onLoad (+${new Date() - mountTime}ms)`);
                      }
                  }}
                  onLoadEnd={() => {
                      this._loadEventFired(`✔ onLoadEnd (+${new Date() - mountTime}ms)`);
                      this.setState({startLoadPrefetched: true}, () => {
                          prefetchTask.then(() => {
                              this._loadEventFired(`✔ Prefetch OK (+${new Date() - mountTime}ms)`);
                          }, error => {
                              this._loadEventFired(`✘ Prefetch failed (+${new Date() - mountTime}ms)`);
                          })
                      })
                  }}
              />
              {this.state.startLoadPrefetched ? <Image
                  source={this.props.prefetchedSource}
                  style={[styles.base, {overflow: 'visible'}]}
                  onLoadStart={() => this._loadEventFired(`✔ (prefetched) onLoadStart (+${new Date() - mountTime}ms)`)}
                  onLoad={(event) => {
                      if (event.nativeEvent.source) {
                          const url = event.nativeEvent.source.url
                          this._loadEventFired(`✔ (prefetched) onLoad (+${new Date() - mountTime}ms) for URL ${url}`)
                      } else {
                          this._loadEventFired(`✔ (prefetched) onLoad (+${new Date() - mountTime}ms)`);
                      }
                  }}
                  onLoadEnd={() => this._loadEventFired(`✔ (prefetched) onLoadEnd (+${new Date() - mountTime}ms)`)}
              /> : null}
              <Text style={{marginTop: 20}}>
                  {this.state.events.join('\n')}
              </Text>
          </View>
      )
  }

  _loadEventFired(event) {
      this.setState((state) => {
          return state.events = [...state.events, event]
      })
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    base: {
      width: 38,
      height: 38,
    },
    horizontal: {
        flexDirection: 'row'
    },
    icon: {
        width: 15,
        height: 15,
    },
    background: {
        backgroundColor: '#222222'
    },
    nestedText: {
        marginLeft: 12,
        marginTop: 20,
        backgroundColor: 'transparent',
        color: 'white'
    },
    resizeMode: {
        width: 90,
        height: 60,
        borderWidth: 0.5,
        borderColor: 'black'
    },
    gif: {
        flex: 1,
        height: 200,
    }
  });

  const mapStateToProps = (state:any) => (
    state.counter
)

export default connect(mapStateToProps)(Home);