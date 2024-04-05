import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const URL = #URL
const path = '/fetchItem'
const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [items_data, setItems_data] = useState([])

  const handleSearch = async () => {
   
    const body = { item_name: searchQuery };
  let results = [];
  const response = await fetch(URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    for (let i = 0; i < data.length; i++) { // Initialize loop variable i
      results.push({ id: i, title: data[i]['prodName'] });
    }
    setSearchResults(results);
    setItems_data(data); // Set the state variable with fetched data
  } else {
    console.error("Failed to fetch search results");
  }
    console.log(results)
    setSearchResults(results);
  };

  const goToGrading = (index) => {
    if(items_data.length > 0){
      let data_for_grading = {score : [items_data[index].finalGrade]}
      let results = items_data[index]
      let data = {}
      for(const key in results){
        if(key.includes('_o')){
          console.log(key)
          data[key] = results[key]
        }
      }
      data_for_grading.score.push(data)
      console.log(data_for_grading)
      navigation.navigate('GradeScreen', data_for_grading)
    }
    
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        placeholder="Search..."
        onSubmitEditing={handleSearch}
      />
        <FlatList
            data={searchResults}
            renderItem={({ item, index }) => (
            <View style={styles.resultItem}>
                <Text onPress={()=> {goToGrading(index)}}>{item.title}</Text>
            </View>
            )}
            keyExtractor={item => item.id.toString()}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    height: '90%',
    width: '100%'
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultItem: {
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default SearchScreen;
