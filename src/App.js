import React from "react";
import "./App.css";
import { TourList } from "./components/tour-list/tour-list.component";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tours: [],
      tourSearch: "",
    };
  }
  componentDidMount() {
    fetch(
      "https://www.mydriver.com/api/v5/locations/autocomplete?searchString=muc"
    )
      .then((response) => response.json())
      .then((tours) => {
        console.log(tours);
        this.setState({ tours: tours });
      });
  }

  render() {
    const { tours, tourSearch } = this.state;

    return (
      <div className="App">
        <h1>Munich Sightseeing</h1>
        <TourList tours={tours}></TourList>
      </div>
    );
  }
}

export default App;
