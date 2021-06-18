import React from "react";
import "./App.css";
import { TourList } from "./components/tour-list/tour-list.component";
import { SearchBox } from "./components/search-box/search-box.component";
import { DEFAULT_TOURS_DATA } from "./assets/data/tours/default-tours.data";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tours: [],
      offers: [],
      tourSearch: "",
      originPlaceId: "",
      selectedStartDate: "2021-11-22T12:45:00+02:00",
      duration: "200",
      type: "DURATION",
    };
  }
  // handleChange = (e) => {
  //   this.setState({ searchField: e.target.value });
  // };
  handleTourPick = (id) => {
    // console.log("Trigger", id);
    // this.setState({ pickedTourId: id }, () => console.log("DATA", this.state));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originPlaceId: id,
        selectedStartDate: this.state.selectedStartDate,
        duration: this.state.duration,
        type: this.state.type,
      }),
    };
    fetch("https://www.mydriver.com/api/v5/offers", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("RESPONSE", data);
        // this.setState({ offers: data }, () =>
        //   console.log("OFFERS", this.state)
        // );
      });
    console.log();
  };
  componentDidMount() {
    // fetch(
    //   "https://www.mydriver.com/api/v5/locations/autocomplete?searchString=Nymphenburg"
    // )
    //   .then((response) => response.json())
    //   .then((tours) => {
    //     console.log(tours);
    //   });
    this.setState({ tours: DEFAULT_TOURS_DATA }, () =>
      console.log("DATA", this.state)
    );
    console.log("DATA", this.state.tours);
  }

  render() {
    const { tours, tourSearch } = this.state;

    return (
      <div className="App">
        <SearchBox
          placeholder="search tours"
          handleChange={this.handleChange}
        />
        <h1>Munich Sightseeing</h1>
        <TourList tours={tours} handleTourPick={this.handleTourPick}></TourList>
      </div>
    );
  }
}

export default App;
