const Bosun = () => {

     fetch("https://api.github.com/users/Bard")
        .then((response) => {
          if (!response.ok)
            throw Error("could not Fetch the data for that fetch");

          return response.json();
        })
 
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
        });   
         return (<li>hey</li>);
}
 
export default Bosun;