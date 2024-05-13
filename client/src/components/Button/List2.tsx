interface Listprops{
    name: String;
    calories: number;
}

function List(props:Listprops){



  const fruits = [
    { name: "Apple", calories: 95 },
    { name: "Orange", calories: 69 },
    { name: "Watermelon", calories: 88 },
    { name: "Banana", calories: 45 },
    { name: "Pineapple", calories: 73 },
  ];

  const fruitsList = fruits.map((fruit) => <li key = {fruit.name}>{fruit.name} {fruit.calories}</li>)

  
  return(<ul>
      {fruitsList}
  </ul>)

}

List.defaultProps = {
 name: "ExpectedFruit",
 calories: 999999
}

export default List;
