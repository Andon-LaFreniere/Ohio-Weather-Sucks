import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [weather, setWeather] = useState(null);

    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const fetchWeatherData = () => {
        const apiKey = "767f7c1703eb60abbfe1dace0"; // Replace with your actual API key
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}`;

        fetch(weatherApiUrl)
            .then((response) => response.json())
            .then((data) => setWeather(data))
            .catch((error) => alert("Failed to fetch weather data: " + error));
    };

    useEffect(() => {
        if (selectedCity) {
            fetchWeatherData();
        }
    }, [selectedCity]);

    return (
        <div className="container">
            <div className="weather-info">
                <h2>Weather Data</h2>
                <label htmlFor="city">Select City:</label>
                <select
                    id="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                >
                    <option value="">--Choose a city--</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                {weather && (
                    <div>
                        <h3>Weather in {selectedCity}</h3>
                        <p>Temperature: {weather.main.temp}K</p>
                        <p>Weather: {weather.weather[0].description}</p>
                    </div>
                )}
            </div>

            <div className="notes-container">
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>

            <div className="form-container">
                <h2>Create a Notification</h2>
                <form onSubmit={createNote}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}

export default Home;