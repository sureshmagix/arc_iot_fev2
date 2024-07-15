import { Text, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Loading from './src/components/Loading';
import CustomText from './src/components/CustomText';
import TextInputExample from './src/components/TextForm';
import SimpleList from './src/components/SimpleList';
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);

  function showComponents(component) {
    console.log('in Show components');
    setLoading(false);
    setShowForm(false);
    setShowList(false);

    if (component === 'loading') {
      setLoading(true);
    } else if (component === 'form') {
      setShowForm(true);
    } else if (component === 'list') {
      setShowList(true);
    } else if (component === 'all') {
      setLoading(true);
      setShowForm(true);
      setShowList(true);
    }
  }

  return (
    <>
      <View>
        <Text style={styles.textStyle}>Demo of components</Text>
      </View>
      <View>
        <Button
          style={[styles.buttons, { backgroundColor: 'red' }]}
          textColor="white"
          labelStyle={{ fontSize: 20 }}
          onPress={() => showComponents('loading')}
        >
          Show Loading
        </Button>
        <Button
          style={[styles.buttons, { backgroundColor: 'blue' }]}
          textColor="white"
          labelStyle={{ fontSize: 20 }}
          onPress={() => showComponents('form')}
        >
          Show Form
        </Button>
        <Button
          style={[styles.buttons, { backgroundColor: 'green' }]}
          textColor="white"
          labelStyle={{ fontSize: 20 }}
          onPress={() => showComponents('list')}
        >
          Show FlatList
        </Button>
        <Button
          style={[styles.buttons, { backgroundColor: 'black' }]}
          textColor="white"
          labelStyle={{ fontSize: 20 }}
          onPress={() => showComponents('all')}
        >
          Show All
        </Button>
      </View>

      {loading && <Loading />}
      {showForm && <TextInputExample />}
      {showList && <SimpleList />}
    </>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  buttons: {
    width: '100%',
    borderRadius: 3,
    marginBottom: 10,
  },
});

export default App;
